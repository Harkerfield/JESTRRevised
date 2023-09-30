// SharePointData.js
import React, { useEffect, useState, useContext } from 'react';
import { SharePointContext } from '../../Provider/SharePointContext.js';

function SharePointData() {
  const [data, setData] = useState(null);
  const { isScriptLoaded, fetchData } = useContext(SharePointContext);

  useEffect(() => {
    if (isScriptLoaded) {
      fetchData(
        (title) => setData(title),
        (error) => console.error(error)
      );
    }
  }, [isScriptLoaded, fetchData]);

  return (
    <div>
      SharePoint Web Title: {data}
    </div>
  );
}

export default SharePointData;
