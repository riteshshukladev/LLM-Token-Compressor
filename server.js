import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import cors from "cors"; // Import CORS for cross-origin requests
import { loadMapping, invertMapping } from "./mapping.js";
import { createReplacer } from "./transform.js";
import { countTokens } from "./countTokens.js"; // Token count logic
import { fileURLToPath } from "url";

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

// Get the current directory in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the mapping.json from the server's filesystem
const mappingFilePath = path.join(__dirname, "mapping.json");

// Endpoint to handle decompression and token comparison
app.post("/decompress", async (req, res) => {
  const { code } = req.body; // Compressed code sent from frontend
  console.log("Received compressed code:", code); // Debug log

  try {
    // Load the mapping and invert it
    const mapping = loadMapping(mappingFilePath); // Load the mapping from the file
    if (!mapping || typeof mapping !== "object") {
      console.error("Invalid mapping file format.");
      res.status(500).send("Invalid mapping file format.");
      return;
    }

    const invertedMapping = invertMapping(mapping);
    const replacer = createReplacer(invertedMapping);

    // 1. Token count for compressed code
    const compressedTokenCount = countTokens(code);
    console.log("Compressed Token Count:", compressedTokenCount);

    // 2. Decompress the code using the replacer
    let decompressedCode = replacer(code);

    // Debugging: Check the decompressed code
    console.log("Decompressed Code after replacer:", decompressedCode);

    // Remove comments and strip leading whitespace
    decompressedCode = decompressedCode
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
      .replace(/\/\/.*$/gm, "") // Remove line comments
      .replace(/^\s+/gm, ""); // Strip leading whitespace

    // Debugging: Check the code after stripping comments and whitespace
    console.log(
      "Decompressed Code after comment removal and whitespace stripping:",
      decompressedCode
    );

    // 3. Token count for decompressed code
    const decompressedTokenCount = countTokens(decompressedCode);
    console.log("Decompressed Token Count:", decompressedTokenCount);

    // Send decompressed code, token count for both, and the compressed token count
    res.json({
      decompressedCode,
      compressedTokenCount,
      decompressedTokenCount,
    });
  } catch (error) {
    console.error("Error decompressing:", error);
    res.status(500).send(`Error during decompression: ${error.message}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
