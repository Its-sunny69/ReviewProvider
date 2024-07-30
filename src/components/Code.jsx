import React, { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import toast from "react-hot-toast";

export default function Code({ code, language, copy }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);

    toast.success("Link Copied!", {
      duration: 2000,
      position: "top-center",
    });
  };

  return (
    <div className="my-3">
      <p className="my-1 text-lg">Embed Code:</p>
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      {copy && (
        <div className="flex mt-3 justify-end items-center">
        <button
          className="border border-1 shadow-md border-blue-800 h-max px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md bg-blue-800 hover:bg-blue-100 hover:text-slate-900"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          Copy Code
        </button>
        </div>
      )}
    </div>
  );
}