chrome.runtime.onInstalled.addListener(() => {
    console.log('Grabbit extension installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAuthToken') {
        getAuthToken()
            .then((token) => {
                sendResponse({ token: token });
            })
            .catch((error) => {
                console.error('Error getting auth token:', error);
                sendResponse({ token: null, error: error.message });
            });
        return true;
    } else if (request.action === 'removeAuthToken') {
        removeAuthToken()
            .then(() => {
                sendResponse({ success: true });
            })
            .catch((error) => {
                console.error('Error during logout:', error);
                sendResponse({ success: false });
            });
        return true;
    } else if (request.action === 'searchGoogleDrive') {
        getAuthToken(false)
            .then((token) => {
                if (token) {
                    return searchDriveFiles(token, request.query);
                } else {
                    throw new Error('Unable to authenticate');
                }
            })
            .then((results) => {
                sendResponse({ results: results });
            })
            .catch((error) => {
                console.error('Error during Google Drive search:', error);
                sendResponse({ results: [], error: error.message });
            });
        return true;
    }
});

function getAuthToken(interactive = true) {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: interactive }, (token) => {
            if (chrome.runtime.lastError) {
                console.error('Error getting auth token:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                console.log('Auth token received successfully');
                resolve(token);
            }
        });
    });
}

function removeAuthToken() {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (chrome.runtime.lastError || !token) {
                console.error('Error getting auth token for revocation:', chrome.runtime.lastError || 'No token available');
                reject(chrome.runtime.lastError || 'No token available');
                return;
            }

            fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => {
                    if (response.ok) {
                        chrome.identity.removeCachedAuthToken({ token }, () => {
                            if (chrome.runtime.lastError) {
                                console.error('Error removing cached auth token:', chrome.runtime.lastError);
                                reject(chrome.runtime.lastError);
                            } else {
                                console.log('Auth token revoked and removed from cache successfully');
                                resolve();
                            }
                        });
                    } else {
                        console.error('Failed to revoke token:', response.statusText);
                        reject(new Error('Failed to revoke token'));
                    }
                })
                .catch((error) => {
                    console.error('Error during token revocation:', error);
                    reject(error);
                });
        });
    });
}

function searchDriveFiles(token, query) {
    return new Promise((resolve, reject) => {
        const url = `https://www.googleapis.com/drive/v3/files?q=name contains '${query}'&fields=files(id, name, mimeType, modifiedTime)&pageSize=5`;

        fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) {
                    console.error('Failed to search Google Drive files:', response.statusText);
                    throw new Error('Failed to search Google Drive files');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Google Drive search results received successfully');
                resolve(data.files);
            })
            .catch((error) => {
                console.error('Error during Google Drive search:', error);
                reject(error);
            });
    });
}
