import { useState } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";

const CodeCell = () => {
  const [rawInput, setRawInput] = useState("");
  const [code, setCode] = useState("");

  const handleSubmitInput = async () => {
    // transpile the rawInput to js code
    const output = await bundle(rawInput);

    setCode(output);
  };

  return (
    <Resizable direction="vertical">
      <div
        className="codeCell"
        style={{ height: "100%", display: "flex", flexDirection: "row" }}
      >
        <CodeEditor
          initialValue="const a = 1;"
          onChange={(value) => {
            setRawInput(value);
          }}
        />

        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
