import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

export const GET: APIRoute = async ({ params }) => {
  const provider_id = Number(params.providerId);
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("provider_id", provider_id);

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
