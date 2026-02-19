// Pengatur Navigasi Utama
window.addEventListener('load', () => {
    // Inisialisasi awal
    if (typeof renderSidebar === "function") renderSidebar();

    // Cek Status Login Firebase
    auth.onAuthStateChanged(user => {
        const splash = document.getElementById('splash-screen');
        const login = document.getElementById('loginOverlay');
        const main = document.getElementById('main-content');

        // Beri delay sedikit agar transisi halus
        setTimeout(() => {
            if (splash) splash.style.display = 'none';

            if (user) {
                if (login) login.style.display = 'none';
                if (main) main.style.display = 'block';
                renderBottomNav();
                showPage('home'); // Panggil fungsi dari home.js
            } else {
                if (login) login.style.display = 'flex';
                if (main) main.style.display = 'none';
                if (typeof renderLogin === "function") renderLogin();
            }
        }, 2000);
    });
});

function renderBottomNav() {
    document.getElementById('bottom-nav').innerHTML = `
        <div class="nav-item active" onclick="showPage('home')"><span>🏠</span><p>Home</p></div>
        <div class="nav-item" onclick="showPage('shorts')"><span>📱</span><p>Shorts</p></div>
        <div class="nav-item" onclick="showPage('profile')"><span>👤</span><p>Profil</p></div>
    `;
}

function showPage(page) {
    const container = document.getElementById('content-container');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Reset Active State Nav
    navItems.forEach(item => item.classList.remove('active'));

    if (page === 'home') {
        if (navItems[0]) navItems[0].classList.add('active');
        renderHome(container);
    } else if (page === 'shorts') {
        if (navItems[1]) navItems[1].classList.add('active');
        renderShorts(container);
    } else if (page === 'profile') {
        if (navItems[2]) navItems[2].classList.add('active');
        renderProfile(container);
    }
    
    // Tutup sidebar otomatis setiap pindah halaman
    const sb = document.getElementById('sidebar');
    if (sb) sb.classList.remove('active');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}
