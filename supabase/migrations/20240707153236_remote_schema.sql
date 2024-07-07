create policy "admin polcy for all"
on "public"."availability"
as permissive
for all
to supabase_admin
using (true);


create policy "availability update policy"
on "public"."availability"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM (users_provider
     JOIN providers ON ((users_provider.provider_id = providers.id)))
  WHERE (providers.id = availability.provider_id))));


create policy "delete for authenticated users"
on "public"."availability"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT users_provider.user_id
   FROM (users_provider
     JOIN providers ON ((users_provider.provider_id = providers.id)))
  WHERE (providers.id = availability.provider_id))));


create policy "insert new avilibilty policy"
on "public"."availability"
as permissive
for insert
to authenticated
with check (true);


create policy "select avilibilty policy "
on "public"."availability"
as permissive
for select
to public
using (true);



