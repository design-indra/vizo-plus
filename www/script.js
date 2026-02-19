// --- KONFIGURASI FIREBASE ---
// Pastikan data ini sesuai dengan yang ada di Firebase Console Anda
const firebaseConfig = {
    apiKey: "AIzaSyAmeKFqlAHPjxbm4mZNAd-e4w4mcP7lhkQ",
    authDomain: "vizo-plus.firebaseapp.com",
    projectId: "vizo-plus",
    storageBucket: "vizo-plus.firebasestorage.app",
    messagingSenderId: "366285407901",
    appId: "1:366285407901:web:f544ef45e462071909b674"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// --- LOGIKA TAMPILAN (UI) ---

// Fungsi untuk mengatur apa yang tampil di layar
function updateUI(user) {
    const splash = document.getElementById('splash-screen');
    const loginOverlay = document.getElementById('loginOverlay');
    const mainContent = document.getElementById('main-content');

    // Sembunyikan Splash Screen setelah Firebase merespon
    if (splash) {
        splash.style.display = 'none';
    }

    if (user) {
        // Jika user sudah login
        console.log("User login:", user.email);
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        fetchMovies(); // Panggil fungsi untuk ambil data film
    } else {
        // Jika user belum login
        console.log("User tidak terdeteksi, tampilkan login");
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (mainContent) mainContent.style.display = 'none';
    }
}

// Pantau perubahan status login (Login/Logout)
auth.onAuthStateChanged((user) => {
    updateUI(user);
});

// --- LOGIKA AUTHENTICATION ---

let isLoginMode = true;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const heading = document.getElementById('authHeading');
    const btn = document.getElementById('authBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleLink = document.getElementById('toggleLink');

    if (isLoginMode) {
        heading.innerText = "Masuk ke Vizo+";
        btn.innerText = "Masuk";
        toggleText.innerText = "Belum punya akun?";
        toggleLink.innerText = "Daftar";
    } else {
        heading.innerText = "Daftar Vizo+";
        btn.innerText = "Buat Akun";
        toggleText.innerText = "Sudah punya akun?";
        toggleLink.innerText = "Masuk";
    }
}

function handleAuth() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passInput').value;

    if (!email || !password) {
        alert("Mohon isi email dan password");
        return;
    }

    if (isLoginMode) {
        // Proses Login
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => alert("Login Gagal: " + error.message));
    } else {
        // Proses Daftar
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => alert("Akun berhasil dibuat! Silakan masuk."))
            .catch(error => alert("Daftar Gagal: " + error.message));
    }
}

// --- LOGIKA KONTEN (CONTOH) ---

function fetchMovies() {
    const grid = document.getElementById('movie-grid');
    if (!grid) return;

    // Contoh data film sementara
    const movies = [
        { title: "Film Terbaru 1", img: "https://via.placeholder.com/150x225" },
        { title: "Film Terbaru 2", img: "https://via.placeholder.com/150x225" },
        { title: "Film Terbaru 3", img: "https://via.placeholder.com/150x225" }
    ];

    grid.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <img src="${movie.img}" alt="${movie.title}">
            <p>${movie.title}</p>
        </div>
    `).join('');
}

// Cadangan: Jika dalam 5 detik splash belum hilang (error loading), paksa tutup
setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash && splash.style.display !== 'none') {
        updateUI(auth.currentUser);
    }
}, 5000);
