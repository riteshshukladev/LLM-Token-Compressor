// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import "./App.css";
import axios from "axios"; // Import axios for making API requests

function App() {
  const [compressedCode, setCompressedCode] = useState("");
  const [decompressedCode, setDecompressedCode] = useState("");
  const [compressedTokenCount, setCompressedTokenCount] = useState(null);
  const [decompressedTokenCount, setDecompressedTokenCount] = useState(null);

  // Corrected the type for 'value' to 'string | undefined'
  const handleCompressedCodeChange = (value: string | undefined) => {
    setCompressedCode(value || ""); // Handle undefined case
  };

  const handleDecompressedCodeChange = (value: string | undefined) => {
    setDecompressedCode(value || ""); // Handle undefined case
  };

  // Corrected the 'wordWrap' to a valid value as per MonacoEditor requirements

  const handleDecompress = async () => {
    if (!compressedCode) {
      alert("Please enter compressed code first!");
      return;
    }

    try {
      // Send the compressed code to the backend for decompression
      const response = await axios.post("http://localhost:5000/decompress", {
        code: compressedCode,
      });

      // Log the response to check the decompressed code
      console.log("Response from server:", response.data);

      // Set decompressed code and token counts for both compressed and decompressed code
      setDecompressedCode(response.data.decompressedCode);
      setCompressedTokenCount(response.data.compressedTokenCount);
      setDecompressedTokenCount(response.data.decompressedTokenCount);
    } catch (error) {
      console.error("Error decompressing:", error);
      alert("An error occurred while decompressing the code!");
    }
  };

  return (
    <div className="App">
      <h1>LLM Code Compressor/Decompressor</h1>

      <div className="editor-container">
        <div className="editor">
          <h3>Compressed Code</h3>
          <MonacoEditor
            height="70%"
            language="javascript"
            value={compressedCode}
            onChange={handleCompressedCodeChange}
            // options={editorOptions}
            theme="vs-dark"
          />
        </div>

        <div className="editor">
          <h3>Decompressed Code</h3>
          <MonacoEditor
            height="70%"
            language="javascript"
            value={decompressedCode}
            theme="vs-dark"
            onChange={handleDecompressedCodeChange}
            // options={editorOptions}
          />
        </div>
      </div>

      <button className="decompress-btn" onClick={handleDecompress}>
        Decompress and Show Token Count Comparison
      </button>

      {compressedTokenCount !== null && decompressedTokenCount !== null && (
        <div className="token-count">
          <h4>Token Comparison:</h4>
          <p>Compressed Code: {compressedTokenCount} tokens</p>
          <p>Decompressed Code: {decompressedTokenCount} tokens</p>
          <p>
            Tokens Saved: {compressedTokenCount - decompressedTokenCount} (
            {Math.abs(
              ((compressedTokenCount - decompressedTokenCount) /
                compressedTokenCount) *
                100
            ).toFixed(2)}
            % reduction)
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
