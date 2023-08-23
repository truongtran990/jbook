import { useTypedSelector } from "../hooks/use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  // get all the code from the current cell and the previous cells
  return useTypedSelector((state) => {
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
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoOp);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }

    return cumulativeCode;
  }).join("\n");
};
