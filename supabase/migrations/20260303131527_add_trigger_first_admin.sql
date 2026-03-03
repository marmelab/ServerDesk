set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_first_admin()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  admin_count int;
  user_name text;
begin
  user_name := new.raw_user_meta_data ->> 'name';

  select count(*) into admin_count from public.app_user where role = 'admin';

  insert into public.app_user (id, name, role)
  values (
    new.id, 
    user_name, 
    (case when admin_count = 0 then 'admin' else 'agent' end)::public.app_role);
  return new;
end;$function$
;

CREATE TRIGGER handle_first_admin AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_first_admin();


