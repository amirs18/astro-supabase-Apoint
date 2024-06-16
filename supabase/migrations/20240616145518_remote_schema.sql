drop policy "Policy with table joins" on "public"."services";

create policy "create services only owner"
on "public"."services"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) IN ( SELECT providers.owner_user_id
   FROM providers
  WHERE (providers.id = services.provider_id))));


create policy "delete services only owner"
on "public"."services"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT providers.owner_user_id
   FROM providers
  WHERE (providers.id = services.provider_id))));


create policy "update services only owner"
on "public"."services"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT providers.owner_user_id
   FROM providers
  WHERE (providers.id = services.provider_id))));



