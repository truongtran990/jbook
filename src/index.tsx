import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";

import { createRoot } from "react-dom/client";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

const App = () => {
  const [rawInput, setRawInput] = useState("");
  const [code, setCode] = useState("");

  const ref = useRef<any>();

  // initialize esbuild
  const startService = async () => {
    // return the service object that actually bundle, transform and transport.
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const handleSubmitInput = async () => {
    if (!ref.current) {
      return;
    }

    // // transpile the rawInput to js code
    // const result = await ref.current.transform(rawInput, {
    //   loader: "jsx",
    //   target: "es2015",
    // });

    // transpile the rawInput to js code
    const result = await ref.current.build({
      // index.js will be the first file of bundling process
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(rawInput)],
      define: {
        "process.env.NODE_ENV": "'production'",
        global: "window",
      },
    });

    setCode(result.outputFiles[0].text);
    console.log(result);
  };

  return (
    <div>
      <textarea
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
      ></textarea>

      <div>
        <button onClick={handleSubmitInput}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

// Get the element that will render react app
const container = document.getElementById("root");
const root = createRoot(container!);

// Render react app
root.render(<App />);
