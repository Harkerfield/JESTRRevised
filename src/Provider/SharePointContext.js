/* global _spPageContextInfo */
/* global SP */
// SharePointContext.js
import React, { createContext, useState, useEffect } from 'react';

export const SharePointContext = createContext();

export const SharePointProvider = ({ children }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/_layouts/15/init.js";
    script.onload = () => {
      SP.SOD.executeFunc('sp.js', 'SP.ClientContext', () => {
        console.log('SP.js loaded');
        setIsScriptLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  const fetchData = (callback, errorHandler) => {
    if (window.SP && window.SP.ClientContext) {
      const ctx = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
      const web = ctx.get_web();
      ctx.load(web);

      ctx.executeQueryAsync(
        () => callback(web.get_title()),
        (sender, args) => errorHandler(args.get_message())
      );
    } else {
      errorHandler("SP.js is not loaded");
    }
  };

  return (
    <SharePointContext.Provider value={{ isScriptLoaded, fetchData }}>
      {children}
    </SharePointContext.Provider>
  );
};
