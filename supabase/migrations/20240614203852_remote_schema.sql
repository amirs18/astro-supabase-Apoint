drop policy "add ser" on "public"."services";

create policy "Policy with table joins"
on "public"."services"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT providers.owner_user_id
   FROM providers
  WHERE (providers.id = services.provider_id))));



