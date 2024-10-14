# Grabbit

## Overview

Grabbit is a groundbreaking Chrome extension designed to enhance your browsing experience by integrating Google Drive results directly into your Google searches. Leveraging Google Chrome's built-in AI capabilities, Grabbit intelligently fetches and inserts relevant Google Drive files into your search result page, effectively bridging the gap between web search and personal file retrieval.

### Vision

Grabbit aims to revolutionize how users interact with personal and web information by blending the two seamlessly. Imagine a future where searching the web also means instant access to your own personal knowledge base, including your documents, spreadsheets, presentations, and more—all presented contextually alongside your search engine results. Grabbit takes the first step towards making this vision a reality by turning your Google Drive into a natural extension of your Google searches.

### Purpose

In today's world, information is scattered across multiple platforms. Finding that one important document you've saved in Google Drive while also looking for related information on the web can be cumbersome. Grabbit solves this problem by bringing your Google Drive results directly into the Google Search page, ensuring all your information is at your fingertips. This approach not only improves productivity but also makes the process of finding, using, and connecting information more intuitive.

### Features

- **Seamless Google Drive Integration**: Grabbit integrates directly with Google Search, displaying your Google Drive files that are contextually relevant to your search queries.
- **Real-Time Results Display**: Uses Chrome's built-in AI capabilities to dynamically present Google Drive content alongside web results.
- **AI-Enhanced File Retrieval**: Leveraging Google Chrome's AI APIs, including the Summarization and Prompt APIs, Grabbit intelligently surfaces relevant files based on the context of the user query.
- **Single Point of Access**: Removes the need to switch back and forth between Google Search and Google Drive, enabling a more holistic and efficient search experience.

### Technology Stack & AI Integration

Grabbit takes full advantage of Google Chrome's built-in AI APIs and the Gemini Nano model, which provide the backbone for the enhanced AI functionalities. The extension uses the following technologies and APIs:

- **Prompt API**: Enables dynamic, context-driven prompts, allowing users to interact with and refine Google Drive search results directly within the browser.
- **Summarization API**: Summarizes document content to provide a preview of Google Drive files, ensuring users can quickly identify relevant results.
- **Rewrite API**: Provides suggestions to refine the search queries, improving the accuracy and relevance of Google Drive file retrieval.
- **Chrome Extension APIs**: Manages OAuth authentication, message passing, and DOM manipulation to seamlessly append Google Drive results to the web search page.

### Key Benefits

1. **Productivity Boost**: Save time by eliminating the need to manually open Google Drive and search for files. Everything you need is shown at a glance within Google Search.
2. **Real-World Application**: Grabbit directly solves the practical problem of searching for web information and personal documents in separate workflows. With Grabbit, the two are unified.
3. **Privacy & Local AI Processing**: All AI tasks are executed locally on the user's device without any server calls, preserving user privacy while ensuring fast and efficient results.
4. **Scalable Design**: Grabbit can easily scale to serve different types of audiences, from students needing quick access to research notes to professionals pulling up work documents.

### How It Works

Grabbit uses a content script that listens for Google search events. When the user submits a query, the extension communicates with the background script, which retrieves relevant Google Drive files using Google Chrome's AI APIs. The search results are then seamlessly appended to the existing Google search results, allowing users to see both public web information and personal data in a single, integrated view.

### Use Cases

- **Students & Researchers**: Find both online resources and your own notes or presentations related to a specific topic without switching tabs.
- **Professionals**: Quickly pull up relevant work documents while researching information online, increasing efficiency and reducing context-switching.
- **Knowledge Workers**: Retrieve old proposals or documentation when searching for best practices or general guidelines on the web.

### Future Roadmap

- **AI-Driven Insights**: Adding summarization and keyword extraction from Drive documents for faster overview during searches.
- **Voice Search Integration**: Enable voice commands to search Google Drive content through Chrome's Voice API, adding another layer of convenience.
- **Multi-Cloud Integration**: Expand the integration beyond Google Drive to other cloud storage services like OneDrive or Dropbox, giving users even greater access to their information.
- **Mobile Version**: Develop a mobile Chrome extension or a companion app to offer the same seamless experience across devices.

### Project Structure & Components

- **Background Script**: Handles Google Drive authentication, API calls, and communicates with content scripts.
- **Content Script**: Manipulates the DOM of the Google Search page, inserting Google Drive results into the search results.
- **OAuth Authentication**: Uses Chrome's identity API to securely authenticate users with Google Drive.
- **Chrome AI APIs Integration**: Leverages Gemini Nano for AI capabilities, providing intelligent summarization and prompts for better search experiences.

### Contribution & Open Source

Grabbit is an open source project aiming to create a more productive and efficient browsing experience. Contributions are welcome from developers, designers, and enthusiasts who share our vision of making personal and public information seamlessly accessible.

- **Repository**: [GitHub Link] (Add actual link here)
- **License**: MIT License - We encourage the community to contribute, use, and adapt the project as needed.

### Feedback & Community

We believe in building with the community, and your feedback is crucial to help us improve Grabbit. As part of our submission for the Google Chrome Built-in AI Challenge, we invite you to share your experiences, suggestions, and feature requests to make Grabbit even more useful.

### Conclusion

Grabbit represents an exciting intersection between AI, productivity, and browser technology. By merging the worlds of web search and personal data retrieval, we hope to redefine how users interact with information online. This project is just the beginning of what we envision as a fully integrated, intelligent browsing experience—an experience that saves time, minimizes effort, and brings all the information you need into one seamless interface.

Join us on this journey as we continue to innovate and push the boundaries of what Chrome extensions can achieve.