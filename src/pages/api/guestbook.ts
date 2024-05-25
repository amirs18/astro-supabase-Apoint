import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

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
  const { email, name } = await request.json();
  const owner_user_id = (await supabase.auth.getUser()).data.user?.id!;
  const { data, error } = await supabase
    .from("providers")
    .insert({
      email,
      name,
      owner_user_id,
    })
    .select();

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
