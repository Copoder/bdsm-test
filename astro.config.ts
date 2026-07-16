import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const canonicalOrigin = "https://bdsmtest.top";
const configuredOrigin = process.env.PUBLIC_SITE_URL ?? canonicalOrigin;

if (configuredOrigin !== canonicalOrigin) {
  throw new Error(`PUBLIC_SITE_URL must be ${canonicalOrigin}`);
}

export default defineConfig({
  site: configuredOrigin,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  devToolbar: {
    enabled: false
  },
  build: {
    assets: "assets"
  },
  vite: {
    build: {
      cssMinify: "lightningcss"
    }
  }
});
