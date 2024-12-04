import { geminiBionic,geminiSummarize } from './Gemini.js';


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'setCustomCVDMode':
      localStorage.setItem('cvdThemes', JSON.stringify(message.themes));
      sendResponse({ status: 'Themes saved' });
      break;
    case 'convertText':
      geminiBionic(message.text)
        .then((bionicText) => sendResponse({ convertedText: bionicText }))
        .catch((error) => sendResponse({ error: error.message || "Unknown error occurred." }));
      break;
    case 'summarizeContent':
      geminiSummarize(message.text)
        .then((summary) => sendResponse({ summary }))
        .catch((error) => sendResponse({ error: error.message || "Unknown error occurred." }));
      break;
    default:
      sendResponse({ error: "Unknown action." });
  }
  return true;
});

