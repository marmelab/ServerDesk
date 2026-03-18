alter table "public"."agent_details" rename column 'company_names' to 'companies';

create or replace view "public"."agent_details" as  SELECT COALESCE(au.id, '00000000-0000-0000-0000-000000000000'::uuid) AS id,
    u.email,
    au.name,
    COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE (c.id IS NOT NULL)), '[]'::json) AS companies
   FROM (((public.app_user au
     JOIN auth.users u ON ((au.id = u.id)))
     LEFT JOIN public.user_companies uc ON ((au.id = uc.user_id)))
     LEFT JOIN public.companies c ON ((uc.company_id = c.id)))
  WHERE (au.role = 'agent'::public.app_role)
  GROUP BY au.id, u.email, au.name;



