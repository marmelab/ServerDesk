
  create policy "enable customer_manager to edit tickets of own company"
  on "public"."tickets"
  as permissive
  for all
  to public
using (((( SELECT app_user.role
   FROM public.app_user
  WHERE (app_user.id = auth.uid())) = 'customer_manager'::public.app_role) AND (company_id IN ( SELECT user_companies.company_id
   FROM public.user_companies
  WHERE (user_companies.user_id = auth.uid())))))
with check (((( SELECT app_user.role
   FROM public.app_user
  WHERE (app_user.id = auth.uid())) = 'customer_manager'::public.app_role) AND (company_id IN ( SELECT user_companies.company_id
   FROM public.user_companies
  WHERE (user_companies.user_id = auth.uid())))));



