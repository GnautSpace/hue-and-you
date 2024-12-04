import { geminiBionic,geminiSummarize } from './Gemini.js';
/*
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setCustomCVDMode') {
    localStorage.setItem('cvdThemes', JSON.stringify(message.themes));
    sendResponse({ status: 'Themes saved' });
  }
  else if (message.action === "convertText") {
    geminiBionic(message.text)
      .then((bionicText) => {
        sendResponse({ convertedText: bionicText });
      })
      .catch((error) => {
        sendResponse({ error: error.message || "Unknown error occurred." });
      });
      return true;
  }
  else if (message.action === "summarizeContent") {
   
    geminiSummarize(message.text)
      .then((summary) => {
        sendResponse({ summary });
      })
      .catch((error) => {
        console.error("Error in summarization:", error);
        sendResponse({ error: error.message });
      });
    return true; 
  }
 
});*/

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

