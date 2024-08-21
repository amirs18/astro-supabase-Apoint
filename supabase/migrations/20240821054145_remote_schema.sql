set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_provider_with_max_availability_date()
 RETURNS SETOF provider_with_max_availability_date
 LANGUAGE sql
AS $function$
select public.providers.*,max(public.availability.date) as max_date
from public.providers
inner join public.availability on public.providers.id = public.availability.provider_id
group by public.providers.id ,public.providers.availability_preferences
$function$
;

create type "public"."provider_with_max_availability_date" as ("id" integer, "email" character varying(255), "name" character varying(255), "bio" text, "photo_link" character varying(255), "phone_number" character varying, "location_name" character varying, "availability_preferences" jsonb, "location" geography, "max_date" date);


