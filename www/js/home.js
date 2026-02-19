// File: www/js/home.js

/**
 * Fungsi untuk merender halaman Home
 * @param {HTMLElement} container - Kontainer utama dari index.html
 */
async function renderHome(container) {
    // 1. Atur Header (Logo & Tombol Menu)
    
// Di dalam file js/main.js atau js/home.js saat render header, pastikan strukturnya seperti ini:

header.innerHTML = `
    <div class="header-content" style="display:flex; width:100%; align-items:center; gap:10px;">
        <img src="https://i.ibb.co.com/BV5v4L9j/1000196715.jpg" class="vizo-logo-small">
        <div class="search-box" style="flex:1; position:relative;">
            <input type="text" id="searchInput" placeholder="Cari film..." 
                style="width:100%; background:#222; border:none; padding:8px 15px; border-radius:20px; color:white; font-size:13px; outline:none;"
                onkeyup="searchMovies(this.value)">
        </div>
        <button class="menu-btn" onclick="toggleSidebar()">☰</button>
    </div>
`;

    // 2. Isi Kontainer dengan Hero Section (Banner) dan Grid Film
    // ID 76600 adalah Avatar: The Way of Water untuk tombol Putar di Banner
    container.innerHTML = `
        <section class="hero" id="hero-section" style="
            height: 60vh; 
            background: linear-gradient(to top, #050505 10%, transparent 50%), url('https://image.tmdb.org/t/p/original/t6SlsTU7c9zSjM0pQM6908vRdb5.jpg'); 
            background-size: cover; 
            background-position: center; 
            display: flex; 
            align-items: flex-end; 
            padding: 20px;
            border-radius: 0 0 20px 20px;
            margin-bottom: 20px;">
            <div class="hero-info">
                <h1 style="font-size: 28px; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">Avatar: The Way of Water</h1>
                <p style="font-size: 13px; color: #ccc; margin-bottom: 15px; max-width: 80%;">Jelajahi keindahan Pandora yang luar biasa dalam petualangan epik terbaru.</p>
                <button class="play-main-btn" onclick="openPlayer('Avatar: The Way of Water', '76600')">▶ Putar Sekarang</button>
            </div>
        </section>

        <div style="padding: 0 15px 10px 15px; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 18px; font-weight: 700; color: #fff;">Sedang Tren</h3>
            <span style="font-size: 12px; color: #e50914;">Lihat Semua</span>
        </div>

        <div id="movie-grid" class="movie-grid">
            <p style="text-align:center; grid-column: 1/-1; padding: 50px; color: #888;">Mencari film terbaik untukmu...</p>
        </div>
    `;

    // 3. Panggil data film dari API TMDB
    fetchLatest();
}

/**
 * Fungsi untuk mengambil data film tren dan mengatur fitur klik putar
 */
async function fetchLatest() {
    const grid = document.getElementById('movie-grid');
    if (!grid) return;

    try {
        // Ambil data trending hari ini
        const response = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
        const data = await response.json();
        
        grid.innerHTML = ''; // Hapus pesan loading
        
        data.results.forEach(movie => {
            if (!movie.poster_path) return;

            const title = movie.title || movie.name;
            const movieLink = IMG_URL + movie.poster_path;

            // Membuat elemen Card Film
            const card = document.createElement('div');
            card.className = 'card';
            
            // FITUR KLIK: Memanggil fungsi openPlayer dari player.js
            card.onclick = () => {
                if (typeof openPlayer === "function") {
                    openPlayer(title, movie.id);
                } else {
                    console.error("Fungsi openPlayer tidak ditemukan! Pastikan player.js sudah dimuat.");
                }
            };

            card.innerHTML = `
                <div class="card-img-wrapper" style="position: relative;">
                    <img src="${movieLink}" alt="${title}" style="width: 100%; border-radius: 12px; display: block;">
                    <div class="play-overlay" style="position: absolute; inset: 0; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; border-radius: 12px;">
                        <span style="font-size: 40px; color: white;">▶</span>
                    </div>
                </div>
                <div class="card-title" style="margin-top: 8px; font-size: 12px; font-weight: 500; color: #eee; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${title}
                </div>
            `;
            
            // Efek Hover sederhana untuk Mobile
            card.addEventListener('touchstart', () => {
                card.querySelector('.play-overlay').style.opacity = '1';
            });
            card.addEventListener('touchend', () => {
                card.querySelector('.play-overlay').style.opacity = '0';
            });

            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Gagal mengambil data TMDB:", error);
        grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: #888;">Gagal memuat film. Periksa koneksi internet.</p>';
    }
}
