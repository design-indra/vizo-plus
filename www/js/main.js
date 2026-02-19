// File: www/js/main.js

/**
 * Event listener saat halaman dimuat sepenuhnya.
 * Mengatur transisi splash screen dan cek status autentikasi.
 */
window.addEventListener('load', () => {
    // Inisialisasi Sidebar agar siap digunakan
    if (typeof renderSidebar === "function") {
        renderSidebar();
    }

    // Monitor Status Login dari Firebase
    auth.onAuthStateChanged(user => {
        const splash = document.getElementById('splash-screen');
        const login = document.getElementById('loginOverlay');
        const main = document.getElementById('main-content');

        // Memberikan waktu 2-3 detik agar splash screen terlihat profesional
        setTimeout(() => {
            if (splash) splash.style.display = 'none';

            if (user) {
                // Jika user sudah login
                if (login) login.style.display = 'none';
                if (main) main.style.display = 'block';
                
                // Menampilkan navigasi bawah dan memuat halaman beranda
                renderBottomNav();
                showPage('home'); 
            } else {
                // Jika user belum login
                if (login) login.style.display = 'flex';
                if (main) main.style.display = 'none';
                
                // Memanggil fungsi render form login dari auth.js
                if (typeof renderLogin === "function") {
                    renderLogin();
                }
            }
        }, 2500);
    });
});

/**
 * Merender navigasi bawah (Bottom Navigation) secara dinamis.
 */
function renderBottomNav() {
    const nav = document.getElementById('bottom-nav');
    nav.innerHTML = `
        <div class="nav-item" onclick="showPage('home')"><span>🏠</span><p>Home</p></div>
        <div class="nav-item" onclick="showPage('shorts')"><span>📱</span><p>Short</p></div>
        <div class="nav-item" onclick="showPage('popular')"><span>🔥</span><p>Populer</p></div>
        <div class="nav-item" onclick="showPage('profile')"><span>👤</span><p>Profil</p></div>
    `;
}

function showPage(page) {
    const container = document.getElementById('content-container');
    const header = document.getElementById('app-header');
    
    // Update Header (Tetap ada tombol Garis Tiga di pojok kanan atas)
    header.innerHTML = `
        <img src="https://i.ibb.co.com/BV5v4L9j/1000196715.jpg" class="vizo-logo-small">
        <button class="menu-btn" onclick="toggleSidebar()">☰</button>
    `;

    // Logika Ganti Halaman
    if (page === 'home') renderHome(container);
    else if (page === 'shorts') renderShorts(container);
    else if (page === 'popular') {
        container.innerHTML = '<div class="movie-grid" id="pop-grid"></div>';
        fetchMoviesByPath('/movie/popular', 'pop-grid');
    }
    else if (page === 'profile') renderProfile(container);

    // Update warna ikon navigasi aktif
    updateNavUI(page);
    toggleSidebar(false); // Tutup sidebar otomatis saat pindah
}

function updateNavUI(page) {
    const items = document.querySelectorAll('.nav-item');
    items.forEach(item => item.classList.remove('active'));
    const idx = {home:0, shorts:1, popular:2, profile:3}[page];
    if(items[idx]) items[idx].classList.add('active');
}

async function fetchMoviesByPath(path, targetId) {
    const res = await fetch(`${BASE_URL}${path}?api_key=${API_KEY}`);
    const data = await res.json();
    document.getElementById(targetId).innerHTML = data.results.map(m => `
        <div class="card"><img src="${IMG_URL + m.poster_path}"></div>
    `).join('');
}

    
    // 1. Reset status aktif pada tombol navigasi bawah
    navItems.forEach(item => item.classList.remove('active'));

    // 2. Bersihkan kontainer sebelum memuat konten baru
    if (container) container.innerHTML = "";

    // 3. Logika perpindahan halaman berdasarkan modul JS masing-masing
    if (page === 'home') {
        if (navItems[0]) navItems[0].classList.add('active');
        if (typeof renderHome === "function") renderHome(container);
    } 
    else if (page === 'shorts') {
        if (navItems[1]) navItems[1].classList.add('active');
        if (typeof renderShorts === "function") renderShorts(container);
    } 
    else if (page === 'profile') {
        if (navItems[2]) navItems[2].classList.add('active');
        if (typeof renderProfile === "function") renderProfile(container);
    }
    
    // 4. Tutup sidebar secara otomatis jika sedang terbuka
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('active');
}

/**
 * Fungsi global untuk membuka/menutup sidebar menu.
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

/**
 * Fungsi logout global yang bisa dipanggil dari profil atau sidebar.
 */
function handleLogout() {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
        auth.signOut().then(() => {
            alert("Berhasil keluar.");
        }).catch(err => {
            alert("Error: " + err.message);
        });
    }
}
