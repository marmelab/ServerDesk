alter table "public"."company_contacts" alter column "email" set not null;

CREATE UNIQUE INDEX company_contacts_email_key ON public.company_contacts USING btree (email);

alter table "public"."company_contacts" add constraint "company_contacts_email_key" UNIQUE using index "company_contacts_email_key";


  create policy "admin can see all customers"
  on "public"."company_contacts"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.app_user
  WHERE ((auth.uid() = app_user.id) AND (app_user.role = 'admin'::public.app_role)))));



