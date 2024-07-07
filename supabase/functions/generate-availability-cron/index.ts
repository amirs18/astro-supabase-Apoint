import { createClient } from "jsr:@supabase/supabase-js@2";
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
// @deno-types="npm:@types/bluebird"
import BB from "npm:bluebird";
import { Database } from "../_shared/database.types.ts";
import {
  type AvailabilityPreferences,
  availabilityPreferencesSchema,
} from "../_shared/zodSchemas.ts";

Deno.serve(async (req: Request) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const providers = await supabaseClient.from("providers").select("*");

  const inserts =
    providers.data?.map((provider) =>
      generateAvailability(
        provider.id,
        availabilityPreferencesSchema.safeParse(
          provider.availability_preferences,
        ).data || {
          "0": [],
          "1": [],
          "2": [],
          "3": [],
          "4": [],
          "5": [],
          "6": [],
        },
      ),
    ) || [];

  const result = await BB.map(
    inserts,
    (insert) => {
      return supabaseClient.from("availability").insert(insert);
    },
    { concurrency: 10 },
  );

  return new Response(JSON.stringify(result), {
    status: 200,
  });
});

function generateAvailability(
  providerId: number,
  availability_preferences: AvailabilityPreferences,
) {
  const now = new Date();
  const availability: Database["public"]["Tables"]["availability"]["Insert"][] =
    [];
  now.setDate(now.getDate() + 180);

  const day = now.getDay() as unknown as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  availability_preferences[day].forEach((time) => {
    availability.push({
      date: now.toISOString().split("T")[0] || "",
      end_time: time.endTime,
      provider_id: providerId,
      start_time: time.startTime,
    });
  });

  return availability;
}
