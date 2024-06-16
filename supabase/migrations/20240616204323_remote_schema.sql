set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_user_provider()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  insert into users_provider(user_id, provider_id)
  values ((select auth.uid()),new.id);
  return new;
end;$function$
;

create policy "Enable delete for users based on user_id"
on "public"."users_provider"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER add_user_provider_for_each_provider_created AFTER INSERT ON public.providers FOR EACH ROW EXECUTE FUNCTION add_user_provider();


