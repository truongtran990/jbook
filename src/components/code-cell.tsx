import { useState, useEffect } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  const { updateCell } = useActions();

  useEffect(() => {
    const timer = setTimeout(async () => {
      // transpile the rawInput to js code
      const output = await bundle(cell.content);

      setCode(output.code);
      setError(output.err);
    }, 1000);

    // the return statement will be called automatically the next time useeffect is called
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div
        className="codeCell"
        style={{ height: "100%", display: "flex", flexDirection: "row" }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => {
              // setRawInput(value);
              updateCell(cell.id, value);
            }}
          />
        </Resizable>
        <Preview code={code} err={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
