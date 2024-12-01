# Grabbit

## Overview

Grabbit is an innovative Chrome extension that enhances your browsing experience by integrating Google Drive results directly into Google searches. By leveraging Google Chrome's built-in AI capabilities, Grabbit fetches and displays relevant Google Drive files alongside web search results, bridging the gap between web search and personal file retrieval.

## Vision

Grabbit aims to seamlessly merge web and personal file searches, transforming your browser into a unified hub for information retrieval. By turning Google Drive into a natural extension of your web searches, Grabbit makes finding personal documents as intuitive as searching the web.

## Purpose

Google Drive search often requires exact file names to locate documents. Grabbit solves this limitation by allowing users to describe their document and receive intelligent file recommendations, ensuring relevant files are always within reach. This reduces the need for switching tabs and improves productivity.

## Features

- **Enhanced Google Drive Search**: Locate files by describing their content, eliminating the need to remember exact names.
- **Google Drive Integration**: Displays Drive files directly alongside web search results.
- **AI-Driven Recommendations**: Uses Chrome’s AI APIs (and Gemini APIs) to surface relevant Drive files based on search context.
- **Real-Time Results**: Updates dynamically with your search for a seamless experience.
- **PDF Support**: Currently supports PDF files with plans to expand to other formats.

## Technology Stack

Grabbit leverages modern web technologies and Google Chrome's AI capabilities:
- **Prompt API**: Context-aware prompts for refining file searches.
- **Gemini API**: Currently used as fallback for Prompt API until Prompt API will work smoothly.
- **Chrome Extension APIs**: Manages authentication, messaging, and DOM updates.
- **OAuth Authentication**: Securely connects with Google Drive for file retrieval.

## Key Benefits

1. **Overcome Limitations**: Search for files without needing exact file names.
2. **Boost Productivity**: Access both web and Drive results in one place.
3. **Privacy First**: All processing happens locally, ensuring data security.
4. **Seamless Experience**: No need to switch tabs—find everything in one view.

## Current Limitations

- **File Type Support**: Only PDF files are supported.
- **Content Search**: Limited to file names; content inside files is not yet scanned.

## Future Plans

- **Expanded File Support**: Include documents, spreadsheets, presentations, and more.
- **Content Scanning**: Enable search within file content for better recommendations.
- **Performance Enhancements**: Shift processing to the cloud for faster, more scalable results.
- **Multi-Service Integration**: Add support for Dropbox, OneDrive, and other cloud platforms.

## Use Cases

- **Students & Researchers**: Locate notes or research papers by describing their content.
- **Professionals**: Retrieve work documents while researching online.
- **Knowledge Workers**: Quickly find relevant files for projects or proposals.

## How It Works

1. Grabbit listens for Google search queries.
2. It retrieves relevant Google Drive files using Google’s AI APIs.
3. Results are dynamically added to the Google search page, integrating public and personal data in one view.

## Contribution

- **Repository**: [https://github.com/GaoFan98/grabbit]
- **License**: This project is licensed under the [MIT License](./LICENSE).
