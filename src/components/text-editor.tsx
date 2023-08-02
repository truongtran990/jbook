import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

import "./text-editor.css";

const TextEditor: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const mdEditorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        mdEditorRef.current &&
        event.target &&
        mdEditorRef.current.contains(event.target as Node)
      ) {
        return;
      }

      setIsEditing(false);
    };

    // Whenever user click into the MDEditor -> switch to view mode
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (isEditing) {
    return (
      <div ref={mdEditorRef}>
        <MDEditor />
      </div>
    );
  }
  return (
    <div onClick={() => setIsEditing(true)}>
      <MDEditor.Markdown source={"# Header"} />
    </div>
  );
};

export default TextEditor;
