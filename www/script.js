// --- FIREBASE CONFIG (MILIKMU) ---
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

let currentDrama = null;
let favorites = JSON.parse(localStorage.getItem('vizoFav')) || [];
let isSignUpMode = false;

// Splash Screen & Auth Observer
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        auth.onAuthStateChanged(user => {
            if (user) {
                document.getElementById('loginOverlay').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
                document.getElementById('userNameDisplay').innerText = user.email.split('@')[0];
                document.querySelectorAll('.user-avatar').forEach(av => av.innerText = user.email[0].toUpperCase());
                fetchLatest();
            } else {
                document.getElementById('loginOverlay').style.display = 'flex';
                document.getElementById('main-content').style.display = 'none';
            }
        });
    }, 2500);
});

// Auth Logic
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('authHeading').innerText = isSignUpMode ? "Daftar Akun" : "Masuk ke Vizo+";
    document.getElementById('authBtn').innerText = isSignUpMode ? "Daftar Sekarang" : "Masuk";
    document.getElementById('toggleLink').innerText = isSignUpMode ? "Masuk" : "Daftar";
}

async function handleAuth() {
    const email = document.getElementById('emailInput').value;
    const pass = document.getElementById('passInput').value;
    if (!email || !pass) return alert("Isi email & password!");
    try {
        if (isSignUpMode) await auth.createUserWithEmailAndPassword(email, pass);
        else await auth.signInWithEmailAndPassword(email, pass);
    } catch (e) { alert(e.message); }
}

function handleLogout() { auth.signOut().then(() => location.reload()); }

// Navigation
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function openMenu(page) {
    document.getElementById('menuOverlay').style.display = 'flex';
    document.querySelectorAll('.menu-page').forEach(p => p.style.display = 'none');
    document.getElementById(page + 'Section').style.display = 'block';
    if(page === 'favorit') displayFavorites();
    toggleSidebar();
}
function closeMenu() { document.getElementById('menuOverlay').style.display = 'none'; }

// Data Fetching
async function loadData(url) {
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:50px;">Memuat...</div>';
    const res = await fetch(url);
    const data = await res.json();
    grid.innerHTML = '';
    data.results.forEach(m => {
        if (!m.poster_path) return;
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => showDetail(m);
        card.innerHTML = `<img src="${IMG_URL + m.poster_path}"><div class="card-title">${m.name}</div>`;
        grid.appendChild(card);
    });
}

function fetchLatest(btn) { loadData(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=first_air_date.desc&vote_count.gte=50`); }
function fetchTrending(btn) { loadData(`${BASE_URL}/trending/tv/day?api_key=${API_KEY}`); }
function fetchDrama(lang, btn) { loadData(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=${lang}&sort_by=popularity.desc`); }

// Detail & Favorit
function showDetail(movie) {
    currentDrama = movie;
    document.getElementById('detailTitle').innerText = movie.name;
    document.getElementById('detailRating').innerText = movie.vote_average;
    document.getElementById('detailYear').innerText = movie.first_air_date ? movie.first_air_date.split('-')[0] : "-";
    document.getElementById('detailOverview').innerText = movie.overview;
    const isFav = favorites.some(f => f.id === movie.id);
    document.getElementById('favBtn').classList.toggle('active', isFav);
    document.getElementById('playerOverlay').style.display = 'flex';
}

function handleFav() {
    const idx = favorites.findIndex(f => f.id === currentDrama.id);
    if (idx === -1) favorites.push({id: currentDrama.id, name: currentDrama.name, poster: currentDrama.poster_path});
    else favorites.splice(idx, 1);
    localStorage.setItem('vizoFav', JSON.stringify(favorites));
    showDetail(currentDrama);
}

function displayFavorites() {
    const grid = document.getElementById('fav-grid');
    grid.innerHTML = favorites.map(m => `<div class="card" onclick="showDetailById(${m.id})"><img src="${IMG_URL + m.poster}"><div class="card-title">${m.name}</div></div>`).join('');
}

function startVideo() {
    document.getElementById('videoIframe').src = `https://vidsrc.to/embed/tv/${currentDrama.id}`;
    document.getElementById('details-section').style.display = 'none';
    document.getElementById('video-wrapper').style.display = 'block';
}

function closePlayer() {
    document.getElementById('playerOverlay').style.display = 'none';
    document.getElementById('videoIframe').src = '';
    document.getElementById('details-section').style.display = 'block';
    document.getElementById('video-wrapper').style.display = 'none';
}
