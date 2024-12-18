let audio;

// Function to play audio from the music popup
function playAudioFromPopup(audioUrl) {
    chrome.tabs.create({ url: chrome.runtime.getURL('music-popup.html') }, (tab) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (url) => {
                window.audio = new Audio(url);
                window.audio.loop = true;
                window.audio.play();
            },
            args: [audioUrl]
        });
    });
}

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'playAudio') {
        playAudioFromPopup(request.audioUrl);
    } else if (request.action === 'stopAudio') {
        if (audio) {
            audio.pause();
        }
    }
});
