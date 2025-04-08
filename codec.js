#!/usr/bin/env node
// codec.mjs

import fs from "fs";
import path from "path";

function loadMapping(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading mapping file "${filePath}":`, e.message);
    process.exit(1);
  }
}

function compress(text, mapping) {
  // 1) strip leading whitespace from each line
  const stripped = text
    .split("\n")
    .map((line) => line.replace(/^\s+/, "")) // remove all leading spaces/tabs
    .join("\n");

  // 2) apply your mappings, longest keys first
  return Object.keys(mapping)
    .sort((a, b) => b.length - a.length)
    .reduce((acc, key) => acc.split(key).join(mapping[key]), stripped);
}

function decompress(text, mapping) {
  // invert mapping: value → key
  const inv = Object.fromEntries(
    Object.entries(mapping).map(([k, v]) => [v, k])
  );

  // reverse replacements, longest tokens first
  return Object.keys(inv)
    .sort((a, b) => b.length - a.length)
    .reduce((acc, tok) => acc.split(tok).join(inv[tok]), text);
}

function printUsageAndExit() {
  console.error(`
Usage:
  node codec.mjs <compress|decompress> -m mapping.json [-i input.js] [-o output.js]

  - If -i is omitted or '-', reads stdin.
  - If -o is omitted or '-', writes to stdout.
`);
  process.exit(1);
}

// --- argument parsing ---
const args = process.argv.slice(2);
if (args.length < 1) printUsageAndExit();

const mode = args[0];
if (!["compress", "decompress"].includes(mode)) printUsageAndExit();

let mappingFile,
  inputFile = "-",
  outputFile = "-";
for (let i = 1; i < args.length; i++) {
  switch (args[i]) {
    case "-m":
      mappingFile = args[++i];
      break;
    case "-i":
      inputFile = args[++i];
      break;
    case "-o":
      outputFile = args[++i];
      break;
    default:
      console.error(`Unknown flag ${args[i]}`);
      printUsageAndExit();
  }
}
if (!mappingFile) {
  console.error("Missing mapping file (-m)");
  printUsageAndExit();
}

// --- load mapping ---
const mapping = loadMapping(mappingFile);

// --- I/O helper ---
function output(text) {
  if (outputFile === "-") {
    process.stdout.write(text);
  } else {
    fs.writeFileSync(outputFile, text, "utf8");
  }
}

// --- run ---
if (inputFile === "-") {
  // read from stdin
  let buf = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => (buf += chunk));
  process.stdin.on("end", () => {
    const result =
      mode === "compress" ? compress(buf, mapping) : decompress(buf, mapping);
    output(result);
  });
} else {
  // read from file
  const txt = fs.readFileSync(inputFile, "utf8");
  const result =
    mode === "compress" ? compress(txt, mapping) : decompress(txt, mapping);
  output(result);
}
