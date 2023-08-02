import { useEffect, useRef } from "react";

import "./preview.css";

interface PreviewProps {
  code: string;
  err: string;
}

const iframeHtml = `
    <html>
      <head>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (error) => {
            const rootEl = document.querySelector("#root");
            rootEl.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error +  '</div>';

            console.error(error);
          }

          window.addEventListener("error", event => {
            event.preventDefault();
            handleError(event.message);
          });
          window.addEventListener("message", event => {
            try {
              eval(event.data);
            } catch (error) {
              handleError(error);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframeRef = useRef<any>();

  useEffect(() => {
    iframeRef.current.srcdoc = iframeHtml;
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, "*");
    }, 20);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        style={{ backgroundColor: "white" }}
        ref={iframeRef}
        title="iframePreview"
        srcDoc={iframeHtml}
        sandbox="allow-scripts"
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
