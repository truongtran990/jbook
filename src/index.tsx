import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";

import { createRoot } from "react-dom/client";

const App = () => {
  const [inputRaw, setInputRaw] = useState("");
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

  const handleSubmitInput = () => {
    if (!ref.current) {
      return;
    }

    console.log(inputRaw);
    console.log(ref.current);
  };

  return (
    <div>
      <textarea
        value={inputRaw}
        onChange={(e) => setInputRaw(e.target.value)}
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
