// mapping.js
import fs from "fs";
import path from "path";

/**
 * Load a JSON mapping from disk.
 * @param {string} filePath
 * @returns {Object<string,string>}
 */
export function loadMapping(filePath) {
  const absPath = path.resolve(process.cwd(), filePath);
  let raw;
  try {
    raw = fs.readFileSync(absPath, "utf8");
  } catch (e) {
    console.error(`Failed to read mapping file: ${e.message}`);
    process.exit(1);
  }
  let mapping;
  try {
    mapping = JSON.parse(raw);
  } catch (e) {
    console.error(`Invalid JSON in mapping file: ${e.message}`);
    process.exit(1);
  }
  return mapping;
}

/**
 * Invert a mapping: { key: value } → { value: key }
 * @param {Object<string,string>} mapping
 * @returns {Object<string,string>}
 */
export function invertMapping(mapping) {
  const inverted = {};
  for (const [key, val] of Object.entries(mapping)) {
    if (inverted[val]) {
      console.error(
        `Mapping collision: value '${val}' used by both '${inverted[val]}' and '${key}'`
      );
      process.exit(1);
    }
    inverted[val] = key;
  }
  return inverted;
}

/**
 * Validate mapping for duplicate keys or values.
 * @param {Object<string,string>} mapping
 */
export function validateMapping(mapping) {
  const keys = Object.keys(mapping);
  const values = Object.values(mapping);
  const duplicateKeys = keys.filter((k, i) => keys.indexOf(k) !== i);
  const duplicateValues = values.filter((v, i) => values.indexOf(v) !== i);
  if (duplicateKeys.length || duplicateValues.length) {
    console.error("Mapping validation failed:");
    if (duplicateKeys.length) console.error("  Duplicate keys:", duplicateKeys);
    if (duplicateValues.length)
      console.error("  Duplicate values:", duplicateValues);
    process.exit(1);
  }
}
