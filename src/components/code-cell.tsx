import { useState } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";

const CodeCell = () => {
  const [rawInput, setRawInput] = useState("");
  const [code, setCode] = useState("");

  const handleSubmitInput = async () => {
    // transpile the rawInput to js code
    const output = await bundle(rawInput);

    setCode(output);
  };

  return (
    <div className="codeCell">
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

export default CodeCell;
