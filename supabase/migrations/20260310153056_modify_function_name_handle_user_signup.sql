DROP TRIGGER IF EXISTS handle_first_user ON auth.users;

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
  else
    select count(*) into admin_count from public.app_user where role = 'admin';

    if admin_count > 0 then
      user_role = 'agent';
    else
      user_role = 'admin';
    end if;
  end if;

  if invite_token is not null then
    update public.invite_tokens
    set used_at = now()
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

CREATE TRIGGER handle_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_user_signup();

drop function if exists "public"."handle_first_admin"();