import React from "react";
import { useIframeContent } from "./contexts/IframeContentContext";

const IframeData = () => {
  const { iframeContent } = useIframeContent();
  console.log("This is content", iframeContent);

  if (!iframeContent) {
    return <div>No content available</div>;
  }
  return <>{iframeContent}</>;
};

export default IframeData;
