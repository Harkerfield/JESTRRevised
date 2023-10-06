/* global SP */
// hooks/useCheckListExists.js
import { useState, useCallback } from "react";

const useCheckListExists = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkListsExist = useCallback(async (listTitles) => {
    setLoading(true);
    const existenceMap = {};
    const clientContext = new SP.ClientContext.get_current();
    const oWeb = clientContext.get_web();
    const lists = oWeb.get_lists();
    clientContext.load(lists);

    try {
      await new Promise((resolve, reject) => {
        clientContext.executeQueryAsync(
          () => {
            Object.keys(listTitles).forEach(key => {
              let title = listTitles[key];
              let listExists = false;
              const listEnumerator = lists.getEnumerator();
              while (listEnumerator.moveNext()) {
                const oList = listEnumerator.get_current();
                if (oList.get_title() === title) {
                  listExists = true;
                  break;
                }
              }
              existenceMap[title] = listExists;
            });
            resolve();
          },
          (sender, args) => {
            reject(new Error(args.get_message()));
          },
        );
      });
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
    return existenceMap;
  }, []);

  return { checkListsExist, loading, error };
};

export { useCheckListExists };
