// File: www/js/auth.js

/**
 * Konfigurasi Firebase dan Inisialisasi
 * Data diambil dari kredensial proyek Vizo+ Anda.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAmeKFqlAHPjxbm4mZNAd-e4w4mcP7lhkQ",
  authDomain: "vizo-plus.firebaseapp.com",
  projectId: "vizo-plus",
  storageBucket: "vizo-plus.firebasestorage.app",
  messagingSenderId: "366285407901",
  appId: "1:366285407901:web:f544ef45e462071909b674"
};

// Inisialisasi Firebase hanya jika belum ada aplikasi yang berjalan
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// State untuk menentukan apakah user sedang di mode Daftar atau Masuk
let isSignUpMode = false;

/**
 * Fungsi untuk merender tampilan form login/daftar ke dalam index.html
 */
function renderLogin() {
    const loginDiv = document.getElementById('loginOverlay');
    if (!loginDiv) return;

    loginDiv.innerHTML = `
        <div class="login-card">
            <img src="https://i.ibb.co.com/BV5v4L9j/1000196715.jpg" alt="Vizo Logo" style="width: 80px; margin-bottom: 20px;">
            <h2 id="authHeading">${isSignUpMode ? 'Daftar Akun' : 'Masuk ke Vizo+'}</h2>
            
            <input type="email" id="emailInput" placeholder="Email">
            <input type="password" id="passInput" placeholder="Password">
            
            <button class="play-main-btn" style="width: 100%;" onclick="handleAuth()">
                ${isSignUpMode ? 'Daftar Sekarang' : 'Masuk'}
            </button>
            
            <p style="margin-top: 15px; font-size: 13px; color: #888;">
                ${isSignUpMode ? 'Sudah punya akun?' : 'Belum punya akun?'} 
                <span onclick="toggleAuthMode()" style="color: #e50914; font-weight: bold; cursor: pointer;">
                    ${isSignUpMode ? 'Masuk' : 'Daftar'}
                </span>
            </p>
        </div>`;
}

/**
 * Fungsi utama untuk memproses login atau pendaftaran ke Firebase
 */
async function handleAuth() {
    const email = document.getElementById('emailInput').value;
    const pass = document.getElementById('passInput').value;

    if (!email || !pass) {
        return alert("Harap isi email dan password dengan benar!");
    }

    try {
        if (isSignUpMode) {
            // Proses pendaftaran user baru
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("Akun berhasil dibuat! Anda otomatis masuk.");
        } else {
            // Proses masuk user lama
            await auth.signInWithEmailAndPassword(email, pass);
        }
    } catch (error) {
        // Menangani error dari Firebase (contoh: password salah, email tidak terdaftar)
        console.error("Auth Error:", error.code);
        alert("Gagal: " + error.message);
    }
}

/**
 * Fungsi untuk berganti antara mode 'Login' dan 'Daftar'
 */
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    renderLogin(); // Render ulang tampilan sesuai mode yang dipilih
}
