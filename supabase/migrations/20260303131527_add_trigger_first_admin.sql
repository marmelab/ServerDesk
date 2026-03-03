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

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


