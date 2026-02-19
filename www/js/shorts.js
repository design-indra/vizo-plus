// File: www/js/shorts.js

/**
 * Fungsi untuk merender halaman Shorts (Video Pendek)
 * @param {HTMLElement} container - Kontainer utama dari index.html
 */
async function renderShorts(container) {
    // 1. Sembunyikan header utama agar video memenuhi layar
    const header = document.getElementById('app-header');
    if (header) header.style.display = 'none';

    // 2. Siapkan struktur pembungkus shorts
    container.innerHTML = `
        <div class="shorts-container" id="shorts-wrapper">
            <p style="text-align:center; padding-top: 50vh;">Memuat video pendek...</p>
        </div>
    `;

    try {
        // 3. Ambil data trending dari TMDB untuk dijadikan konten video
        const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
        const data = await res.json();
        const wrapper = document.getElementById('shorts-wrapper');
        
        wrapper.innerHTML = ''; // Bersihkan loading

        // 4. Render setiap item video
        data.results.forEach(m => {
            const shortItem = document.createElement('div');
            shortItem.className = 'short-video-post';
            
            shortItem.innerHTML = `
                <div class="shorts-overlay"></div>
                
                <video loop muted autoplay playsinline class="vizo-short-player">
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                </video>

                <div class="shorts-info">
                    <h3 style="margin-bottom: 5px;">@VizoPlus_Original</h3>
                    <p style="font-size: 14px; line-height: 1.4; margin-bottom: 8px;">${m.title || m.name}</p>
                    <span class="music-tag">🎵 Suara Asli - Vizo Music Premium</span>
                </div>

                <div class="shorts-actions">
                    <div class="action-item" onclick="this.style.color='#e50914'">
                        <span style="font-size: 28px;">❤️</span>
                        <p>1.2k</p>
                    </div>
                    <div class="action-item">
                        <span style="font-size: 28px;">💬</span>
                        <p>450</p>
                    </div>
                    <div class="action-item">
                        <span style="font-size: 28px;">🚀</span>
                        <p>Share</p>
                    </div>
                    <div class="action-item">
                        <span style="font-size: 28px;">🔖</span>
                        <p>Simpan</p>
                    </div>
                </div>
            `;
            
            wrapper.appendChild(shortItem);
        });

        // Tambahkan fungsi klik untuk play/pause video
        setupShortsInteraction();

    } catch (error) {
        console.error("Gagal memuat shorts:", error);
        container.innerHTML = `<p style="text-align:center; padding-top: 50vh;">Gagal memuat video.</p>`;
    }
}

/**
 * Mengatur interaksi klik pada video untuk Play/Pause
 */
function setupShortsInteraction() {
    const videos = document.querySelectorAll('.vizo-short-player');
    videos.forEach(v => {
        v.addEventListener('click', () => {
            if (v.paused) {
                v.play();
            } else {
                v.pause();
            }
        });
    });
}
