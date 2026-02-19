// File: www/js/shorts.js

let ytPlayers = {}; // Menyimpan instance player YouTube

async function renderShorts(container) {
    const header = document.getElementById('app-header');
    if (header) header.style.display = 'none';

    container.innerHTML = `<div class="shorts-container" id="shorts-wrapper"></div>`;
    const wrapper = document.getElementById('shorts-wrapper');

    try {
        const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
        const data = await res.json();
        
        wrapper.innerHTML = '';

        data.results.forEach((m, index) => {
            const shortItem = document.createElement('div');
            shortItem.className = 'short-video-post';
            shortItem.setAttribute('data-index', index);
            
            // Buat ID unik untuk container player YouTube
            const playerId = `player-${index}`;

            shortItem.innerHTML = `
                <div class="shorts-overlay" onclick="toggleMute('${playerId}')"></div>
                
                <div id="${playerId}" class="yt-placeholder"></div>

                <div class="shorts-info">
                    <h3>@VizoShorts</h3>
                    <p>${m.title || m.name}</p>
                </div>

                <div class="shorts-actions">
                    <div class="action-item"><span>❤️</span><p>1.2k</p></div>
                    <div class="action-item" onclick="openPlayer('${m.title || m.name}', '${m.id}')"><span>🖼️</span><p>Full</p></div>
                </div>
            `;
            wrapper.appendChild(shortItem);

            // Ambil ID Video dan inisialisasi player
            fetchVideoAndInitPlayer(m.id, playerId);
        });

        // Inisialisasi Deteksi Scroll (Intersection Observer)
        initScrollObserver();

    } catch (e) {
        console.error(e);
        container.innerHTML = "<p>Gagal memuat Shorts.</p>";
    }
}

async function fetchVideoAndInitPlayer(movieId, playerId) {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    const video = data.results.find(v => v.site === 'YouTube') || data.results[0];
    const videoKey = video ? video.key : 'dQw4w9WgXcQ';

    // Inisialisasi YouTube Player API
    ytPlayers[playerId] = new YT.Player(playerId, {
        height: '100%',
        width: '100%',
        videoId: videoKey,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': videoKey,
            'modestbranding': 1,
            'iv_load_policy': 3,
            'showinfo': 0
        },
        events: {
            'onReady': (event) => {
                event.target.mute(); // Harus mute agar bisa autoplay
            }
        }
    });
}

function initScrollObserver() {
    const observerOptions = {
        root: document.getElementById('shorts-wrapper'),
        threshold: 0.8 // Video harus terlihat 80% baru putar
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const playerId = `player-${entry.target.getAttribute('data-index')}`;
            const player = ytPlayers[playerId];

            if (entry.isIntersecting) {
                if (player && player.playVideo) player.playVideo();
            } else {
                if (player && player.pauseVideo) player.pauseVideo();
            }
        });
    }, observerOptions);

    document.querySelectorAll('.short-video-post').forEach(post => observer.observe(post));
}

// Fitur klik layar untuk aktifkan suara
function toggleMute(playerId) {
    const player = ytPlayers[playerId];
    if (player) {
        if (player.isMuted()) {
            player.unMute();
            alert("Suara Aktif");
        } else {
            player.mute();
        }
    }
}
