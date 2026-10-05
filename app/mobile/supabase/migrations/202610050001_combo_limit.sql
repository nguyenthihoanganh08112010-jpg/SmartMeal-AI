-- Defense in depth: trusted catalog and materialized recipes share the same cap.
-- Existing invalid data is surfaced during migration; it is never silently deleted.
alter table public.smartmeal_recipes add constraint recipe_combo_limit check (
 payload->>'kind' is distinct from 'combo' or
 coalesce((jsonb_typeof(payload->'components')='array' and jsonb_array_length(payload->'components') between 1 and 6),false)
);
alter table public.smartmeal_catalog add constraint catalog_combo_limit check (
 payload->>'kind' is distinct from 'combo' or
 coalesce((jsonb_typeof(payload->'components')='array' and jsonb_array_length(payload->'components') between 1 and 6),false)
);

create function public.smartmeal_validate_numeric_data() returns trigger language plpgsql set search_path='' as $$
declare r jsonb; field text; value jsonb;
begin
 for r in select * from jsonb_array_elements(new.data->'records') loop
  if jsonb_typeof(r->'duration') is distinct from 'number' or (r->>'duration')::numeric<=0 then
   raise exception 'Thời lượng phải là số lớn hơn 0 phút';
  end if;
 end loop;
 foreach field in array array['height','weight','age','cookingTime'] loop
  value:=new.data->'profile'->field;
  if value is not null and value<>'null'::jsonb and (jsonb_typeof(value)<>'number' or (value#>>'{}')::numeric<=0) then
   raise exception 'Thông tin hồ sơ dạng số không hợp lệ';
  end if;
 end loop;
 return new;
end $$;
create trigger smartmeal_numeric_guard before insert or update on public.smartmeal_accounts for each row execute function public.smartmeal_validate_numeric_data();
