require('dotenv').config();
const fs = require('fs');

const manifest = {
    "manifest_version": 3,
    "name": "Grabbit",
    "description": "Enhance your Google searches with Google Drive results.",
    "version": "1.0.5",
    "icons": {
        "128": "icons/icon128.png"
    },
    "permissions": [
        "identity",
        "storage",
        "activeTab",
        "scripting",
        "https://www.googleapis.com/",
        "https://www.google.com/*"
    ],
    "oauth2": {
        "client_id": process.env.GOOGLE_CLIENT_ID,
        "scopes": [
            "https://www.googleapis.com/auth/drive.metadata.readonly"
        ]
    },
    "background": {
        "service_worker": "background.js"
    },
    "action": {
        "default_popup": "popup.html",
        "default_title": "Grabbit",
        "default_icon": {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
        }
    },
    "content_scripts": [
        {
            "matches": ["https://www.google.com/search*"],
            "js": ["contentScript.js"],
            "run_at": "document_end"
        }
    ],
    "web_accessible_resources": [
        {
            "resources": ["icons/grabbit-icon.png"],
            "matches": ["<all_urls>"]
        }
    ]
};

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
console.log('manifest.json generated successfully.');