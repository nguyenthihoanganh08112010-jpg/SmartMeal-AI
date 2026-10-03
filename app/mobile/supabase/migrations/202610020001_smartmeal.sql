-- Account ownership is enforced on the server, never by a caller-supplied ID.
create table public.smartmeal_accounts(user_id uuid primary key references auth.users(id) on delete cascade,data jsonb not null,revision integer not null default 0,created_at timestamptz not null default now());
create table public.smartmeal_recipes(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,payload jsonb not null,created_at timestamptz not null default now());
create table public.smartmeal_recommendations(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,recipe_id uuid not null references public.smartmeal_recipes(id) on delete cascade,generated_at timestamptz not null default now(),meal_type text not null check(meal_type in ('Bữa chính','Ăn nhẹ')),image_ready boolean not null default false);
create table public.smartmeal_deletion_requests(user_id uuid primary key references auth.users(id) on delete cascade,requested_at timestamptz not null default now(),status text not null default 'pending');
alter table public.smartmeal_accounts enable row level security;
alter table public.smartmeal_recipes enable row level security;
alter table public.smartmeal_recommendations enable row level security;
alter table public.smartmeal_deletion_requests enable row level security;
create policy account_read on public.smartmeal_accounts for select to authenticated using(user_id=auth.uid());
create policy recipe_read on public.smartmeal_recipes for select to authenticated using(user_id=auth.uid());
create policy recommendation_read on public.smartmeal_recommendations for select to authenticated using(user_id=auth.uid());
create policy deletion_read on public.smartmeal_deletion_requests for select to authenticated using(user_id=auth.uid());
revoke all on public.smartmeal_accounts,public.smartmeal_recipes,public.smartmeal_recommendations,public.smartmeal_deletion_requests from anon,authenticated;
grant select on public.smartmeal_accounts,public.smartmeal_recipes,public.smartmeal_recommendations,public.smartmeal_deletion_requests to authenticated;

create function public.smartmeal_load() returns jsonb language plpgsql security definer set search_path='' as $$
declare a public.smartmeal_accounts; today text:=to_char(now() at time zone 'Asia/Ho_Chi_Minh','YYYY-MM-DD');
begin
 if auth.uid() is null then raise exception 'Cần đăng nhập'; end if;
 insert into public.smartmeal_accounts(user_id,data) values(auth.uid(),jsonb_build_object('profile',jsonb_build_object('name','','goal','','taste',''),'occasions','[]'::jsonb,'records','[]'::jsonb,'saved','[]'::jsonb,'persona','hin','firstUse',today,'streakDays',jsonb_build_array(today),'goalHistory','[]'::jsonb)) on conflict do nothing;
 select * into a from public.smartmeal_accounts where user_id=auth.uid() for update;
 if not (a.data->'streakDays' ? today) then
  update public.smartmeal_accounts set data=jsonb_set(data,'{streakDays}',(data->'streakDays')||jsonb_build_array(today)),revision=revision+1 where user_id=auth.uid() returning * into a;
 end if;
 return jsonb_build_object('data',a.data,'revision',a.revision,'recipes',coalesce((select jsonb_agg(payload||jsonb_build_object('id',id)) from public.smartmeal_recipes where user_id=auth.uid()),'[]'),'recommendations',coalesce((select jsonb_agg(jsonb_build_object('id',id,'recipeId',recipe_id,'generatedAt',generated_at,'mealType',meal_type,'imageReady',image_ready)) from public.smartmeal_recommendations where user_id=auth.uid()),'[]'));
end $$;

create function public.smartmeal_save(new_data jsonb,expected_revision integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare a public.smartmeal_accounts; r jsonb; o jsonb; d jsonb; old_o jsonb; old_d jsonb; rec public.smartmeal_recommendations; slot text; mins int; next_revision int;
begin
 if auth.uid() is null then raise exception 'Cần đăng nhập'; end if;
 if pg_column_size(new_data)>2000000 then raise exception 'Dữ liệu quá lớn'; end if;
 select * into a from public.smartmeal_accounts where user_id=auth.uid() for update;
 if not found or a.revision<>expected_revision then raise exception 'Dữ liệu đã thay đổi trên thiết bị khác. Hãy tải lại trước khi lưu; bản nhập hiện tại vẫn được giữ.'; end if;
 if jsonb_typeof(new_data->'records') is distinct from 'array' or jsonb_typeof(new_data->'occasions') is distinct from 'array' or jsonb_typeof(new_data->'saved') is distinct from 'array' then raise exception 'Dữ liệu không hợp lệ'; end if;
 for r in select * from jsonb_array_elements(new_data->'records') loop
  if (r->>'duration') is null or (r->>'duration')::numeric<=0 or (r->>'duration')::numeric='NaN'::numeric then raise exception 'Thời lượng phải lớn hơn 0 phút'; end if;
  if r->>'date' is null or r->>'time' is null or r->>'id' is null then raise exception 'Thiếu định danh bản ghi'; end if;
  perform (r->>'date')::date; perform (r->>'time')::time;
  if r ? 'shape' and (r->>'shape')::int not between 1 and 7 then raise exception 'Hình dạng không hợp lệ'; end if;
  if r ? 'color' and r->>'color' not in ('Trắng/xám','Vàng','Nâu nhạt','Nâu','Nâu đậm','Đen','Rất đậm') then raise exception 'Màu không hợp lệ'; end if;
 end loop;
 if (select count(*) from jsonb_array_elements(new_data->'records'))<>(select count(distinct value->>'id') from jsonb_array_elements(new_data->'records')) then raise exception 'Trùng bản ghi'; end if;
 for o in select * from jsonb_array_elements(new_data->'occasions') loop
  if o->>'date' is null or o->>'slot' is null then raise exception 'Thiếu thông tin đợt ăn'; end if;
  perform (o->>'date')::date;
  if jsonb_typeof(o->'dishes') is distinct from 'array' or jsonb_array_length(o->'dishes')=0 then raise exception 'Không lưu đợt ăn trống'; end if;
  select value into old_o from jsonb_array_elements(a.data->'occasions') where value->>'operationId'=o->>'operationId';
  if old_o is not null and (old_o-'dishes') is distinct from (o-'dishes') then raise exception 'Nhật ký không cho sửa đợt ăn'; end if;
  if (select count(*) from jsonb_array_elements(o->'dishes'))<>(select count(distinct value->>'recommendationId') from jsonb_array_elements(o->'dishes')) then raise exception 'Trùng món trong đợt ăn'; end if;
  for d in select * from jsonb_array_elements(o->'dishes') loop
   if old_o is not null then
    select value into old_d from jsonb_array_elements(old_o->'dishes') where value->>'id'=d->>'id';
    if old_d is distinct from d then raise exception 'Nhật ký chỉ cho xóa từng món đã ghi'; end if;
   end if;
   select * into rec from public.smartmeal_recommendations where id=(d->>'recommendationId')::uuid and user_id=auth.uid();
   if not found or not rec.image_ready or rec.recipe_id::text is distinct from d->>'recipeId' or rec.generated_at is distinct from (d->>'generatedAt')::timestamptz then raise exception 'Nguồn món ăn không hợp lệ'; end if;
   mins:=extract(hour from rec.generated_at at time zone 'Asia/Ho_Chi_Minh')::int*60+extract(minute from rec.generated_at at time zone 'Asia/Ho_Chi_Minh')::int;
   slot:=case when rec.meal_type='Ăn nhẹ' then 'Ăn nhẹ' when mins>=150 and mins<600 then 'Bữa sáng' when mins>=600 and mins<930 then 'Bữa trưa' else 'Bữa tối' end;
   if o->>'slot'<>slot then raise exception 'Không được gộp các bữa khác nhau'; end if;
  end loop;
  -- Conservative overlap guard until product resolves combo+component deduplication.
  if exists(
   select 1 from jsonb_array_elements(o->'dishes') x
   join public.smartmeal_recipes p on p.id=(x->>'recipeId')::uuid
   cross join lateral jsonb_array_elements_text(case when p.payload->>'kind'='combo' then p.payload->'components' else jsonb_build_array(p.id::text) end) component
   group by component having count(*)>1
  ) then raise exception 'Combo trùng món đã chọn; hãy lưu riêng'; end if;
 end loop;
 if (select count(*) from jsonb_array_elements(new_data->'occasions'))<>(select count(distinct value->>'operationId') from jsonb_array_elements(new_data->'occasions')) then raise exception 'Trùng thao tác lưu'; end if;
 for r in select * from jsonb_array_elements(new_data->'saved') loop
  if not exists(select 1 from public.smartmeal_recipes where id=(r#>>'{}')::uuid and user_id=auth.uid()) then raise exception 'Món lưu không hợp lệ'; end if;
 end loop;
 if new_data->>'persona' is null or new_data->>'persona' not in ('hin','lin','didi','anh','rice') then raise exception 'Nhân vật không hợp lệ'; end if;
 new_data:=new_data||jsonb_build_object('firstUse',a.data->'firstUse','streakDays',a.data->'streakDays');
 update public.smartmeal_accounts set data=new_data,revision=revision+1 where user_id=auth.uid() returning revision into next_revision;
 return jsonb_build_object('revision',next_revision);
end $$;
create function public.smartmeal_request_deletion() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Cần đăng nhập'; end if;
 insert into public.smartmeal_deletion_requests(user_id) values(auth.uid()) on conflict do nothing;
 return jsonb_build_object('status','pending');
end $$;
revoke all on function public.smartmeal_load(),public.smartmeal_save(jsonb,integer),public.smartmeal_request_deletion() from public;
grant execute on function public.smartmeal_load(),public.smartmeal_save(jsonb,integer),public.smartmeal_request_deletion() to authenticated;
insert into storage.buckets(id,name,public) values('meal-images','meal-images',false) on conflict do nothing;
create policy meal_image_read on storage.objects for select to authenticated using(bucket_id='meal-images' and (storage.foldername(name))[1]=auth.uid()::text);
