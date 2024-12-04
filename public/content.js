chrome.runtime.onMessage.addListener

((message,sender,sendResponse) => {
    if (message.action === 'applyCVDTheme') {
        const themes = JSON.parse(localStorage.getItem

('cvdThemes'));
        const mode = message.mode;

        if (themes && themes[mode]) {
            const theme = themes[mode];
            document.body.style.backgroundColor = theme.bg;
            document.body.style.color = theme.text;
        }
    }
    else if (message.action === 'getPageContent') {
        const textContent = document.body.innerText || ""; 
        sendResponse({ text: textContent });
      }
});


