import React, { createContext, useContext, useState } from "react";

const IframeContentContext = createContext();

export const useIframeContent = () => useContext(IframeContentContext);

export const IframeContentProvider = ({ children }) => {
  const [iframeContent, setIframeContent] = useState(null);
    console.log(iframeContent)
  return (
    <IframeContentContext.Provider value={{ iframeContent, setIframeContent }}>
      {children}
    </IframeContentContext.Provider>
  );
};