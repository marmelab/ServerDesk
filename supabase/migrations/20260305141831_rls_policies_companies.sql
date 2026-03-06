alter table "public"."companies" enable row level security;


  create policy "Enable users to view their own data only"
  on "public"."companies"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.app_user
  WHERE ((auth.uid() = app_user.id) AND (app_user.role = 'admin'::public.app_role)))));



  create policy "Only admin can add companies"
  on "public"."companies"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.app_user
  WHERE ((auth.uid() = app_user.id) AND (app_user.role = 'admin'::public.app_role)))));



  create policy "Only admin can modify companies"
  on "public"."companies"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.app_user
  WHERE ((app_user.id = auth.uid()) AND (app_user.role = 'admin'::public.app_role)))));



