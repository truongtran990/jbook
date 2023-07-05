import { useState } from "react";

import { createRoot } from "react-dom/client";

const App = () => {
  const [inputRaw, setInputRaw] = useState("");
  const [code, setCode] = useState("");

  const handleSubmitInput = () => {
    console.log(inputRaw);
  };

  return (
    <div>
      <textarea
        value={inputRaw}
        onChange={(e) => setInputRaw(e.target.value)}
      ></textarea>

      <div>
        <button onClick={handleSubmitInput}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

// Get the element that will render react app
const container = document.getElementById("root");
const root = createRoot(container!);

// Render react app
root.render(<App />);
