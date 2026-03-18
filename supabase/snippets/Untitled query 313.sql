alter view public.agent_details rename column company_names to companies;

create or replace view public.agent_details as
select
  au.id,
  u.email,
  au.name,
  COALESCE(
    json_agg(
      json_build_object('id', c.id, 'name', c.name) 
    ) filter (
      where
        c.id is not null
    ),
    '[]'::json
  ) as companies
from
  app_user au
  join auth.users u on au.id = u.id
  left join user_companies uc on au.id = uc.user_id
  left join companies c on uc.company_id = c.id
where
  au.role = 'agent'::app_role
group by
  au.id,
  u.email,
  au.name;