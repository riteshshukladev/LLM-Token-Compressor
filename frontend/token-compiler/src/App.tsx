import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import "./App.css";
import axios from "axios";

function App() {
  const [compressedCode, setCompressedCode] = useState("");
  const [decompressedCode, setDecompressedCode] = useState("");
  const [compressedTokenCount, setCompressedTokenCount] = useState(null);
  const [decompressedTokenCount, setDecompressedTokenCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompressedCodeChange = (value: string | undefined) => {
    setCompressedCode(value || "");
  };

  const handleDecompressedCodeChange = (value: string | undefined) => {
    setDecompressedCode(value || "");
  };

  const handleDecompress = async () => {
    if (!compressedCode) {
      alert("Please enter compressed code first!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://llm-token-compressor.onrender.com/decompress",
        {
          code: compressedCode,
        }
      );

      console.log("Response from server:", response.data);
      setDecompressedCode(response.data.decompressedCode);
      setCompressedTokenCount(response.data.compressedTokenCount);
      setDecompressedTokenCount(response.data.decompressedTokenCount);
    } catch (error) {
      console.error("Error decompressing:", error);
      alert("An error occurred while decompressing the code!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="editor-container">
        <div className="editor">
          <h3>Compressed Code</h3>
          <MonacoEditor
            height="70%"
            language="javascript"
            value={compressedCode}
            onChange={handleCompressedCodeChange}
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
          />
        </div>
      </div>

      <button
        className={`decompress-btn ${isLoading ? "loading" : ""}`}
        onClick={handleDecompress}
        disabled={isLoading}
      >
        {isLoading
          ? "Decompressing..."
          : "Decompress and Show Token Count Comparison"}
      </button>

      {isLoading && <div className="loading-spinner">Processing...</div>}

      {!isLoading &&
        compressedTokenCount !== null &&
        decompressedTokenCount !== null && (
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
