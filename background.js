chrome.runtime.onInstalled.addListener(() => {
    console.log('Grabbit extension installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAuthToken') {
        getAuthToken().then((token) => {
            sendResponse({token: token});
        });
        return true;
    }
});

async function getAuthToken(interactive = true) {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({interactive: interactive}, (token) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                resolve(token);
            }
        });
    });
}
