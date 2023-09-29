/* global SP */
// hooks/useCreateList.js

import { useState, useCallback } from "react";

const useCreateList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createList = useCallback(async (listTitle, columnArrays) => {
    setLoading(true);
    var clientContext = new SP.ClientContext();
    var oWeb = clientContext.get_web();
    var listCreation = new SP.ListCreationInformation();
    listCreation.set_title(listTitle);
    listCreation.set_templateType(SP.ListTemplateType.genericList);
    var mySpList = oWeb.get_lists().add(listCreation);
    var fieldCol = mySpList.get_fields();

    columnArrays.forEach((item) => {
      var spTxtField = fieldCol.addFieldAsXml(
        item.data,
        true,
        SP.AddFieldOptions.addToDefaultContentType,
      );
      spTxtField.set_title(item.title);
    });

    mySpList.update();

    clientContext.executeQueryAsync(
      function () {
        alert("successfully Created The List and List Field");
        setLoading(false);
      },
      function (sender, args) {
        setError("Error: " + args.get_message() + "\n" + args.get_stackTrace());
        setLoading(false);
      },
    );
  }, []);

  return { createList, loading, error };
};

export { useCreateList };
