const firebaseConfig = {
  apiKey: "AIzaSyAmeKFqlAHPjxbm4mZNAd-e4w4mcP7lhkQ",
  authDomain: "vizo-plus.firebaseapp.com",
  projectId: "vizo-plus",
  storageBucket: "vizo-plus.firebasestorage.app",
  messagingSenderId: "366285407901",
  appId: "1:366285407901:web:f544ef45e462071909b674"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const API_KEY = 'f008869b3272ff8ea57a29ec647ca989';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let isSignUpMode = false;

// Monitor Status Login - Diperbaiki untuk APK
window.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        const splash = document.getElementById('splash-screen');
        const login = document.getElementById('loginOverlay');
        const main = document.getElementById('main-content');

        setTimeout(() => {
            if (splash) splash.style.display = 'none';
            if (user) {
                if (login) login.style.display = 'none';
                if (main) main.style.display = 'block';
                fetchLatest();
            } else {
                if (login) login.style.display = 'flex';
                if (main) main.style.display = 'none';
            }
        }, 1500);
    });
});

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
    document.getElementById('toggleLink').innerText = isSignUpMode ? "Masuk" : "Daftar Akun Baru";
}

function handleLogout() { auth.signOut(); }
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }

async function fetchLatest() {
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Memuat...</p>';
    
    try {
        const res = await fetch(`${BASE_URL}/trending/tv/day?api_key=${API_KEY}`);
        const data = await res.json();
        grid.innerHTML = '';
        data.results.forEach(m => {
            if(!m.poster_path) return;
            grid.innerHTML += `
                <div class="card" onclick="playVideo('https://www.w3schools.com/html/mov_bbb.mp4')">
                    <img src="${IMG_URL + m.poster_path}">
                    <div class="card-title">${m.name || m.title}</div>
                </div>`;
        });
    } catch (e) { grid.innerHTML = 'Gagal memuat data.'; }
}

function playVideo(url) {
    const player = `
        <div id="videoPlayerOverlay" class="video-overlay" style="position:fixed; inset:0; background:#000; z-index:20000; display:flex; align-items:center;">
            <span onclick="this.parentElement.remove()" style="position:absolute; top:30px; right:30px; font-size:40px; color:#fff; cursor:pointer;">×</span>
            <video controls autoplay style="width:100%"><source src="${url}" type="video/mp4"></video>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', player);
}
