alter table "public"."tickets" drop constraint "tickets_company_id_fkey";

alter table "public"."tickets" drop constraint "tickets_customer_id_fkey";

alter table "public"."tickets" alter column "priority" drop default;

alter table "public"."tickets" alter column "status" drop default;

alter type "public"."ticket_priority" rename to "ticket_priority__old_version_to_be_dropped";

create type "public"."ticket_priority" as enum ('low', 'medium', 'high', 'critical');

alter type "public"."ticket_status" rename to "ticket_status__old_version_to_be_dropped";

create type "public"."ticket_status" as enum ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed');

alter table "public"."tickets" alter column priority type "public"."ticket_priority" using priority::text::"public"."ticket_priority";

alter table "public"."tickets" alter column status type "public"."ticket_status" using status::text::"public"."ticket_status";

drop type "public"."ticket_priority__old_version_to_be_dropped";

drop type "public"."ticket_status__old_version_to_be_dropped";

alter table "public"."tickets" alter column "customer_id" drop not null;

alter table "public"."tickets" alter column "priority" set default 'medium'::public.ticket_priority;

alter table "public"."tickets" alter column "status" set default 'open'::public.ticket_status;

alter table "public"."tickets" add constraint "tickets_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."tickets" validate constraint "tickets_company_id_fkey";

alter table "public"."tickets" add constraint "tickets_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."tickets" validate constraint "tickets_customer_id_fkey";


  create policy "Enable users to view their own data only"
  on "public"."user_companies"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



