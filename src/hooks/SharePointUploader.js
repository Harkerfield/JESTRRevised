/* global SP */
import React, { useRef, useState } from 'react';

const SharePointUploader = () => {
    const folderInput = useRef(null);
    const [uploading, setUploading] = useState(false);

    const createFolder = (oList, folderName) => {
        const folderCreateInfo = new SP.ListItemCreationInformation();
        folderCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
        folderCreateInfo.set_leafName(folderName);
        const newFolder = oList.addItem(folderCreateInfo);
        newFolder.update();
    };

    const uploadFile = (file, oList, folderPath, resolve, reject) => {
        const clientContext = new SP.ClientContext.get_current();
        const fileCreateInfo = new SP.FileCreationInformation();
        fileCreateInfo.set_url(file.name);
        fileCreateInfo.set_overwrite(true);
        fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
    
        const fileReader = new FileReader();
    
        fileReader.onload = function (event) {
            const fileContent = event.target.result;
            
            // Convert data to byte array
            let byteArray = new Uint8Array(fileContent);
            for (let i = 0; i < byteArray.byteLength; i++) {
                fileCreateInfo.get_content().append(byteArray[i]);
            }
    
            let targetFolder;
            if (folderPath) {
                targetFolder = oList.get_rootFolder().get_folders().getByUrl(folderPath);
            } else {
                targetFolder = oList.get_rootFolder();
            }
    
            targetFolder.get_files().add(fileCreateInfo);
    
            clientContext.executeQueryAsync(function () {
                resolve();
            }, function (sender, args) {
                reject('Error uploading file: ' + args.get_message());
            });
        };
    
        fileReader.onerror = function (error) {
            reject('Error reading file: ' + error.toString());
        };
    
        fileReader.readAsArrayBuffer(file);
    };
    
    

    const uploadFolder = (folder) => {
        const clientContext = new SP.ClientContext.get_current();
        const oWeb = clientContext.get_web();
        const oList = oWeb.get_lists().getByTitle('tester');

        const uploadPromises = [];

        for (let item of folder) {
            if (item.kind === 'file') {
                const uploadPromise = new Promise((resolve, reject) => {
                    uploadFile(item.getAsFile(), oList, undefined, resolve, reject);
                });
                uploadPromises.push(uploadPromise);
            } else if (item.kind === 'directory') {
                const folderName = item.name;
                createFolder(oList, folderName);

                const folderPromise = new Promise((resolve, reject) => {
                    clientContext.executeQueryAsync(() => {
                        item.createReader().readEntries((subFolder) => {
                            const subPromises = [];
                            for (let subItem of subFolder) {
                                if (subItem.kind === 'file') {
                                    const subUploadPromise = new Promise((subResolve, subReject) => {
                                        uploadFile(subItem.getAsFile(), oList, folderName, subResolve, subReject);
                                    });
                                    subPromises.push(subUploadPromise);
                                }
                            }
                            Promise.all(subPromises).then(resolve).catch(reject);
                        });
                    }, (sender, args) => {
                        reject('Error processing folder: ' + args.get_message());
                    });
                });
                uploadPromises.push(folderPromise);
            }
        }

        Promise.all(uploadPromises)
            .then(() => {
                alert('All files and folders have been uploaded successfully!');
                setUploading(false);
            })
            .catch(error => {
                console.error(error);
                alert('There was an error during the upload. Check the console for more details.');
                setUploading(false);
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
