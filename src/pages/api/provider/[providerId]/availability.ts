import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";
import {
  availabilityPreferencesSchema,
  type AvailabilityPreferences,
} from "../../../../lib/zod.schemas";
import type { Database } from "../../../../lib/database.types";
import { split } from "lodash";

// gets all the providers in the system
export const GET: APIRoute = async ({ params }) => {
  // const provider_id = Number(params.providerId);
  // const { data, error } = await supabase
  //   .from("availability")
  //   .select("*")
  //   .eq("provider_id", provider_id);

  // if (error) {
  //   return new Response(
  //     JSON.stringify({
  //       error: error.message,
  //     }),
  //     { status: 500 },
  //   );
  // }

  // return new Response(JSON.stringify(data));
  const provider_id = Number(params.providerId);
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", provider_id)
    .limit(1)
    .single();

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 },
    );
  }
  generateAvailability(
    provider_id,
    availabilityPreferencesSchema.parse(data.availability_preferences),
  );

  return new Response(JSON.stringify(data));
};

export const POST: APIRoute = async ({ params }) => {
  const provider_id = Number(params.providerId);
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", provider_id)
    .limit(1)
    .single();

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify(data));
};

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
    availability.push({
      date: now.toISOString().split("T")[0] || "",
      end_time: availability_preferences[day].endTime,
      provider_id: providerId,
      start_time: availability_preferences[day].startTime,
    });
    now.setDate(now.getDate() + 1);
  }
  return availability;
}
