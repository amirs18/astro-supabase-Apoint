drop policy "create services only owner" on "public"."services";

drop policy "delete services only owner" on "public"."services";

drop policy "update services only owner" on "public"."services";

alter table "public"."providers" drop constraint "barbers_user_id_fkey";

alter table "public"."providers" drop column "owner_user_id";

create policy "create services only owner"
on "public"."services"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM (users_provider
     JOIN providers ON ((users_provider.provider_id = providers.id)))
  WHERE (providers.id = services.provider_id))));


create policy "delete services only owner"
on "public"."services"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM (users_provider
     JOIN providers ON ((users_provider.provider_id = providers.id)))
  WHERE (providers.id = services.provider_id))));


create policy "update services only owner"
on "public"."services"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM (users_provider
     JOIN providers ON ((users_provider.provider_id = providers.id)))
  WHERE (providers.id = services.provider_id))));



