import { sequence, defineMiddleware } from "astro:middleware";
import { supabase } from "../lib/supabase";
import picomatch from "picomatch";

const protectedRoutes = [
  "/dashboard(|/)",
  "/provider/*/edit",
  "/addprovider(|/)",
];
const redirectRoutes = ["/signin(|/)", "/register(|/)"];
const proptectedAPIRoutes = ["/api/guestbook(|/)"];

const auth = defineMiddleware(async function (
  { locals, url, cookies, redirect },
  next,
) {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  const { data, error } = await supabase.auth.setSession({
    refresh_token: refreshToken?.value!,
    access_token: accessToken?.value!,
  });
  locals.user = data?.user;

  if (picomatch.isMatch(url.pathname, protectedRoutes)) {
    if (!accessToken || !refreshToken) {
      return redirect("/signin");
    }

    if (error) {
      cookies.delete("sb-access-token", {
        path: "/",
      });
      cookies.delete("sb-refresh-token", {
        path: "/",
      });
      return redirect("/signin");
    }

    cookies.set("sb-access-token", data?.session?.access_token!, {
      sameSite: "strict",
      path: "/",
      secure: true,
    });
    cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
      sameSite: "strict",
      path: "/",
      secure: true,
    });
  }

  if (picomatch.isMatch(url.pathname, redirectRoutes)) {
    if (accessToken && refreshToken) {
      return redirect("/dashboard");
    }
  }

  if (picomatch.isMatch(url.pathname, proptectedAPIRoutes)) {
    // Check for tokens
    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 },
      );
    }
    // Verify the tokens

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 },
      );
    }
  }

  return next();
});

export const onRequest = sequence(auth);
