import React, { useRef, useState, useContext } from 'react';
import { ConfigContext } from "../Provider/Context.js"; 


const SharePointUploader = () => {
    const config = useContext(ConfigContext);

    const folderInput = useRef(null);
    const [uploading, setUploading] = useState(false);

    const uploadFolder = async (folder) => {
        const listTitle = 'tester'; // Update with your SharePoint list title
        const folderPath = ''; // Update with the folder path in your SharePoint document library

        try {
            const uploadPromises = [];

            for (let item of folder) {
                if (item.kind === 'file') {
                    const uploadPromise = uploadFile(item.getAsFile(), listTitle, folderPath);
                    uploadPromises.push(uploadPromise);
                } else if (item.kind === 'directory') {
                    const folderName = item.name;
                    await createFolder(listTitle, folderPath, folderName);

                    const subFolder = await readEntries(item);

                    const subPromises = subFolder.map(subItem => {
                        if (subItem.kind === 'file') {
                            return uploadFile(subItem.getAsFile(), listTitle, `${folderPath}/${folderName}`);
                        }
                        return Promise.resolve();
                    });

                    uploadPromises.push(...subPromises);
                }
            }

            await Promise.all(uploadPromises);
            alert('All files and folders have been uploaded successfully!');
        } catch (error) {
            console.error(error);
            alert('There was an error during the upload. Check the console for more details.');
        } finally {
            setUploading(false);
        }
    };

    const createFolder = async (listTitle, folderPath, folderName) => {
        // SharePoint REST API URL for creating a folder
        const createFolderUrl = `${config.apiBaseUrl}_api/web/lists/getbytitle('${listTitle}')/rootfolder/folders/add('${folderPath}/${folderName}')`;

        await fetch(createFolderUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': await getRequestDigest(),
            },
        });
    };

    const uploadFile = async (file, listTitle, folderPath) => {
        // SharePoint REST API URL for uploading a file
        const uploadFileUrl = `${config.apiBaseUrl}/_api/web/lists/getbytitle('${listTitle}')/rootfolder/files/add(url='${folderPath}/${file.name}',overwrite=true)`;

        const response = await fetch(uploadFileUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'X-RequestDigest': await getRequestDigest(),
            },
            body: file,
        });

        if (!response.ok) {
            throw new Error(`Error uploading file: ${response.statusText}`);
        }
    };

    const getRequestDigest = async () => {
        // SharePoint REST API URL for getting the request digest
        const requestDigestUrl = '/_api/contextinfo';

        const response = await fetch(requestDigestUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.d.GetContextWebInformation.FormDigestValue;
        } else {
            throw new Error('Error getting request digest');
        }
    };

    const readEntries = (directory) => {
        return new Promise((resolve, reject) => {
            directory.createReader().readEntries((entries) => {
                resolve(entries);
            }, (error) => {
                reject(`Error reading directory: ${error}`);
            });
        });
    };

    const onUpload = (event) => {
        event.preventDefault();
        const folder = folderInput.current.files;
        if (!folder || folder.length === 0) return;

        setUploading(true);
        uploadFolder(folder);
    };

    return (
        <div>
            <input type="file" ref={folderInput} webkitdirectory="" directory="" multiple />
            <button onClick={(e) => onUpload(e)} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

export default SharePointUploader;
