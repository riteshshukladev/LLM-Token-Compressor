#!/usr/bin/env node
// compareTokens.mjs
import fs from "fs";
import { encoding_for_model } from "@dqbd/tiktoken";

async function main() {
  const [origFile, compFile, model = "gpt-4o"] = process.argv.slice(2);

  if (!origFile || !compFile) {
    console.error(
      "Usage: node compareTokens.mjs <original.js> <compressed.js> [model]"
    );
    process.exit(1);
  }

  // load encoder (WASM download happens under the hood on first run)
  const encoder = await encoding_for_model(model);

  // read files
  const origText = fs.readFileSync(origFile, "utf8");
  const compText = fs.readFileSync(compFile, "utf8");

  // count tokens
  const origCount = encoder.encode(origText).length;
  const compCount = encoder.encode(compText).length;

  // compute savings
  const diff = origCount - compCount;
  const percent = ((diff / origCount) * 100).toFixed(2);

  // print results
  console.log(`Model:           ${model}`);
  console.log(`${origFile}: ${origCount.toString().padStart(5)} tokens`);
  console.log(`${compFile}: ${compCount.toString().padStart(5)} tokens`);
  console.log("---------------------------------");
  console.log(
    `Saved:           ${diff
      .toString()
      .padStart(5)} tokens  (${percent}% reduction)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
