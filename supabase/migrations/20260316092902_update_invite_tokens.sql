alter table "public"."invite_tokens" drop constraint "invite_tokens_company_id_fkey";

alter table "public"."invite_tokens" drop column "company_id";

alter table "public"."invite_tokens" drop column "role";

alter table "public"."invite_tokens" add column "metadata" jsonb not null default '{}'::jsonb;

alter table "public"."invite_tokens" alter column "expired_at" set not null;

alter table "public"."invite_tokens" alter column "token" set not null;

alter table "public"."invite_tokens" add constraint "invite_tokens_metadata_check" CHECK (((metadata ? 'company_id'::text) AND (metadata ? 'app_role'::text) AND (jsonb_typeof((metadata -> 'company_id'::text)) = 'array'::text))) not valid;

alter table "public"."invite_tokens" validate constraint "invite_tokens_metadata_check";

CREATE INDEX tickets_updated_at_idx ON public.tickets USING btree (updated_at);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_user_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  admin_count int;
  user_name text;
  invite_token uuid;
  user_role public.app_role;
  invite_data jsonb;
begin
  user_name := COALESCE(
      new.raw_user_meta_data ->> 'name', 
      'User-' || RIGHT(new.id::text, 4)
    );

  invite_token := (new.raw_user_meta_data ->> 'invite_token')::uuid;
  if invite_token is not null then
    select metadata into invite_data from public.invite_tokens where token = invite_token;
  end if;

  if invite_data is not null then
    user_role := invite_data ->> 'app_role';
    insert into public.user_companies (user_id, company_id)
    select 
      new.id, 
      (value::text)::bigint
    from jsonb_array_elements(invite_data -> 'company_id');
  else
    select count(*) into admin_count from public.app_user where role = 'admin';

    if admin_count > 0 then
      user_role := 'agent';
    else
      user_role := 'admin';
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


