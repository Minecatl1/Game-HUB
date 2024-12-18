document.getElementById('openGameHub').addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://gamehubz.w3spaces.com' });
});

document.getElementById('playAudio').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: 'playAudio', audioUrl: 'https://example.com/path/to/audio.mp3' });
});

document.getElementById('stopAudio').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: 'stopAudio' });
});
