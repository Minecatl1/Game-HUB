let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
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
    alert(`An error occurred with the YouTube player: ${event.data}`);
    console.error('YouTube Player Error:', event);
}

async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    console.log(`Searching for: ${query}`);
    if (query.length < 3) return;  // Wait until the user has typed at least 3 characters

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=AIzaSyANMFVhZDBTigvMRtXTgqQf4hPJU47LrqM`);
        if (!response.ok) {
            throw new Error(`Error fetching search results: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Search results:', data);
        displayResults(data.items);
    } catch (error) {
        alert(`Error fetching search results: ${error.message}`);
        console.error('Error fetching search results:', error);
    }
}

function displayResults(tracks) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Search Results</h2>';
    tracks.forEach(track => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track';
        trackDiv.innerHTML = `
            <img src="${track.snippet.thumbnails.default.url}" alt="${track.snippet.title}">
            <div class="track-info">
                <h3>${track.snippet.title}</h3>
                <p>${track.snippet.channelTitle}</p>
            </div>
            <button onclick="playTrack('${track.id.videoId}')">Play</button>
        `;
        resultsDiv.appendChild(trackDiv);
    });
}

async function getRecommendations() {
    console.log('Fetching recommendations');
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&videoCategoryId=10&maxResults=10&key=AIzaSyANMFVhZDBTigvMRtXTgqQf4hPJU47LrqM`);
        if (!response.ok) {
            throw new Error(`Error fetching recommendations: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Recommendations:', data);
        displayRecommendations(data.items);
    } catch (error) {
        alert(`Error fetching recommendations: ${error.message}`);
        console.error('Error fetching recommendations:', error);
    }
}

function displayRecommendations(tracks) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '<h2>Recommended Tracks</h2>';
    tracks.forEach(track => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track';
        trackDiv.innerHTML = `
            <img src="${track.snippet.thumbnails.default.url}" alt="${track.snippet.title}">
            <div class="track-info">
                <h3>${track.snippet.title}</h3>
                <p>${track.snippet.channelTitle}</p>
            </div>
            <button onclick="playTrack('${track.id}')">Play</button>
        `;
        recommendationsDiv.appendChild(trackDiv);
    });
}

function playTrack(videoId) {
    console.log(`Playing track: ${videoId}`);
    player.loadVideoById(videoId);
    player.playVideo();
}

async function togglePiP() {
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
            const video = player.getIframe();
            await video.requestPictureInPicture();
        } else {
            alert('Picture-in-Picture is not supported by your browser.');
        }
    } catch (error) {
        alert(`Error in Picture-in-Picture: ${error.message}`);
        console.error('Error in Picture-in-Picture:', error);
    }
}
