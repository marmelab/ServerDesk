set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_first_admin()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  admin_count int;
  user_name text;
  user_role public.app_role;
begin
  user_name := COALESCE(
      new.raw_user_meta_data ->> 'name', 
      'User-' || RIGHT(new.id::text, 4)
    );

  select count(*) into admin_count from public.app_user where role = 'admin';

  if admin_count > 0 then
    user_role = 'agent';
  else
    user_role = 'admin';
  end if;

  insert into public.app_user (id, name, role)
  values (
    new.id, 
    user_name, 
    user_role);
  return new;
end;$function$
;


  create policy "Enable users to view their own data only"
  on "public"."app_user"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



  create policy "User can modify their own profile"
  on "public"."app_user"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



