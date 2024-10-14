document.addEventListener('DOMContentLoaded', async () => {
    showLoginContainer();

    try {
        const token = await getAuthToken(false);
        if (token) {
            showLogoutContainer();
        }
    } catch (error) {
        console.error('Authentication error:', error);
    }

    document.getElementById('loginButton').addEventListener('click', handleLogin);
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
});

async function handleLogin() {
    try {
        const token = await getAuthToken(true);
        if (token) {
            showLogoutContainer();
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Unable to authenticate with Google. Please try again.');
    }
}

function handleLogout() {
    chrome.runtime.sendMessage({ action: 'removeAuthToken' }, (response) => {
        if (response.success) {
            showLoginContainer();
        } else {
            alert('Failed to logout. Please try again.');
        }
    });
}

function getAuthToken(interactive = true) {
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

function showLoginContainer() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('logoutContainer').style.display = 'none';
}

function showLogoutContainer() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('logoutContainer').style.display = 'block';
}
