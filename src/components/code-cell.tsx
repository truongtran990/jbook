import { useState, useEffect } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";

const CodeCell = () => {
  const [rawInput, setRawInput] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      // transpile the rawInput to js code
      const output = await bundle(rawInput);

      setCode(output.code);
      setError(output.err);
    }, 1000);

    // the return statement will be called automatically the next time useeffect is called
    return () => {
      clearTimeout(timer);
    };
  }, [rawInput]);

  return (
    <Resizable direction="vertical">
      <div
        className="codeCell"
        style={{ height: "100%", display: "flex", flexDirection: "row" }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => {
              setRawInput(value);
            }}
          />
        </Resizable>
        <Preview code={code} err={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
