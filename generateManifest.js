require('dotenv').config();
const fs = require('fs');

const manifest = {
    "manifest_version": 3,
    "name": "Grabbit",
    "description": "Quickly find your Google Drive files using natural language descriptions.",
    "version": "1.0.0",
    "icons": {
        "128": "icons/icon128.png"
    },
    "permissions": [
        "identity",
        "storage",
        "activeTab",
        "scripting",
        "https://www.googleapis.com/"
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
    }
};

// Write manifest to file
fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
console.log('manifest.json generated successfully.');
