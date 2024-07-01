drop policy "create services only owner" on "public"."services";

drop policy "delete services only owner" on "public"."services";

drop policy "update services only owner" on "public"."services";

alter table "public"."services" add column "duration" integer not null;

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

create policy "update provider only for owners"
on "public"."providers"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM users_provider
  WHERE (users_provider.provider_id = providers.id))));


create policy "create services only owner"
on "public"."services"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM (users_provider
     JOIN providers ON ((users_provider.provider_id = providers.id)))
  WHERE (providers.id = services.provider_id))));


create policy "delete services only owner"
on "public"."services"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM (users_provider
     JOIN providers ON ((users_provider.provider_id = providers.id)))
  WHERE (providers.id = services.provider_id))));


create policy "update services only owner"
on "public"."services"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM (users_provider
     JOIN providers ON ((users_provider.provider_id = providers.id)))
  WHERE (providers.id = services.provider_id))));



