drop policy "delete for authenticated users" on "public"."availability";

create policy "delete for authenticated users"
on "public"."availability"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM (users_provider
     JOIN providers ON ((users_provider.provider_id = providers.id)))
  WHERE (providers.id = availability.provider_id))));



