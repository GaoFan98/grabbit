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

    if (window.translation) {
        try {
            const canDetect = await translation.canDetect();
            let detector;
            if (canDetect !== 'no') {
                if (canDetect === 'readily') {
                    detector = await translation.createDetector();
                } else {
                    detector = await translation.createDetector();
                    detector.addEventListener('downloadprogress', (e) => {
                        console.log('Language detector download progress:', e.loaded, '/', e.total);
                    });
                    await detector.ready;
                }
                const results = await detector.detect(searchQuery);
                if (results && results.length > 0) {
                    const detectedLanguage = results[0].detectedLanguage;
                    const confidence = results[0].confidence;
                    console.log('Detected language:', detectedLanguage, 'Confidence:', confidence);
                    if (detectedLanguage !== 'en') {
                        const languagePair = {
                            sourceLanguage: detectedLanguage,
                            targetLanguage: 'en',
                        };
                        const canTranslate = await translation.canTranslate(languagePair);
                        let translator;
                        if (canTranslate !== 'no') {
                            if (canTranslate === 'readily') {
                                translator = await translation.createTranslator(languagePair);
                            } else {
                                translator = await translation.createTranslator(languagePair);
                                translator.addEventListener('downloadprogress', (e) => {
                                    console.log('Translator download progress:', e.loaded, '/', e.total);
                                });
                                await translator.ready;
                            }
                            const translatedQuery = await translator.translate(searchQuery);
                            console.log('Translated query:', translatedQuery);
                            searchQuery = translatedQuery;
                        } else {
                            console.log('Cannot translate from', detectedLanguage, 'to en.');
                        }
                    }
                } else {
                    console.log('No language detection results.');
                }
            } else {
                console.log('Language detection API cannot be used.');
            }
        } catch (error) {
            console.error('Error during language detection or translation:', error);
        }
    } else {
        console.log('Translation API is not available.');
    }

    console.log('Sending search query to background script:', searchQuery);

    chrome.runtime.sendMessage({action: 'searchGoogleDrive', query: searchQuery}, (response) => {
        if (response && response.results) {
            console.log('Received Google Drive results:', response.results);
            insertDriveResults(response.results);
        } else {
            console.error('No results received or error:', response ? response.error : 'Unknown error');
        }
    });
}

async function insertDriveResults(results) {
    const searchResultsContainer = document.getElementById('search') || document.querySelector('.main');
    if (searchResultsContainer && results.length > 0) {
        console.log('Inserting Google Drive results into the Google search results.');

        const existingDriveResultsDiv = document.querySelector('.grabbit-drive-results');
        if (existingDriveResultsDiv) {
            existingDriveResultsDiv.remove();
        }

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
                ${results.map(result => `
                    <div class="drive-result-item" style="margin-bottom: 20px;">
                        <a href="https://drive.google.com/file/d/${result.id}/view" target="_blank" style="color: #1a0dab; font-size: 1.1em; font-weight: bold; text-decoration: none;">
                            ${result.name}
                        </a>
                        <p style="font-size: 0.9em; color: #4d5156;">Modified: ${new Date(result.modifiedTime).toLocaleString()}</p>
                    </div>
                `).join('')}
            </div>
        `;

        searchResultsContainer.prepend(driveResultsDiv);
    } else {
        console.log('No Google search results container found or no Google Drive results to insert.');
    }
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
