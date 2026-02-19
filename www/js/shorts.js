// File: www/js/shorts.js

async function renderShorts(container) {
    const header = document.getElementById('app-header');
    if (header) header.style.display = 'none'; // Sembunyikan header agar full layar

    container.innerHTML = `<div class="shorts-container" id="shorts-wrapper"><p style="text-align:center; margin-top:50vh;">Mencari video pendek...</p></div>`;

    try {
        // Ambil film yang sedang trending minggu ini untuk Shorts
        const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
        const data = await res.json();
        const wrapper = document.getElementById('shorts-wrapper');
        wrapper.innerHTML = '';

        for (const m of data.results) {
            const shortItem = document.createElement('div');
            shortItem.className = 'short-video-post';
            
            // Gunakan backdrop sebagai background video sementara (karena TMDB tidak punya video portrait asli)
            const bgImg = m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '';

            shortItem.innerHTML = `
                <div class="shorts-overlay" onclick="openPlayer('${m.title || m.name}', '${m.id}')"></div>
                <img src="${bgImg}" style="width:100%; height:100%; object-fit:cover; opacity:0.6;">
                
                <div class="shorts-info">
                    <h3>@VizoShorts</h3>
                    <p>${m.title || m.name}</p>
                    <button class="play-main-btn" onclick="openPlayer('${m.title || m.name}', '${m.id}')" style="padding: 5px 15px; font-size: 12px;">▶ Putar</button>
                </div>

                <div class="shorts-actions">
                    <div class="action-item"><span>❤️</span><p>1.2k</p></div>
                    <div class="action-item"><span>💬</span><p>450</p></div>
                    <div class="action-item" onclick="openPlayer('${m.title || m.name}', '${m.id}')"><span>▶️</span><p>Play</p></div>
                </div>
            `;
            wrapper.appendChild(shortItem);
        }
    } catch (e) {
        container.innerHTML = "<p>Gagal memuat Shorts.</p>";
    }
}
