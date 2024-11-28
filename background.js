chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setCustomCVDMode') {
    localStorage.setItem('cvdThemes', JSON.stringify(message.themes));
    sendResponse({ status: 'Themes saved' });
  }
});
