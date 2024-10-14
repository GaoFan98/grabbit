async function getAIResponseFromMock(prompt) {
    await delay(500);

    const fileNumbers = extractFileNumbers(prompt);
    return fileNumbers.map((num) => ({
        fileName: `Mock File ${num}.docx`,
        relevance: Math.random(),
    }));
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractFileNumbers(prompt) {
    return [1, 2, 3];
}
