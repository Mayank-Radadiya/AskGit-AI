import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styles from "react-syntax-highlighter/dist/esm/styles/prism/material-dark";

interface CodeViewerProps {
   rawCode: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ rawCode }) => {
   return (
      <div className="rounded-md bg-gray-100 p-4 max-w-full">
         <h3 className="mb-2 text-lg font-bold">Rendered Code:</h3>
         <SyntaxHighlighter language="javascript" style={styles}>
            {rawCode}
         </SyntaxHighlighter>
      </div>
   );
};

export default CodeViewer;
