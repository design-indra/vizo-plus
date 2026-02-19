// File: www/js/home.js

async function renderHome(container) {
    // Kosongkan input cari setiap balik ke Home
    const sInput = document.getElementById('searchInput');
    if (sInput) sInput.value = "";

    container.innerHTML = `
        <section class="hero" id="hero-section" style="height: 55vh; background: linear-gradient(to top, #050505, transparent), url('https://image.tmdb.org/t/p/original/t6SlsTU7c9zSjM0pQM6908vRdb5.jpg'); background-size: cover; background-position: center; display: flex; align-items: flex-end; padding: 20px;">
            <div class="hero-info">
                <h1 style="font-size: 26px; text-shadow: 2px 2px 4px #000;">Avatar: The Way of Water</h1>
                <button class="play-main-btn" onclick="openPlayer('Avatar: The Way of Water', '76600')" style="margin-top:10px;">▶ Putar Sekarang</button>
            </div>
        </section>

        <div style="padding: 20px 15px 10px 15px;">
            <h3 style="font-size: 18px; font-weight: 700;">Sedang Tren</h3>
        </div>

        <div id="movie-grid" class="movie-grid">
            </div>
    `;

    fetchLatest();
}

async function fetchLatest() {
    const grid = document.getElementById('movie-grid');
    if (!grid) return;

    try {
        const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        const data = await res.json();
        
        grid.innerHTML = data.results.map(m => `
            <div class="card" onclick="openPlayer('${m.title.replace(/'/g, "\\'")}', '${m.id}')">
                <div class="card-img-wrapper">
                    <img src="${IMG_URL + m.poster_path}" loading="lazy">
                </div>
                <div class="card-title">${m.title}</div>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = "<p>Gagal memuat konten.</p>";
    }
}
