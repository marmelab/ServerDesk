create or replace view "public"."agent_details" as  SELECT au.id,
    u.email,
    au.name,
    COALESCE(json_agg(c.name) FILTER (WHERE (c.name IS NOT NULL)), '[]'::json) AS company_names
   FROM (((public.app_user au
     JOIN auth.users u ON ((au.id = u.id)))
     LEFT JOIN public.user_companies uc ON ((au.id = uc.user_id)))
     LEFT JOIN public.companies c ON ((uc.company_id = c.id)))
  WHERE (au.role = 'agent'::public.app_role)
  GROUP BY au.id, u.email, au.name;



