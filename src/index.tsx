import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "bulmaswatch/superhero/bulmaswatch.min.css";

import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler";

const App = () => {
  const [rawInput, setRawInput] = useState("");
  const [code, setCode] = useState("");

  const handleSubmitInput = async () => {
    // transpile the rawInput to js code
    const output = await bundle(rawInput);

    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => {
          setRawInput(value);
        }}
      />

      <div>
        <button onClick={handleSubmitInput}>Submit</button>
      </div>

      <Preview code={code} />
    </div>
  );
};

// const iframeHtml = `
//   <h2>Local HTML doc</h2>
// `;

// Get the element that will render react app
const container = document.getElementById("root");
const root = createRoot(container!);

// Render react app
root.render(<App />);

/* 
import 'tiny-test-pkg';
import 'bulma/css/bulma.css';
*/
