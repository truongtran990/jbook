import { createRoot } from "react-dom/client";

import "bulmaswatch/superhero/bulmaswatch.min.css";
import { Provider } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";

import CodeCell from "./components/code-cell";
import TextEditor from "./components/text-editor";
import { store } from "./state";
import CellList from "./components/cell-list";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        {/* <CodeCell /> */}
        {/* <TextEditor /> */}
        <div>
          <CellList></CellList>
        </div>
      </div>
    </Provider>
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
