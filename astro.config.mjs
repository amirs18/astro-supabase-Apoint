import { defineConfig } from "astro/config";
import deno from "@astrojs/deno";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";
import react from "@astrojs/react";
import MillionCompiler from "@million/lint";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-supabase-auth.vercel.app",
  output: "server",
  adapter: deno(),
  integrations: [tailwind(), react()],
});
