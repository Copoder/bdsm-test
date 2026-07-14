import { appendFile, rm } from "node:fs/promises";

const branch = process.env.CF_PAGES_BRANCH;
const isPreview = Boolean(branch && branch !== "main");

if (isPreview) {
  await appendFile(
    new URL("../dist/_headers", import.meta.url),
    "\n/*\n  X-Robots-Tag: noindex, nofollow\n"
  );
  await rm(new URL("../dist/sitemap-index.xml", import.meta.url), { force: true });
  await rm(new URL("../dist/sitemap-0.xml", import.meta.url), { force: true });
}
