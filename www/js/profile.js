// File: www/js/profile.js

/**
 * Fungsi untuk merender halaman Profil pengguna
 * @param {HTMLElement} container - Kontainer utama dari index.html
 */
function renderProfile(container) {
    // 1. Sembunyikan header agar tampilan profil lebih fokus
    const header = document.getElementById('app-header');
    if (header) header.style.display = 'none';

    // 2. Ambil data user yang sedang login dari Firebase
    const user = auth.currentUser;
    const userEmail = user ? user.email : "Pengguna Vizo+";
    const initial = userEmail[0].toUpperCase();

    // 3. Render UI Profil
    container.innerHTML = `
        <div class="profile-section">
            <div class="avatar-big">${initial}</div>
            <h2 style="margin-bottom: 5px;">${userEmail}</h2>
            <p style="color: #888; font-size: 13px; margin-bottom: 25px;">Anggota Premium Vizo+</p>

            <div class="profile-card" onclick="alert('Fitur favorit segera hadir!')">
                <h4>⭐ Koleksi Favorit</h4>
                <p style="font-size: 12px; color: #555;">Lihat drama yang Anda simpan</p>
            </div>

            <div class="profile-card" onclick="alert('Riwayat kosong')">
                <h4>🕒 Riwayat Tontonan</h4>
                <p style="font-size: 12px; color: #555;">Lanjutkan tontonan terakhir Anda</p>
            </div>

            <div class="profile-card" onclick="clearCache()">
                <h4>🧹 Bersihkan Cache</h4>
                <p style="font-size: 12px; color: #555;">Optimalkan performa aplikasi</p>
            </div>

            <button class="play-main-btn" onclick="handleLogout()" style="width: 100%; margin-top: 30px; background: #222;">
                🚪 Keluar dari Akun
            </button>
        </div>
    `;
}

/**
 * Fungsi untuk merender isi Sidebar (Pengaturan)
 */
function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.innerHTML = `
        <div class="sidebar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: white;">Menu Utama</h3>
            <button onclick="toggleSidebar()" style="background:none; border:none; color:white; font-size:24px;">×</button>
        </div>
        <ul class="sidebar-menu">
            <li onclick="showPage('profile')">👤 Profil Saya</li>
            <li onclick="alert('Vizo Premium Aktif')">💎 Vizo Premium</li>
            <li onclick="alert('Bahasa: Indonesia')">🌐 Bahasa</li>
            <li onclick="clearCache()">🧹 Bersihkan Cache</li>
            <li onclick="alert('Versi 1.0.0-Modular')">ℹ️ Tentang Aplikasi</li>
            <li style="color: #e50914; font-weight: bold; margin-top: 20px;" onclick="handleLogout()">🚪 Keluar</li>
        </ul>
    `;
}

/**
 * Fungsi untuk membersihkan cache lokal aplikasi
 */
function clearCache() {
    if (confirm("Hapus cache untuk mempercepat aplikasi?")) {
        // Logika hapus cache (local storage)
        localStorage.clear();
        alert("Cache berhasil dibersihkan!");
        location.reload(); // Muat ulang aplikasi
    }
}
