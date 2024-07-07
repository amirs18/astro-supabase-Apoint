import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/database.types.ts";
import z from "npm:zod";
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";

const availabilityPreferencesSchema = z.object({
  0: z
    .object({
      startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    })
    .array(),
  1: z
    .object({
      startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    })
    .array(),
  2: z
    .object({
      startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    })
    .array(),
  3: z
    .object({
      startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    })
    .array(),
  4: z
    .object({
      startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    })
    .array(),
  5: z
    .object({
      startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    })
    .array(),
  6: z
    .object({
      startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    })
    .array(),
});

type AvailabilityPreferences = z.infer<typeof availabilityPreferencesSchema>;

Deno.serve(async (req: Request) => {
  if (req.method === "POST") {
    const { providerId, providerAvailabilityPreferences } = await req.json();
    const authHeader = req.headers.get("Authorization")!;
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // "http://127.0.0.1:54321",
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
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
