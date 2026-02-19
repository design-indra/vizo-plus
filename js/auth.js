// Konfigurasi Firebase Anda
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
let isSignUpMode = false;

function renderLogin() {
    const loginDiv = document.getElementById('loginOverlay');
    loginDiv.innerHTML = `
        <div class="login-card">
            <img src="https://i.ibb.co.com/BV5v4L9j/1000196715.jpg" style="width: 80px; margin-bottom: 20px;">
            <h2 id="authHeading">${isSignUpMode ? 'Daftar Akun' : 'Masuk ke Vizo+'}</h2>
            <input type="email" id="emailInput" placeholder="Email">
            <input type="password" id="passInput" placeholder="Password">
            <button class="btn-primary" onclick="processAuth()">${isSignUpMode ? 'Daftar' : 'Masuk'}</button>
            <p onclick="toggleAuthMode()" id="toggleLink" style="margin-top:15px; cursor:pointer; font-size:13px; color:#e50914;">
                ${isSignUpMode ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
            </p>
        </div>`;
}

async function processAuth() {
    const email = document.getElementById('emailInput').value;
    const pass = document.getElementById('passInput').value;
    try {
        if(isSignUpMode) await auth.createUserWithEmailAndPassword(email, pass);
        else await auth.signInWithEmailAndPassword(email, pass);
    } catch(err) { alert(err.message); }
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    renderLogin();
}
