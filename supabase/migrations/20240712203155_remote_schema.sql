create extension if not exists "postgis" with schema "extensions";


alter table "public"."providers" drop column "location_geoJSON";

alter table "public"."providers" add column "location" geography(Point,4326);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_provider_with_longlat(input_id integer)
 RETURNS SETOF provider_with_longlat
 LANGUAGE sql
AS $function$
select *, ST_X(public.providers.location::geometry) as long, ST_Y(public.providers.location::geometry)as lat from public.providers where (public.providers.id = input_id) limit 1;
$function$
;

create type "public"."provider_with_longlat" as ("id" integer, "email" character varying(255), "name" character varying(255), "bio" text, "photo_link" character varying(255), "phone_number" character varying, "location_name" character varying, "availability_preferences" jsonb, "location" geography, "long" double precision, "lat" double precision);


