document.addEventListener('DOMContentLoaded', async () => {
    // Attempt to get auth token immediately when the popup opens
    try {
        const token = await getAuthToken();
        if (token) {
            document.getElementById('loginStatus').textContent = "Logged in to Google Drive";
        }
    } catch (error) {
        console.error('Authentication error:', error);
    }

    // Search button click event
    document.getElementById('searchButton').addEventListener('click', handleSearch);
});

async function handleSearch() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (!searchInput) {
        alert('Please enter a description.');
        return;
    }

    // Try getting an OAuth token if needed
    try {
        const token = await getAuthToken();

        if (token) {
            const searchResults = await searchDriveFiles(token, searchInput);
            displayResults(searchResults);
        }
    } catch (error) {
        console.error('Authentication error:', error);
        alert('Unable to authenticate with Google. Please try again.');
    }
}

// Function to get auth token
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

// Function to search Google Drive files based on the query
async function searchDriveFiles(token, query) {
    const url = `https://www.googleapis.com/drive/v3/files?q=name contains '${query}'&fields=files(id, name, mimeType, modifiedTime)&pageSize=10`;

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to search Google Drive files');
    }

    const data = await response.json();
    return data.files;
}

// Function to display search results
function displayResults(files) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!files.length) {
        resultsDiv.innerHTML = '<p>No matching files found.</p>';
        return;
    }

    files.forEach((file) => {
        const item = document.createElement('div');
        item.className = 'result-item';

        const title = document.createElement('h3');
        title.textContent = file.name;

        const details = document.createElement('p');
        details.textContent = `Modified: ${new Date(file.modifiedTime).toLocaleString()}`;

        const link = document.createElement('a');
        link.href = `https://drive.google.com/file/d/${file.id}/view`;
        link.target = '_blank';
        link.textContent = 'Open in Drive';

        item.appendChild(title);
        item.appendChild(details);
        item.appendChild(link);

        resultsDiv.appendChild(item);
    });
}
