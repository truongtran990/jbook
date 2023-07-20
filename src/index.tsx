import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";

const App = () => {
  const [rawInput, setRawInput] = useState("");

  const ref = useRef<any>();
  const iframeRef = useRef<any>();

  // initialize esbuild
  const startService = async () => {
    // return the service object that actually bundle, transform and transport.
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const handleSubmitInput = async () => {
    if (!ref.current) {
      return;
    }

    iframeRef.current.srcdoc = iframeHtml;

    // transpile the rawInput to js code
    const result = await ref.current.build({
      // index.js will be the first file of bundling process
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      // plugins go from left to write onResolve -> onLoad
      plugins: [unpkgPathPlugin(), fetchPlugin(rawInput)],
      define: {
        "process.env.NODE_ENV": "'production'",
        global: "window",
      },
    });

    // setCode(result.outputFiles[0].text);

    iframeRef.current.contentWindow.postMessage(
      result.outputFiles[0].text,
      "*"
    );
  };

  const iframeHtml = `
    <html>
      <head>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener("message", event => {
            
            try {
              eval(event.data);
            } catch (error) {
              const rootEl = document.querySelector("#root");
              rootEl.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error +  '</div>';

              console.error(error);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => {
          setRawInput(value);
        }}
      />
      <textarea
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        placeholder="Starting write your code!!!"
      ></textarea>

      <div>
        <button onClick={handleSubmitInput}>Submit</button>
      </div>

      <iframe
        ref={iframeRef}
        title="iframePreview"
        // passing the transpiling code into iframe to execute
        srcDoc={iframeHtml}
        sandbox="allow-scripts"
        // src="http://nothing.localhost:3000/iframe.html"
      ></iframe>
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
