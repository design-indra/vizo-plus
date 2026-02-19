// File: www/js/main.js

/**
 * 1. INISIALISASI & MONITORING LOGIN
 */
window.addEventListener('load', () => {
    console.log("Aplikasi dimuat, memulai pengecekan...");

    // Pintu Darurat: Jika Firebase macet, paksa splash tutup dalam 6 detik
    const failSafe = setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash && splash.style.display !== 'none') {
            console.warn("Fail-safe dipicu: Menutup splash secara paksa.");
            splash.style.display = 'none';
            checkAuthState(null); // Asumsikan belum login jika macet
        }
    }, 6000);

    // Cek status login dari Firebase
    auth.onAuthStateChanged(user => {
        clearTimeout(failSafe);
        checkAuthState(user);
    });
});

function checkAuthState(user) {
    const splash = document.getElementById('splash-screen');
    const login = document.getElementById('loginOverlay');
    const main = document.getElementById('main-content');

    if (splash) splash.style.display = 'none';

    if (user) {
        console.log("User terdeteksi:", user.email);
        if (login) login.style.display = 'none';
        if (main) main.style.display = 'block';
        
        renderBottomNav();
        renderSidebar(); // Pastikan sidebar diisi kontennya
        showPage('home'); // Halaman pertama saat masuk
    } else {
        console.log("User tidak terdeteksi, menampilkan login.");
        if (login) login.style.display = 'flex';
        if (main) main.style.display = 'none';
        if (typeof renderLogin === "function") renderLogin();
    }
}

/**
 * 2. LOGIKA NAVIGASI BAWAH
 */
function renderBottomNav() {
    const nav = document.getElementById('bottom-nav');
    if (!nav) return;
    
    // Sesuai permintaan: Home - Short - Populer - Profil
    nav.innerHTML = `
        <div class="nav-item" onclick="showPage('home')">
            <span>🏠</span><p>Home</p>
        </div>
        <div class="nav-item" onclick="showPage('shorts')">
            <span>📱</span><p>Short</p>
        </div>
        <div class="nav-item" onclick="showPage('popular')">
            <span>🔥</span><p>Populer</p>
        </div>
        <div class="nav-item" onclick="showPage('profile')">
            <span>👤</span><p>Profil</p>
        </div>
    `;
}

/**
 * 3. PENGATUR PINDAH HALAMAN (SPA LOGIC)
 */
function showPage(page) {
    const container = document.getElementById('content-container');
    const header = document.getElementById('app-header');
    
    if (!container) return;

    // Reset Header Default (Logo di kiri, Garis Tiga di kanan)
    header.style.display = 'flex';
    header.innerHTML = `
        <img src="https://i.ibb.co.com/BV5v4L9j/1000196715.jpg" class="vizo-logo-small">
        <button class="menu-btn" onclick="toggleSidebar()">☰</button>
    `;

    // Kosongkan container sebelum memuat halaman baru
    container.innerHTML = "";

    // Logika Pemanggilan Modul
    if (page === 'home') {
        if (typeof renderHome === "function") renderHome(container);
    } 
    else if (page === 'shorts') {
        if (typeof renderShorts === "function") renderShorts(container);
    } 
    else if (page === 'popular') {
        container.innerHTML = '<div class="movie-grid" id="pop-grid"></div>';
        fetchPopularMovies();
    } 
    else if (page === 'profile') {
        if (typeof renderProfile === "function") renderProfile(container);
    }

    // Update UI Navigasi (Warna Aktif)
    updateActiveNavItem(page);
    
    // Tutup sidebar jika terbuka
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('active');
}

/**
 * 4. FITUR POPULER & UTILITY
 */
async function fetchPopularMovies() {
    const grid = document.getElementById('pop-grid');
    if (!grid) return;
    
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await res.json();
        grid.innerHTML = data.results.map(m => `
            <div class="card" onclick="alert('${m.title}')">
                <img src="${IMG_URL + m.poster_path}" alt="${m.title}">
                <div class="card-title">${m.title}</div>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = "<p>Gagal memuat data populer.</p>";
    }
}

function updateActiveNavItem(page) {
    const items = document.querySelectorAll('.nav-item');
    const pages = ['home', 'shorts', 'popular', 'profile'];
    items.forEach((item, index) => {
        if (pages[index] === page) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * 5. LOGIKA SIDEBAR & AUTH GLOBAL
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

function handleLogout() {
    if (confirm("Keluar dari Vizo+?")) {
        auth.signOut();
    }
}

function clearCache() {
    if (confirm("Bersihkan cache aplikasi?")) {
        localStorage.clear();
        alert("Cache dibersihkan!");
        location.reload();
    }
}
