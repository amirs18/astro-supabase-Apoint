alter table "public"."availability" drop constraint "availability_day_of_week_check";

alter table "public"."availability" drop column "day_of_week";

alter table "public"."availability" add column "date" date not null;

alter table "public"."providers" add column "availability_preferences" jsonb;

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


