import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import z from "zod";
import { providerWithAvailabilityPreferencesSchema } from "../../../lib/zod.schemas";
import pkg from "lodash";
const { pickBy, identity } = pkg;
// gets all the providers in the system
export const GET: APIRoute = async () => {
  const { data, error } = await supabase.from("providers").select("*");

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

export const POST: APIRoute = async ({ request }) => {
  const parsedBody = providerWithAvailabilityPreferencesSchema.safeParse(
    await request.json(),
  );
  if (parsedBody.error) {
    return new Response(
      JSON.stringify({
        error: parsedBody.error.message,
      }),
      { status: 403 },
    );
  } else {
    const {
      email,
      name,
      phone_number,
      bio,
      location_name,
      photo_link,
      availability_preferences,
    } = parsedBody.data;
    const { data, error } = await supabase
      .from("providers")
      .insert({
        email,
        name,
        bio,
        location_name,
        phone_number,
        photo_link,
        availability_preferences: availability_preferences || {
          "0": [],
          "1": [],
          "2": [],
          "3": [],
          "4": [],
          "5": [],
          "6": [],
        },
      })
      .select()
      .single();

    if (error) {
      console.error("🚀 ~ /api/provider POST:APIRoute= ~ error:", error);
      return new Response(
        JSON.stringify({
          error: error,
        }),
        { status: 500 },
      );
    }
    supabase.functions.invoke("generate-availability-initial", {
      body: {
        providerId: data.id,
        providerAvailabilityPreferences: data.availability_preferences,
      },
    });
    return new Response(JSON.stringify(data), { status: 200 });
  }
};
// updates a provider
export const PATCH: APIRoute = async ({ request }) => {
  const parsedBody = providerWithAvailabilityPreferencesSchema
    .partial()
    .extend({ id: z.number() })
    .safeParse(await request.json());
  if (parsedBody.error) {
    return new Response(
      JSON.stringify({
        error: parsedBody.error.message,
      }),
      { status: 403 },
    );
  } else {
    const cleanedObject = pickBy(parsedBody.data, identity);
    const { data, error } = await supabase
      .from("providers")
      .update({
        ...cleanedObject,
      })
      .eq("id", parsedBody.data.id)
      .select()
      .single();

    if (error) {
      console.error("🚀 ~ /api/provider PATCH:APIRoute= ~ error:", error);
      return new Response(
        JSON.stringify({
          error: error,
        }),
        { status: 500 },
      );
    }
    if (parsedBody.data.availability_preferences) {
      supabase.functions.invoke("generate-availability-initial", {
        body: {
          providerId: data.id,
          providerAvailabilityPreferences: data.availability_preferences,
        },
      });
    }
    return new Response(JSON.stringify(data), { status: 200 });
  }
};
