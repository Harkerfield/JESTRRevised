/* global SP */
// ConfigContext.js
import React, { createContext, useState, useEffect } from 'react';


export const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    console.log("config", config)
    setSettings(config)
  }, [config])





  useEffect(() => {

    const settingsPath = process.env.NODE_ENV === 'production'
    ? `sites/354RANS/hafi/tester/settings/settings.txt`
    : './settings/settings.txt'

    
    fetch(settingsPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();  // Use text() instead of json() since the file is a .txt file
      })
      .then(data => {
        const jsonData = JSON.parse(data);  // Convert text to JSON
        return jsonData
      })
      .then(data => {
        checkAdminStatus(
          (isAdmin) => {
            data.admin = isAdmin;  // Adding admin property to data object
            setConfig(data);
          },
          (error) => {
            console.error('Error checking admin status:', error);
            data.admin = true;  // Setting admin to true on error for debugging
            console.log(data)
            setConfig(data);
          }
        );
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  //this might be an error

  const checkAdminStatus = (OnSuccess, OnError) => {
    try {
      var context = SP.ClientContext.get_current();
      var user = context.get_web().get_currentUser();
      context.load(user);

      context.executeQueryAsync(
        function () {
          var isSiteAdmin = user.get_isSiteAdmin();
          OnSuccess(isSiteAdmin);
        },
        OnError
      );
    } catch (error) {
      OnError(error);
    }
  };

  if (!settings) { return }
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};
