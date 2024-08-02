import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import MillionCompiler from "@million/lint";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
// import deno from "@deno/astro-adapter";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-supabase-apoint.vercel.app",
  output: "server",
  adapter: /*deno({ port: 4321 })*/ vercel(),
  integrations: [tailwind(), sitemap(), react()],
});
