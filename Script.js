let darkMode = false;
let soundEnabled = true;
let themeIndex = 0;
let displayName = '';  // User's display name

const themes = [
    'linear-gradient(135deg, blue, purple)',
    'linear-gradient(135deg, red, orange)',
    'linear-gradient(135deg, green, yellow)'
];

let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: '', // You can set a default video ID or leave it empty
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log('Player ready');
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        const currentTitle = player.getVideoData().title;
        document.getElementById('nowPlaying').innerText = `Now playing: ${currentTitle}`;
    }
}

function onPlayerError(event) {
    alert('An error occurred with the YouTube player. Please try again later.');
    console.error('YouTube Player Error:', event);
}

function playMusic() {
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    } else {
        console.error('YouTube player is not ready or playVideo function is not available');
    }
}

function pauseMusic() {
    if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    } else {
        console.error('YouTube player is not ready or pauseVideo function is not available');
    }
}

function setVolume(volume) {
    if (player && typeof player.setVolume === 'function') {
        player.setVolume(volume * 100);
    } else {
        console.error('YouTube player is not ready or setVolume function is not available');
    }
}

function loadGame() {
    const gameURL = document.getElementById('gameSelect').value;
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <iframe id="gameFrame" src="${gameURL}" width="100%" height="100%" frameborder="0" class="game-load-animation"></iframe>
        <button class="fullscreen-button" onclick="toggleFullscreen()">Fullscreen</button>
    `;
}

function toggleFullscreen() {
    const elem = document.getElementById('gameFrame');
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
}

// Event listener for fullscreen change
document.addEventListener('fullscreenchange', onFullscreenChange);

function onFullscreenChange() {
    const pipButton = document.getElementById('pipButton');
    if (document.fullscreenElement) {
        pipButton.style.display = 'block';
        togglePiP();
    } else {
        pipButton.style.display = 'none';
        exitPiP();
    }
}

function togglePiP() {
    const video = player.getIframe();
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(error => {
            console.error('Error exiting PiP:', error);
        });
    } else if (document.pictureInPictureEnabled) {
        video.requestPictureInPicture().catch(error => {
            console.error('Error entering PiP:', error);
        });
    } else {
        alert('Picture-in-Picture is not supported by your browser.');
    }
}

function exitPiP() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(error => {
            console.error('Error exiting PiP:', error);
        });
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.style.background = darkMode ? 'linear-gradient(135deg, #111, #333)' : themes[themeIndex];
    document.body.style.color = darkMode ? '#fff' : '#000';
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    alert(soundEnabled ? 'Sound enabled' : 'Sound disabled');
}

function toggleTheme() {
    themeIndex = (themeIndex + 1) % themes.length;
    document.body.style.background = themes[themeIndex];
}

function toggleChatBox() {
    const chatBox = document.getElementById('chatBox');
    if (!displayName) {
        displayName = prompt('Enter your display name:');
        if (!displayName) {
            alert('Display name is required to use the chat.');
            return;
        }
    }
    chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
}

function sendMessage(event) {
    if (event.key === 'Enter') {
        const message = document.getElementById('chatInput').value;
        if (message) {
            const chatMessages = document.getElementById('chatMessages');
            const newMessage = document.createElement('li');
            newMessage.innerText = `${displayName}: ${message}`;
            chatMessages.appendChild(newMessage);
            document.getElementById('chatInput').value = '';
        }
    }
}

function searchGames() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const gameSelect = document.getElementById('gameSelect');
    for (let i = 0; i < gameSelect.options.length; i++) {
        const option = gameSelect.options[i];
        const text = option.text.toLowerCase();
        option.style.display = text.includes(input) ? '' : 'none';
    }
}

function openMusicModal() {
    document.getElementById('musicModal').style.display = 'block';
}

function closeMusicModal() {
    document.getElementById('musicModal').style.display = 'none';
}

// Close the modal when the user clicks anywhere outside of it
window.onclick = function(event) {
    const modal = document.getElementById('musicModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
