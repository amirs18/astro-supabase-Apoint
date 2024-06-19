set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin(p_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
begin
  return (select exists (select 1 from "public".users_provider where  "public".users_provider.provider_id=p_id  and  "public".users_provider.user_id = auth.uid()));
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_user_provider()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  insert into users_provider(user_id, provider_id)
  values ((select auth.uid()),new.id);
  return new;
end;$function$
;


