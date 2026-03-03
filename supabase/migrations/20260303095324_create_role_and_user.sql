create type "public"."app_role" as enum ('admin', 'agent', 'customer_manager', 'customer');


  create table "public"."app_user" (
    "id" uuid not null default auth.uid(),
    "name" text not null,
    "role" public.app_role not null default 'customer'::public.app_role
      );


alter table "public"."app_user" enable row level security;

CREATE UNIQUE INDEX app_user_name_key ON public.app_user USING btree (name);

CREATE UNIQUE INDEX app_user_pkey ON public.app_user USING btree (id);

alter table "public"."app_user" add constraint "app_user_pkey" PRIMARY KEY using index "app_user_pkey";

alter table "public"."app_user" add constraint "app_user_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."app_user" validate constraint "app_user_id_fkey";

alter table "public"."app_user" add constraint "app_user_name_key" UNIQUE using index "app_user_name_key";

grant delete on table "public"."app_user" to "anon";

grant insert on table "public"."app_user" to "anon";

grant references on table "public"."app_user" to "anon";

grant select on table "public"."app_user" to "anon";

grant trigger on table "public"."app_user" to "anon";

grant truncate on table "public"."app_user" to "anon";

grant update on table "public"."app_user" to "anon";

grant delete on table "public"."app_user" to "authenticated";

grant insert on table "public"."app_user" to "authenticated";

grant references on table "public"."app_user" to "authenticated";

grant select on table "public"."app_user" to "authenticated";

grant trigger on table "public"."app_user" to "authenticated";

grant truncate on table "public"."app_user" to "authenticated";

grant update on table "public"."app_user" to "authenticated";

grant delete on table "public"."app_user" to "service_role";

grant insert on table "public"."app_user" to "service_role";

grant references on table "public"."app_user" to "service_role";

grant select on table "public"."app_user" to "service_role";

grant trigger on table "public"."app_user" to "service_role";

grant truncate on table "public"."app_user" to "service_role";

grant update on table "public"."app_user" to "service_role";


