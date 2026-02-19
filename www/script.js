// --- DATA FIREBASE DARI SCREENSHOT KAMU ---
const firebaseConfig = {
  apiKey: "AIzaSyAmeKFqlAHPjxbm4mZNAd-e4w4mcP7lhkQ",
  authDomain: "vizo-plus.firebaseapp.com",
  projectId: "vizo-plus",
  storageBucket: "vizo-plus.firebasestorage.app",
  messagingSenderId: "366285407901",
  appId: "1:366285407901:web:f544ef45e462071909b674"
};

// Inisialisasi
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const API_KEY = 'f008869b3272ff8ea57a29ec647ca989';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let isSignUpMode = false;

// Monitor Status Login
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        auth.onAuthStateChanged(user => {
            if (user) {
                document.getElementById('loginOverlay').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
                document.querySelectorAll('.user-avatar').forEach(av => av.innerText = user.email[0].toUpperCase());
                fetchLatest();
            } else {
                document.getElementById('loginOverlay').style.display = 'flex';
                document.getElementById('main-content').style.display = 'none';
            }
        });
    }, 2000);
});

// Fungsi Login & Daftar
async function handleAuth() {
    const email = document.getElementById('emailInput').value;
    const pass = document.getElementById('passInput').value;
    if(!email || !pass) return alert("Email & Password wajib diisi!");
    
    try {
        if(isSignUpMode) {
            await auth.createUserWithEmailAndPassword(email, pass);
            alert("Akun berhasil dibuat!");
        } else {
            await auth.signInWithEmailAndPassword(email, pass);
        }
    } catch(err) { alert(err.message); }
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('authHeading').innerText = isSignUpMode ? "Daftar Akun" : "Masuk ke Vizo+";
    document.getElementById('authBtn').innerText = isSignUpMode ? "Daftar Sekarang" : "Masuk";
    document.getElementById('toggleLink').innerText = isSignUpMode ? "Masuk" : "Daftar";
}

function handleLogout() { auth.signOut(); }

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }

async function loadData(url) {
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Loading...</p>';
    const res = await fetch(url);
    const data = await res.json();
    grid.innerHTML = '';
    data.results.forEach(m => {
        if(!m.poster_path) return;
        grid.innerHTML += `
            <div class="card">
                <img src="${IMG_URL + m.poster_path}">
                <div class="card-title">${m.name || m.title}</div>
            </div>`;
    });
}

function fetchLatest() { loadData(`${BASE_URL}/trending/tv/day?api_key=${API_KEY}`); }
