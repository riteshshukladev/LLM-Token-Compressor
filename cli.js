#!/usr/bin/env node
// cli.js

import fs from "fs";
import path from "path";
import fg from "fast-glob";
import { program } from "commander";
import { loadMapping, invertMapping, validateMapping } from "./mapping.js";
import { createReplacer } from "./transform.js";

/**
 * Remove all JS comments: block (/*…*​/) and line (//…)
 */
function removeComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .replace(/\/\/.*$/gm, ""); // line comments
}

/**
 * Strip leading whitespace (spaces/tabs) from each line
 */
function stripIndent(text) {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s+/, ""))
    .join("\n");
}

program
  .name("codec")
  .description("LLM token compressor/decompressor")
  .version("1.0.0");

program
  .command("validate")
  .requiredOption("-m, --mapping <file>", "path to mapping JSON")
  .action(({ mapping }) => {
    const map = loadMapping(mapping);
    validateMapping(map);
    console.log("✅ Mapping is valid");
  });

program
  .command("compress")
  .requiredOption("-m, --mapping <file>", "path to mapping JSON")
  .requiredOption("-i, --input <patternOrFile>", "input file(s) or glob")
  .requiredOption("-o, --output <dest>", "output directory or file")
  .action(async ({ mapping, input, output }) => {
    const map = loadMapping(mapping);
    validateMapping(map);
    const replacer = createReplacer(map);

    // normalize Windows backslashes for glob
    const norm = input.replace(/\\/g, "/");
    let files;
    if (/[*?\[\]]/.test(norm)) {
      files = await fg(norm);
    } else {
      const abs = path.resolve(input);
      if (!fs.existsSync(abs)) {
        console.error(`Input file not found: ${input}`);
        process.exit(1);
      }
      files = [abs];
    }
    if (files.length === 0) {
      console.error(`No files matched: ${input}`);
      process.exit(1);
    }

    const single = files.length === 1;
    const outIsFile = single && path.extname(output) !== "";

    for (const file of files) {
      // 1) Read
      let text = fs.readFileSync(file, "utf8");
      // 2) Remove comments
      text = removeComments(text);
      // 3) Strip leading whitespace
      text = stripIndent(text);
      // 4) Replace patterns
      const compressed = replacer(text);

      // 5) Determine destination
      let dest;
      if (single && outIsFile) {
        dest = output;
      } else {
        const rel = path.relative(process.cwd(), file);
        dest = path.join(output, rel);
      }

      // 6) Write out
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, compressed, "utf8");
      console.log(`Compressed: ${file} → ${dest}`);
    }
  });

program
  .command("decompress")
  .requiredOption("-m, --mapping <file>", "path to mapping JSON")
  .requiredOption("-i, --input <patternOrFile>", "input file(s) or glob")
  .requiredOption("-o, --output <dest>", "output directory or file")
  .action(async ({ mapping, input, output }) => {
    const map = loadMapping(mapping);
    validateMapping(map);
    const inv = invertMapping(map);
    const replacer = createReplacer(inv);

    const norm = input.replace(/\\/g, "/");
    let files;
    if (/[*?\[\]]/.test(norm)) {
      files = await fg(norm);
    } else {
      const abs = path.resolve(input);
      if (!fs.existsSync(abs)) {
        console.error(`Input file not found: ${input}`);
        process.exit(1);
      }
      files = [abs];
    }
    if (files.length === 0) {
      console.error(`No files matched: ${input}`);
      process.exit(1);
    }

    const single = files.length === 1;
    const outIsFile = single && path.extname(output) !== "";

    for (const file of files) {
      // 1) Read
      let text = fs.readFileSync(file, "utf8");
      // 2) Replace patterns
      let decompressed = replacer(text);
      // 3) Remove comments (just in case)
      decompressed = removeComments(decompressed);
      // 4) Strip leading whitespace
      decompressed = stripIndent(decompressed);

      // 5) Determine destination
      let dest;
      if (single && outIsFile) {
        dest = output;
      } else {
        const rel = path.relative(process.cwd(), file);
        dest = path.join(output, rel);
      }

      // 6) Write out
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, decompressed, "utf8");
      console.log(`Decompressed: ${file} → ${dest}`);
    }
  });

program.parse(process.argv);
