chrome.runtime.onInstalled.addListener(() => {
    console.log('Grabbit extension installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAuthToken') {
        getAuthToken().then((token) => {
            sendResponse({ token: token });
        });
        return true;
    } else if (request.action === 'removeAuthToken') {
        removeAuthToken().then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            console.error('Error during logout:', error);
            sendResponse({ success: false });
        });
        return true;
    }
});

async function getAuthToken(interactive = true) {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: interactive }, (token) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                resolve(token);
            }
        });
    });
}

async function removeAuthToken() {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (chrome.runtime.lastError || !token) {
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
                                reject(chrome.runtime.lastError);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        reject(new Error('Failed to revoke token'));
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
}
