alter table "public"."services" drop constraint "services_service_name_key";

drop index if exists "public"."services_service_name_key";

CREATE UNIQUE INDEX services_unique ON public.services USING btree (service_name, provider_id);

alter table "public"."services" add constraint "services_unique" UNIQUE using index "services_unique";

create policy "add ser"
on "public"."services"
as permissive
for insert
to authenticated
with check (true);



