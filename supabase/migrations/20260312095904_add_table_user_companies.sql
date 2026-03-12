
  create table "public"."user_companies" (
    "user_id" uuid not null default gen_random_uuid(),
    "company_id" bigint not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."user_companies" enable row level security;

CREATE UNIQUE INDEX user_companies_pkey ON public.user_companies USING btree (user_id, company_id);

alter table "public"."user_companies" add constraint "user_companies_pkey" PRIMARY KEY using index "user_companies_pkey";

alter table "public"."user_companies" add constraint "user_companies_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."user_companies" validate constraint "user_companies_company_id_fkey";

alter table "public"."user_companies" add constraint "user_companies_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_companies" validate constraint "user_companies_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_user_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  admin_count int;
  user_name text;
  meta_company_id int8;
  invite_token uuid;
  user_role public.app_role;
begin
  user_name := COALESCE(
      new.raw_user_meta_data ->> 'name', 
      'User-' || RIGHT(new.id::text, 4)
    );

  meta_company_id := (new.raw_user_meta_data ->> 'company_id')::int8;

  invite_token := (new.raw_user_meta_data ->> 'invite_token')::uuid;

  if meta_company_id is not null then
    user_role := 'customer_manager';
    insert into public.user_companies (user_id, company_id)
    values (
      new.id, 
      meta_company_id
    );
  else
    select count(*) into admin_count from public.app_user where role = 'admin';

    if admin_count > 0 then
      user_role = 'agent';
    else
      user_role = 'admin';
    end if;
  end if;

  if invite_token is not null then
    delete from public.invite_tokens
    where token = invite_token;
  end if;

  insert into public.app_user (id, name, role)
  values (
    new.id, 
    user_name, 
    user_role);
  return new;
end;$function$
;

grant delete on table "public"."user_companies" to "anon";

grant insert on table "public"."user_companies" to "anon";

grant references on table "public"."user_companies" to "anon";

grant select on table "public"."user_companies" to "anon";

grant trigger on table "public"."user_companies" to "anon";

grant truncate on table "public"."user_companies" to "anon";

grant update on table "public"."user_companies" to "anon";

grant delete on table "public"."user_companies" to "authenticated";

grant insert on table "public"."user_companies" to "authenticated";

grant references on table "public"."user_companies" to "authenticated";

grant select on table "public"."user_companies" to "authenticated";

grant trigger on table "public"."user_companies" to "authenticated";

grant truncate on table "public"."user_companies" to "authenticated";

grant update on table "public"."user_companies" to "authenticated";

grant delete on table "public"."user_companies" to "service_role";

grant insert on table "public"."user_companies" to "service_role";

grant references on table "public"."user_companies" to "service_role";

grant select on table "public"."user_companies" to "service_role";

grant trigger on table "public"."user_companies" to "service_role";

grant truncate on table "public"."user_companies" to "service_role";

grant update on table "public"."user_companies" to "service_role";


  create policy "Enable users to view their own data only"
  on "public"."tickets"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = customer_id));



  create policy "admin can interact"
  on "public"."user_companies"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.app_user
  WHERE ((auth.uid() = app_user.id) AND (app_user.role = 'admin'::public.app_role)))));



