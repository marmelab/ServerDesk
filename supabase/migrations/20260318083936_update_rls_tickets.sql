drop policy "enable customer_manager to edit tickets of own company" on "public"."tickets";


  create policy "enable customer_manager to edit tickets of own company"
  on "public"."tickets"
  as permissive
  for all
  to public
using (((EXISTS ( SELECT 1
   FROM public.app_user
  WHERE ((app_user.id = auth.uid()) AND (app_user.role = ANY (ARRAY['customer_manager'::public.app_role, 'agent'::public.app_role]))))) AND (company_id IN ( SELECT uc.company_id
   FROM public.user_companies uc
  WHERE (uc.user_id = auth.uid())))))
with check (((EXISTS ( SELECT 1
   FROM public.app_user
  WHERE ((app_user.id = auth.uid()) AND (app_user.role = ANY (ARRAY['customer_manager'::public.app_role, 'agent'::public.app_role]))))) AND (company_id IN ( SELECT uc.company_id
   FROM public.user_companies uc
  WHERE (uc.user_id = auth.uid())))));



