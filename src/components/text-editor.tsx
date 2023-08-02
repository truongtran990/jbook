import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

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
        console.log("element clicked is inside the editor");
        return;
      }
      console.log("element clicked is not inside the editor");
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
