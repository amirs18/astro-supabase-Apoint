/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly AUTH_CALLBACK_URL: string;
}
declare namespace App {
  interface Locals {
    user: import("@supabase/supabase-js").User | null;
  }
}
