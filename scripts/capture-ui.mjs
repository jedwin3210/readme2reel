#!/usr/bin/env node
/**
 * Capture phone (390×844 @2x) and optional desktop screenshots for a reel.
 *
 * Usage:
 *   node scripts/capture-ui.mjs --base http://127.0.0.1:1313 --out .readme2reel/public/shots
 *   node scripts/capture-ui.mjs --base http://127.0.0.1:5173 --paths /,/docs --out .readme2reel/public/shots
 *
 * Requires: npm i -D playwright  (in the Remotion project or skill checkout)
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const base = (arg("--base", "http://127.0.0.1:3000")).replace(/\/$/, "");
const out = arg("--out", ".readme2reel/public/shots");
const paths = (arg("--paths", "/")).split(",").map((p) => (p.startsWith("/") ? p : `/${p}`));
const scrollTo = arg("--scroll-to", ""); // optional CSS or text to scroll into view after load

fs.mkdirSync(path.join(out, "phone"), { recursive: true });
fs.mkdirSync(path.join(out, "desktop"), { recursive: true });

const browser = await chromium.launch({ headless: true });

for (const p of paths) {
  const name = p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
  const phone = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  await phone.goto(`${base}${p}`, { waitUntil: "networkidle" });
  await phone.waitForTimeout(600);
  if (scrollTo) {
    await phone.evaluate((sel) => {
      const byCss = document.querySelector(sel);
      if (byCss) return byCss.scrollIntoView({ block: "start" });
      const t = [...document.querySelectorAll("h1,h2,h3,p")].find((e) =>
        (e.textContent || "").includes(sel),
      );
      t?.scrollIntoView({ block: "center" });
    }, scrollTo);
    await phone.waitForTimeout(400);
  }
  await phone.screenshot({ path: path.join(out, "phone", `${name}.png`) });
  await phone.close();

  const desk = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desk.goto(`${base}${p}`, { waitUntil: "networkidle" });
  await desk.waitForTimeout(600);
  await desk.screenshot({ path: path.join(out, "desktop", `${name}.png`) });
  await desk.close();
  console.log("captured", name);
}

await browser.close();
console.log("done →", out);
