-- Empty by design. Import only licensed, reviewed recipes with provenance.
create table public.smartmeal_catalog(id uuid primary key default gen_random_uuid(),payload jsonb not null,provenance jsonb not null,approved boolean not null default false);
alter table public.smartmeal_catalog enable row level security;
revoke all on public.smartmeal_catalog from anon,authenticated;
create table public.smartmeal_usage(user_id uuid references auth.users(id) on delete cascade,day date,kind text,used integer not null default 0,primary key(user_id,day,kind));
alter table public.smartmeal_usage enable row level security;
revoke all on public.smartmeal_usage from anon,authenticated;
create function public.smartmeal_consume(p_user uuid,p_kind text,p_limit integer) returns boolean language plpgsql security definer set search_path='' as $$
declare n integer;
begin
 if p_limit<=0 then return false; end if;
 insert into public.smartmeal_usage(user_id,day,kind,used) values(p_user,(now() at time zone 'Asia/Ho_Chi_Minh')::date,p_kind,1)
 on conflict(user_id,day,kind) do update set used=public.smartmeal_usage.used+1 where public.smartmeal_usage.used<p_limit returning used into n;
 return n is not null;
end $$;
revoke all on function public.smartmeal_consume(uuid,text,integer) from public;
grant execute on function public.smartmeal_consume(uuid,text,integer) to service_role;
