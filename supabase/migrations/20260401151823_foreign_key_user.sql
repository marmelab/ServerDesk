alter table "public"."user_companies" add constraint "user_companies_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES public.app_user(id) not valid;

alter table "public"."user_companies" validate constraint "user_companies_user_id_fkey1";

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
  
  if invite_data is not null then
    insert into public.user_companies (user_id, company_id)
    select 
      new.id, 
      (value::text)::bigint
    from jsonb_array_elements(invite_data -> 'company_id');
    end if;
  return new;
end;$function$
;


