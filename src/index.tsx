import { createRoot } from "react-dom/client";

import "bulmaswatch/superhero/bulmaswatch.min.css";
import CodeCell from "./components/code-cell";

const App = () => {
  return (
    <div>
      <CodeCell />
      <CodeCell />
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
