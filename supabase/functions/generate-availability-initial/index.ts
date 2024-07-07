import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/database.types.ts";
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import {
  type AvailabilityPreferences,
  availabilityPreferencesSchema,
} from "../_shared/zodSchemas.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "POST") {
    const { providerId, providerAvailabilityPreferences } = await req.json();
    const authHeader = req.headers.get("Authorization")!;
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );
    const t = generateAvailability(
      providerId,
      availabilityPreferencesSchema.parse(providerAvailabilityPreferences),
    );

    const insertAvailability = await supabaseClient
      .from("availability")
      .insert(t);
    if (insertAvailability.error) {
      throw insertAvailability.error;
    }
    return new Response(JSON.stringify(insertAvailability.data), {
      status: 200,
    });
  }

  return new Response("err", { status: 405 });
});

function generateAvailability(
  providerId: number,
  availability_preferences: AvailabilityPreferences,
) {
  const now = new Date();
  const availability: Database["public"]["Tables"]["availability"]["Insert"][] =
    [];
  let day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  for (let i = 0; i < 180; i++) {
    day = now.getDay() as unknown as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    availability_preferences[day].forEach((time) => {
      availability.push({
        date: now.toISOString().split("T")[0] || "",
        end_time: time.endTime,
        provider_id: providerId,
        start_time: time.startTime,
      });
    });
    now.setDate(now.getDate() + 1);
  }
  return availability;
}
