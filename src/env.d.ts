/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    user: import("@supabase/supabase-js").User | null;
  }
}
