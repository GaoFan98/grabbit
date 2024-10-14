# Grabbit

## Description

Grabbit is a Chrome extension that allows users to quickly find their Google Drive files using natural language descriptions. It symbolizes a rabbit swiftly grabbing the files you need, enhancing your productivity.

## Features

- Authenticate with Google Drive.
- Fetch and store file names and metadata.
- Use AI to match user descriptions to files (mocked for now).
- Display matching files and open them in Google Drive.

## Setup Instructions

### Prerequisites

- Google Chrome browser
- Node.js and npm (optional, for dependency management)

### Steps

1. **Obtain a Google API Client ID**

    - Go to the [Google Cloud Console](https://console.developers.google.com/).
    - Create a new project or select an existing one.
    - Navigate to **APIs & Services** > **Credentials**.
    - Click **Create Credentials** > **OAuth client ID**.
    - Select **Chrome App**.
    - Enter your extension's ID or "*".
    - Copy the **Client ID**.

2. **Update `manifest.json`**

    - Replace `<YOUR_GOOGLE_CLIENT_ID>` with your actual client ID.

3. **Load the Extension into Chrome**

    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable **Developer mode** (toggle in the top right).
    - Click **Load unpacked** and select the `grabbit-extension` directory.

4. **Test the Extension**

    - Click the Grabbit icon in the toolbar.
    - Follow the prompts to authenticate with Google Drive.
    - Enter a description and perform a search.

## Future Work

- Replace mock AI functions with actual API calls when available.
- Enhance the AI matching logic for better accuracy.
- Add support for additional features as needed.

## License

This project is licensed under the MIT License.
