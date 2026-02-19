// File: www/js/home.js

/**
 * Fungsi untuk merender halaman Home
 * @param {HTMLElement} container - Kontainer utama dari index.html
 */
async function renderHome(container) {
    // 1. Atur Header agar muncul di halaman Home
    const header = document.getElementById('app-header');
    if (header) {
        header.style.display = 'flex';
        header.innerHTML = `
            <div class="header-top">
                <img src="https://i.ibb.co.com/BV5v4L9j/1000196715.jpg" alt="Vizo Logo" class="vizo-logo-small">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="user-avatar" onclick="showPage('profile')">
                        ${auth.currentUser ? auth.currentUser.email[0].toUpperCase() : 'U'}
                    </div>
                    <button class="menu-btn" onclick="toggleSidebar()">☰</button>
                </div>
            </div>
            <nav class="categories">
                <button class="cat-btn active" onclick="fetchLatest()">Terbaru</button>
                <button class="cat-btn" onclick="fetchTrending()">Populer</button>
                <div class="separator"></div>
                <button class="cat-btn" onclick="fetchDrama('ko')">K-Drama</button>
                <button class="cat-btn" onclick="fetchDrama('zh')">C-Drama</button>
            </nav>
        `;
    }

    // 2. Isi Kontainer dengan Hero Section dan Grid Film
    container.innerHTML = `
        <section class="hero" id="hero-section" style="
            height: 60vh; 
            background: linear-gradient(to top, #050505 10%, transparent 50%), url('https://image.tmdb.org/t/p/original/t6SlsTU7c9zSjM0pQM6908vRdb5.jpg'); 
            background-size: cover; 
            background-position: center; 
            display: flex; 
            align-items: flex-end; 
            padding: 20px;">
            <div class="hero-info">
                <h1 style="font-size: 28px; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">Avatar: The Way of Water</h1>
                <p style="font-size: 13px; color: #ccc; margin-bottom: 15px; max-width: 80%;">Jelajahi keindahan Pandora yang luar biasa dalam petualangan epik terbaru.</p>
                <button class="play-main-btn" onclick="alert('Fitur putar akan segera hadir!')">▶ Putar Sekarang</button>
            </div>
        </section>

        <div style="padding: 15px 15px 5px 15px;">
            <h3 style="font-size: 16px; font-weight: 600;">Trending Sekarang</h3>
        </div>

        <div id="movie-grid" class="movie-grid">
            <p style="text-align:center; grid-column: 1/-1; padding: 20px;">Memuat film...</p>
        </div>
    `;

    // 3. Panggil data dari TMDB
    fetchLatest();
}

/**
 * Fungsi untuk mengambil data film terbaru dari API
 */
async function fetchLatest() {
    const grid = document.getElementById('movie-grid');
    if (!grid) return;

    try {
        const response = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
        const data = await response.json();
        
        grid.innerHTML = ''; // Bersihkan loading
        
        data.results.forEach(movie => {
            if (!movie.poster_path) return;

            const card = document.createElement('div');
            card.className = 'card';
            card.onclick = () => alert(`Menampilkan detail: ${movie.title || movie.name}`);
            card.innerHTML = `
                <img src="${IMG_URL + movie.poster_path}" alt="${movie.title || movie.name}">
                <div class="card-title">${movie.title || movie.name}</div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Gagal memuat data. Periksa koneksi internet.</p>';
    }
}

// Fungsi tambahan untuk navigasi kategori (bisa dikembangkan lebih lanjut)
function fetchTrending() { fetchLatest(); }
function fetchDrama(lang) { alert('Kategori drama ' + lang + ' segera hadir!'); }
