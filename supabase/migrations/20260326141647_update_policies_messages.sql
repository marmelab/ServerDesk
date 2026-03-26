drop policy "customer_manager can see and insert messages" on "public"."messages";

drop policy "enable customer_manager to edit tickets of own company" on "public"."tickets";

alter table "public"."tickets" alter column "priority" drop default;

alter table "public"."tickets" alter column "status" drop default;

alter table "public"."tickets" alter column priority type "public"."ticket_priority" using priority::text::"public"."ticket_priority";

alter table "public"."tickets" alter column status type "public"."ticket_status" using status::text::"public"."ticket_status";

alter table "public"."tickets" alter column "priority" set default 'medium'::public.ticket_priority;

alter table "public"."tickets" alter column "status" set default 'open'::public.ticket_status;

alter table "public"."messages" alter column "ticket_id" set not null;

alter table "public"."tickets" alter column "priority" set not null;

alter table "public"."tickets" alter column "status" set not null;


  create policy "authenticated users can see customer manager"
  on "public"."app_user"
  as permissive
  for select
  to authenticated
using ((role = 'customer_manager'::public.app_role));



  create policy "users can see and insert messages of assigned companies"
  on "public"."messages"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.tickets t
     JOIN public.user_companies uc ON ((t.company_id = uc.company_id)))
  WHERE ((t.id = messages.ticket_id) AND (uc.user_id = auth.uid())))))
with check (((EXISTS ( SELECT 1
   FROM (public.tickets t
     JOIN public.user_companies uc ON ((t.company_id = uc.company_id)))
  WHERE ((t.id = messages.ticket_id) AND (uc.user_id = auth.uid())))) AND (sender_id = auth.uid())));



  create policy "enable customer_manager and agents to edit tickets of own compa"
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



