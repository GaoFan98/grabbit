// contentScript.js

console.log('Grabbit Content Script loaded successfully.');

async function handleSearch() {
    console.log('Attempting to handle search...');

    const searchInput = document.querySelector('input[name="q"]');
    if (!searchInput) {
        console.log('No search input found.');
        return;
    }

    let searchQuery = searchInput.value.trim();
    if (!searchQuery) {
        console.log('No search query found.');
        return;
    }

    console.log('Sending request to fetch all Google Drive documents.');

    // Fetch all documents from Google Drive
    chrome.runtime.sendMessage({action: 'fetchAllGoogleDriveDocs'}, async (response) => {
        if (chrome.runtime.lastError) {
            console.log('Runtime error:', chrome.runtime.lastError);
            return;
        }
        if (response && response.results) {
            console.log('Received all Google Drive documents:', response.results);

            // Process the documents with Gemini API
            await processWithGeminiAPI(response.results, searchQuery);
        } else {
            console.log('No results received or error:', response ? response.error : 'Unknown error');
        }
    });
}

async function processWithGeminiAPI(results, searchQuery) {
    const searchResultsContainer = document.getElementById('search') || document.querySelector('.main');
    if (searchResultsContainer && results.length > 0) {
        console.log('Processing results with Gemini API.');

        const documentNames = results.map((result) => result.name);
        const MAX_PROMPT_SIZE = 15000;

        const {promptText, includedDocumentNames} = buildLimitedPrompt(documentNames, searchQuery, MAX_PROMPT_SIZE);

        console.log(`Including ${includedDocumentNames.length} documents in the prompt to Gemini API due to payload size limits.`);
        console.log('Prompt for Gemini API:', promptText);

        let sortedResults = [];

        try {

            const apiKey = 'AIzaSyBCIzslerMGE5OGLgrUMVbAr4-RGaiV3U8';
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

            const requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: promptText,
                            },
                        ],
                    },
                ],
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                console.log({'Gemini API Response': data});

                if (data && data.candidates && data.candidates.length > 0) {
                    const aiRes = data.candidates[0].content.parts[0].text;

                    console.log('AI Response:', aiRes);

                    const sortedDocumentNames = aiRes
                        .split('\n')
                        .map((name) => name.replace(/^- /, '').trim())
                        .filter((name) => name);

                    console.log('Parsed Document Names:', sortedDocumentNames);

                    const includedDocumentIds = new Set();

                    sortedDocumentNames.forEach((name) => {
                        const matchingDocs = results.filter(
                            (doc) => doc.name === name && !includedDocumentIds.has(doc.id)
                        );
                        matchingDocs.forEach((doc) => {
                            sortedResults.push(doc);
                            includedDocumentIds.add(doc.id);
                        });
                    });

                    console.log('Sorted Results before fetching details:', sortedResults);

                    // Fetch data about matched documents
                    const sortedDocumentIds = sortedResults.map((result) => result.id);
                    const detailedResults = await fetchDocumentDetails(sortedDocumentIds);

                    displayDriveResults(detailedResults, searchResultsContainer);
                } else {
                    console.log('Invalid response from Gemini API:', data);
                }
            } else {
                const errorData = await response.json();
                console.log('Error from Gemini API:', response.status, response.statusText, errorData);
            }
        } catch (error) {
            console.log('Error during Gemini API processing:', error);
        }
    } else {
        console.log('No Google search results container found or no Google Drive results to insert.');
    }
}


function buildLimitedPrompt(documentNames, searchQuery, maxPromptSize) {
    const promptHeader = `Given the following list of documents:\n`;
    const promptFooter = `\nPlease sort these documents from most to least relevant to the query "${searchQuery}". Only provide the sorted list without any additional explanations. Give only the list of properly sorted documents, nothing additional.`;

    let promptText = promptHeader;
    let includedDocumentNames = [];
    let i = 0;
    while (i < documentNames.length && promptText.length + documentNames[i].length + 3 + promptFooter.length < maxPromptSize) {
        promptText += `- ${documentNames[i]}\n`;
        includedDocumentNames.push(documentNames[i]);
        i++;
    }
    promptText += promptFooter;

    return {promptText, includedDocumentNames};
}

function displayDriveResults(detailedResults, container) {
    const driveResultsDiv = document.createElement('div');
    driveResultsDiv.className = 'grabbit-drive-results';
    driveResultsDiv.style.marginTop = '20px';
    driveResultsDiv.style.padding = '15px';
    driveResultsDiv.style.border = '1px solid #e0e0e0';
    driveResultsDiv.style.borderRadius = '8px';
    driveResultsDiv.style.backgroundColor = '#ffffff';

    driveResultsDiv.innerHTML = `
    <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: bold; color: #1a73e8; font-size: 1.2em;">Google Drive Results</span>
       <img src="${chrome.runtime.getURL('icons/grabbit-icon.png')}" alt="Grabbit" style="height: 20px; width: 20px;" title="Powered by Grabbit">
    </div>
    <div>
        ${detailedResults
        .map(
            (result) => `
            <div class="drive-result-item" style="margin-bottom: 20px;">
                <a href="https://drive.google.com/file/d/${result.id}/view" target="_blank" style="color: #1a0dab; font-size: 1.1em; font-weight: bold; text-decoration: none;">
                    ${result.name}
                </a>
                <p style="font-size: 0.9em; color: #4d5156;">Modified: ${new Date(
                result.modifiedTime
            ).toLocaleString()}</p>
                <p style="font-size: 0.9em; color: #4d5156;">Type: ${result.mimeType}</p>
                ${
                result.description
                    ? `<p style="font-size: 0.9em; color: #4d5156;">Description: ${result.description}</p>`
                    : ''
            }
            </div>
        `
        )
        .join('')}
    </div>
  `;

    container.prepend(driveResultsDiv);
}

async function fetchDocumentDetails(docIds) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({action: 'getDocumentDetails', ids: docIds}, (response) => {
            if (chrome.runtime.lastError) {
                console.log('Runtime error:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
                return;
            }
            if (response && response.results) {
                resolve(response.results);
            } else {
                reject(response ? response.error : 'Unknown error');
            }
        });
    });
}

function listenForURLChanges() {
    let lastUrl = location.href;

    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log('URL changed, handling new search.');
            handleSearch();
        }
    }).observe(document, {subtree: true, childList: true});
}

window.addEventListener('load', () => {
    console.log('Window loaded. Initiating search handling.');
    handleSearch();
});

listenForURLChanges();
