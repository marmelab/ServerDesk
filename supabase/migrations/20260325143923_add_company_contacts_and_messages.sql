alter table "public"."messages" add column "text" text not null;

alter table "public"."tickets" alter column "description" set not null;

alter table "public"."messages" add constraint "messages_sender_id_fkey1" FOREIGN KEY (sender_id) REFERENCES public.app_user(id) ON DELETE SET NULL not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey1";


  create policy "authenticated users can see agent users"
  on "public"."app_user"
  as permissive
  for select
  to authenticated
using ((role = 'agent'::public.app_role));



