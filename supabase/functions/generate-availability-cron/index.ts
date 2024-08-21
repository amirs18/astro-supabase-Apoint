import { createClient } from "jsr:@supabase/supabase-js@2";
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { differenceInCalendarDays } from "https://esm.sh/date-fns/differenceInCalendarDays.mjs";

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

  const providers = await supabaseClient.rpc('get_provider_with_max_availability_date')

  const inserts =
    providers.data?.map((provider) =>
      generateAvailability(
        provider.id!,
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
        provider.max_date
      ),
    ) || [];
    console.log(inserts.length);
    
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
  max_date:string|null
) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 180);
  const availability: Database["public"]["Tables"]["availability"]["Insert"][] =
    [];
  let day: 0 | 1 | 2 | 3 | 4 | 5 | 6;

const maxDate = new Date(`${max_date}`);
maxDate.setDate(maxDate.getDate()+1)
const diffInDays = differenceInCalendarDays(endDate,maxDate)

console.log(diffInDays,maxDate,endDate);
  for (let i = 0; i < diffInDays; i++) {
    day = maxDate.getDay() as unknown as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    availability_preferences[day].forEach((time) => {
      console.log('push');
      availability.push({
        date: maxDate.toISOString().split("T")[0] || "",
        end_time: time.endTime,
        provider_id: providerId,
        start_time: time.startTime,
      });
    });
    maxDate.setDate(maxDate.getDate() + 1);

  }
  return availability;
}