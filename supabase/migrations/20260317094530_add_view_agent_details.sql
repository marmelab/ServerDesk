create or replace view "public"."agent_details" as
select
  au.id,
  u.email,
  au.name,
  COALESCE(
    json_agg(c.name) filter (where c.name is not null),
    '[]'::json
  ) as company_names
from public.app_user au
join auth.users u 
  on au.id = u.id
left join public.user_companies uc
  on au.id = uc.user_id
left join public.companies c 
  on uc.company_id = c.id
where au.role = 'agent'::public.app_role
group by 
  au.id, 
  u.email, 
  au.name;