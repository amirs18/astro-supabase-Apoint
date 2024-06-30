import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import z from "zod";

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

const geometrySchema = z
  .object({
    type: z.literal("Feature"),
    properties: z.object({}),
    geometry: z.object({
      coordinates: z.number().array(),
      type: z.literal("Point"),
    }),
  })
  .nullable();
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);
const bodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  bio: z.string().nullable().default(null),
  // location_geoJSON: geometrySchema,
  location_name: z.string().nullable().default(null),
  phone_number: z
    .string()
    .regex(phoneRegex, "Invalid Phone Number!")
    .nullable()
    .default(null),
  photo_link: z.string().nullable().default(null),
});
// creates a new provider
export const POST: APIRoute = async ({ request }) => {
  const parsedBody = bodySchema.safeParse(await request.json());
  if (parsedBody.error) {
    return new Response(
      JSON.stringify({
        error: parsedBody.error.message,
      }),
      { status: 403 },
    );
  } else {
    const { email, name, phone_number, bio, location_name, photo_link } =
      parsedBody.data;
    const { data, error } = await supabase
      .from("providers")
      .insert({
        email,
        name,
        bio,
        location_name,
        phone_number,
        photo_link,
      })
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        { status: 500 },
      );
    }
    return new Response(JSON.stringify(data), { status: 200 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  const parsedBody = bodySchema
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
    const { id, email, name, phone_number, bio, location_name, photo_link } =
      parsedBody.data;
    const { data, error } = await supabase
      .from("providers")
      .update({
        email,
        name,
        bio,
        location_name,
        phone_number,
        photo_link,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        { status: 500 },
      );
    }
    return new Response(JSON.stringify(data), { status: 200 });
  }
};
