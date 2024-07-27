import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import MillionCompiler from "@million/lint";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({

  site:
    import.meta.env.MODE === "production"
      ? "https://astro-supabase-apoint.vercel.app"
      : "http://localhost:4321",
  output: "server",
  adapter: vercel(),
  integrations: [tailwind(),sitemap(), react()],
  vite: {
    plugins: [MillionCompiler.vite()],
  },
});
