/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    email: string;
    user_id: string;
    user: import("@supabase/supabase-js").User | null;
  }
}
