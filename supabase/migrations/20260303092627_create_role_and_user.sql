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

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


