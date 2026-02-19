// --- CONFIG FIREBASE ---
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

// --- UI LOGIC ---

function updateUI(user) {
    const splash = document.getElementById('splash-screen');
    const login = document.getElementById('loginOverlay');
    const main = document.getElementById('main-content');

    if (splash) splash.style.display = 'none';

    if (user) {
        if (login) login.style.display = 'none';
        if (main) main.style.display = 'block';
        fetchMovies();
    } else {
        if (login) login.style.display = 'flex';
        if (main) main.style.display = 'none';
    }
}

auth.onAuthStateChanged(user => updateUI(user));

// --- AUTH LOGIC ---
let isLoginMode = true;
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('authHeading').innerText = isLoginMode ? "Masuk ke Vizo+" : "Daftar Vizo+";
    document.getElementById('authBtn').innerText = isLoginMode ? "Masuk" : "Buat Akun";
    document.getElementById('toggleText').innerText = isLoginMode ? "Belum punya akun?" : "Sudah punya akun?";
    document.getElementById('toggleLink').innerText = isLoginMode ? "Daftar" : "Masuk";
}

function handleAuth() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passInput').value;
    if (!email || !password) return alert("Isi data lengkap");

    if (isLoginMode) {
        auth.signInWithEmailAndPassword(email, password).catch(e => alert(e.message));
    } else {
        auth.createUserWithEmailAndPassword(email, password).catch(e => alert(e.message));
    }
}

// --- CONTENT LOGIC (VIDEO) ---
function fetchMovies() {
    const grid = document.getElementById('movie-grid');
    
    // DATA FILM ASLI (Ganti link MP4 di sini)
    const movies = [
        { 
            title: "Avatar: The Way of Water", 
            img: "https://image.tmdb.org/t/p/w500/t6SlsTU7c9zSjM0pQM6908vRdb5.jpg", 
            video: "https://www.w3schools.com/html/mov_bbb.mp4" 
        },
        { 
            title: "Puss in Boots: The Last Wish", 
            img: "https://image.tmdb.org/t/p/w500/kuf6ELuB3U8Ad6Z0UM6q4z3HbuV.jpg", 
            video: "https://www.w3schools.com/html/movie.mp4" 
        }
    ];

    grid.innerHTML = movies.map(m => `
        <div class="movie-card" onclick="playVideo('${m.video}')">
            <div class="poster-wrapper">
                <img src="${m.img}">
                <div class="play-badge">PLAY</div>
            </div>
            <p>${m.title}</p>
        </div>
    `).join('');
}

function playVideo(url) {
    const player = `
        <div id="videoPlayerOverlay" class="video-overlay">
            <span class="close-btn" onclick="document.getElementById('videoPlayerOverlay').remove()">×</span>
            <video controls autoplay><source src="${url}" type="video/mp4"></video>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', player);
}
