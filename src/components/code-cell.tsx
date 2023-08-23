import { useEffect } from "react";

import "./code-cell.css";
import CodeEditor from "./code-editor";
import Preview from "./preview";

import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  // get all the code from the current cell and the previous cells
  const cumulativeCode = useTypedSelector((state) => {
    // @ts-ignore
    const { data, order } = state.cells;
    const orderedCells = order.map((id: string) => data[id]);

    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = (value) => {
        console.log('show is called')
        const root = document.querySelector('#root');
        if (typeof value === 'object') {
          /*Check if the value if the jsx element or not*/
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root)
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value;
        }
      }
    `;
    const showFuncNoOp = "var show = () => {}";

    const cumulativeCode = [];

    for (const c of orderedCells) {
      if (c.type === "code") {
        /* logic to check if the currentthe current cell is the cell to run the code */
        if (c.id === cell.id) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoOp);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cell.id) {
        break;
      }
    }

    return cumulativeCode;
  });

  useEffect(() => {
    // for the first initial bundle
    if (!bundle) {
      createBundle(cell.id, cumulativeCode.join("\n"));
      return;
    }

    const timer = setTimeout(async () => {
      // transpile the rawInput to js code
      createBundle(cell.id, cumulativeCode.join("\n"));
    }, 750);

    // the return statement will be called automatically the next time useeffect is called
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode.join("\n"), cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        className="codeCell"
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
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
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading...
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
