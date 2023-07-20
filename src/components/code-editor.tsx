import MonacoEditor from "@monaco-editor/react";

const CodeEditor = () => {
  return (
    <MonacoEditor
      options={{
        wordWrap: "on",
      }}
      language="javascript"
      theme="dark"
      height="500px"
    />
  );
};

export default CodeEditor;
