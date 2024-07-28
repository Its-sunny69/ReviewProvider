import React from "react";
import { useIframeContent } from "./contexts/IframeContentContext";

const IframeData = () => {
  const { iframeContent } = useIframeContent();

  console.log("IframeData rendered with content:", iframeContent);

  if (!iframeContent) {
    return <div>No content available</div>;
  }

  return <div>{iframeContent}</div>;
};

export default IframeData;
