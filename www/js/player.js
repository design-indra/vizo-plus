// File: www/js/player.js

/**
 * Fungsi utama untuk memutar film atau trailer
 * @param {string} title - Judul Film
 * @param {string} id - ID Film dari TMDB
 */
async function openPlayer(title, id) {
    // 1. Ambil data video dari TMDB
    const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    
    // Cari trailer di YouTube, jika tidak ada pakai video default
    const video = data.results.find(v => v.site === 'YouTube') || data.results[0];
    const videoKey = video ? video.key : 'dQw4w9WgXcQ'; // Fallback link

    // 2. Buat Elemen Player Fullscreen
    const playerDiv = document.createElement('div');
    playerDiv.id = 'vizo-player';
    playerDiv.style = `
        position: fixed; inset: 0; background: #000; z-index: 10000;
        display: flex; flex-direction: column; animation: slideUp 0.3s ease;
    `;

    playerDiv.innerHTML = `
        <div style="padding: 20px; display: flex; align-items: center; background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); position: absolute; width: 100%; z-index: 10;">
            <button onclick="closePlayer()" style="background: none; border: none; color: white; font-size: 30px; margin-right: 15px;">✕</button>
            <h3 style="font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title}</h3>
        </div>
        
        <iframe src="https://www.youtube.com/embed/${videoKey}?autoplay=1&modestbranding=1&rel=0" 
                style="width: 100%; height: 100%; border: none;" 
                allow="autoplay; fullscreen">
        </iframe>
    `;

    document.body.appendChild(playerDiv);
}

function closePlayer() {
    const player = document.getElementById('vizo-player');
    if (player) player.remove();
}
