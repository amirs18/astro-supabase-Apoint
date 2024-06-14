import React, { useEffect, type ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import cookie from "cookie";
import { get } from "react-hook-form";

export function AuthHelper({ children }: { children: ReactNode }) {
  useEffect(() => {
    async function getUser() {
      const cookies = cookie.parse(document.cookie);
      const { data } = await supabase.auth.setSession({
        access_token: cookies["sb-access-token"]!,
        refresh_token: cookies["sb-refresh-token"]!,
      });
      return data.user;
    }
    getUser();
  }, []);
  return <>{children}</>;
}
