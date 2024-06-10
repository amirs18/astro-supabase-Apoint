revoke delete on table "public"."providers_services" from "anon";

revoke insert on table "public"."providers_services" from "anon";

revoke references on table "public"."providers_services" from "anon";

revoke select on table "public"."providers_services" from "anon";

revoke trigger on table "public"."providers_services" from "anon";

revoke truncate on table "public"."providers_services" from "anon";

revoke update on table "public"."providers_services" from "anon";

revoke delete on table "public"."providers_services" from "authenticated";

revoke insert on table "public"."providers_services" from "authenticated";

revoke references on table "public"."providers_services" from "authenticated";

revoke select on table "public"."providers_services" from "authenticated";

revoke trigger on table "public"."providers_services" from "authenticated";

revoke truncate on table "public"."providers_services" from "authenticated";

revoke update on table "public"."providers_services" from "authenticated";

revoke delete on table "public"."providers_services" from "service_role";

revoke insert on table "public"."providers_services" from "service_role";

revoke references on table "public"."providers_services" from "service_role";

revoke select on table "public"."providers_services" from "service_role";

revoke trigger on table "public"."providers_services" from "service_role";

revoke truncate on table "public"."providers_services" from "service_role";

revoke update on table "public"."providers_services" from "service_role";

alter table "public"."providers_services" drop constraint "barber_services_unique";

alter table "public"."providers_services" drop constraint "providers_services_provider_id_fkey";

alter table "public"."providers_services" drop constraint "providers_services_service_id_fkey";

alter table "public"."appointments" drop constraint "appointments_status_check";

alter table "public"."availability" drop constraint "availability_day_of_week_check";

alter table "public"."providers_services" drop constraint "providers_services_pkey";

drop index if exists "public"."barber_services_unique";

drop index if exists "public"."providers_services_pkey";

drop index if exists "public"."providers_services_provider_id_idx";

drop table "public"."providers_services";

alter table "public"."services" add column "provider_id" integer;

drop sequence if exists "public"."providers_services_id_seq";

alter table "public"."services" add constraint "public_services_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES providers(id) not valid;

alter table "public"."services" validate constraint "public_services_provider_id_fkey";

alter table "public"."appointments" add constraint "appointments_status_check" CHECK (((status)::text = ANY ((ARRAY['Booked'::character varying, 'Confirmed'::character varying, 'Cancelled'::character varying])::text[]))) not valid;

alter table "public"."appointments" validate constraint "appointments_status_check";

alter table "public"."availability" add constraint "availability_day_of_week_check" CHECK (((day_of_week)::text = ANY ((ARRAY['Monday'::character varying, 'Tuesday'::character varying, 'Wednesday'::character varying, 'Thursday'::character varying, 'Friday'::character varying, 'Saturday'::character varying, 'Sunday'::character varying])::text[]))) not valid;

alter table "public"."availability" validate constraint "availability_day_of_week_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_provider()
 RETURNS integer
 LANGUAGE sql
AS $function$
  select count(*) from providers where owner_user_id = auth.uid()
$function$
;

create policy "Enable read access for all users"
on "public"."services"
as permissive
for select
to public
using (true);



