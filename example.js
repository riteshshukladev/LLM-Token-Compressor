// example.js

import { readFile, writeFile } from "fs/promises";
import { join } from "path";

// This line uses console.log and console.error
console.log("Starting process");
console.error("An error occurred");
console.warn("This is just a warning");

// A class with a constructor
class UserManager {
  constructor(options = {}) {
    this.options = options;
  }
}

// Async function with try/catch/finally and await
async function fetchData(url) {
  try {
    const raw = await readFile(url, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("fetchData error:", error);
    throw error;
  } finally {
    console.log("fetchData complete");
  }
}

// A Promise with setTimeout
const promise = new Promise((resolve) => {
  setTimeout(() => resolve("done"), 1000);
});

// Another timer
setInterval(() => console.log("tick"), 500);

// JSON methods
const parsed = JSON.parse('{"a":1}');
const strified = JSON.stringify(parsed);

// Mapping keys inside strings or identifiers should NOT be replaced:
const str =
  "This is a function string and console.log should not map in comments";
// e.g. 'functionality' or 'consoleLogger' must stay intact
const consoleLogger = { level: "info" };

// A regex literal containing the word async
const re = /async function (\w+)/;

// Exported function to test 'export'
export function doExport() {
  return exportValue; // 'exportValue' should not be touched
}

// Test throw
function testThrow() {
  throw new Error("Oops");
}

// End of file
