#!/usr/bin/env node
import { Command } from "commander";

const program = new Command("shotlist");
program
  .argument("<urls-file>", "file with one URL per line")
  .option("-o, --output-dir <dir>", "where screenshots are written", "shots")
  .option("-w, --width <px>", "viewport width", "1280")
  .option("--full-page", "capture the whole page, not just the viewport")
  .action((file, opts) => {
    console.log(`would capture ${file} into ${opts.outputDir}`);
  });
program.parse();
