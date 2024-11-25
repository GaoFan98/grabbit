// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log('Grabbit extension installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background script received message:', request);
    if (request.action === 'fetchAllGoogleDriveDocs') {
        fetchAllGoogleDriveDocs()
            .then((results) => {
                console.log('Fetched all documents:', results);
                sendResponse({ results });
            })
            .catch((error) => {
                console.log('Error fetching all documents:', error);
                sendResponse({ error: error.message });
            });
        return true;
    } else if (request.action === 'getDocumentDetails') {
        getDocumentDetails(request.ids)
            .then((results) => {
                console.log('Fetched document details:', results);
                sendResponse({ results });
            })
            .catch((error) => {
                console.log('Error fetching document details:', error);
                sendResponse({ error: error.message });
            });
        return true;
    }
});

function getAuthToken(interactive = true) {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: interactive }, (token) => {
            if (chrome.runtime.lastError) {
                console.log('Error getting auth token:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                console.log('Auth token received successfully');
                resolve(token);
            }
        });
    });
}

async function fetchAllGoogleDriveDocs() {
    console.log('Starting fetchAllGoogleDriveDocs...');
    try {
        const token = await getAuthToken();

        const files = [];
        let pageToken = null;

        // Define the query for PDF and DOC files
        const mimeTypes = [
            "'application/pdf'",
            "'application/vnd.google-apps.document'",
            "'application/vnd.openxmlformats-officedocument.wordprocessingml.document'",
            "'application/msword'"
        ];
        const mimeTypeQuery = mimeTypes.map(type => `mimeType=${type}`).join(' or ');
        const query = `(${mimeTypeQuery})`;

        do {
            let url = `https://www.googleapis.com/drive/v3/files`;
            const params = new URLSearchParams();
            params.append('pageSize', '1000');
            params.append('fields', 'nextPageToken,files(id,name,modifiedTime,mimeType)');
            params.append('q', query);
            if (pageToken) {
                params.append('pageToken', pageToken);
            }
            url += `?${params.toString()}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching files: ${response.statusText}`);
            }

            const data = await response.json();
            files.push(...data.files);
            pageToken = data.nextPageToken;
        } while (pageToken);

        console.log('Total files fetched:', files.length);
        return files;
    } catch (error) {
        console.log('Error in fetchAllGoogleDriveDocs:', error);
        throw error;
    }
}

async function getDocumentDetails(docIds) {
    console.log('Starting getDocumentDetails for IDs:', docIds);
    try {
        const token = await getAuthToken();

        const promises = docIds.map((id) => {
            const url = `https://www.googleapis.com/drive/v3/files/${id}?fields=id,name,modifiedTime,mimeType,description`;

            return fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching file ${id}: ${response.statusText}`);
                }
                return response.json();
            });
        });

        const results = await Promise.all(promises);
        console.log('Document details fetched:', results);
        return results;
    } catch (error) {
        console.log('Error in getDocumentDetails:', error);
        throw error;
    }
}
