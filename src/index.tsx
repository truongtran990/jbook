import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
};

// Get the element that will render react app
const container = document.getElementById("root");
const root = createRoot(container!);

// Render react app
root.render(<App />);
