// File: www/js/main.js

window.addEventListener('load', () => {
    auth.onAuthStateChanged(user => {
        const splash = document.getElementById('splash-screen');
        const login = document.getElementById('loginOverlay');
        const main = document.getElementById('main-content');

        if (splash) splash.style.display = 'none';

        if (user) {
            if (login) login.style.display = 'none';
            if (main) main.style.display = 'block';
            renderBottomNav();
            showPage('home');
        } else {
            if (login) login.style.display = 'flex';
            if (main) main.style.display = 'none';
        }
    });
});

function showPage(page) {
    const container = document.getElementById('content-container');
    const searchBar = document.getElementById('search-bar-root');
    if (!container) return;

    // Reset view
    container.innerHTML = "";
    if (searchBar) searchBar.style.display = (page === 'shorts') ? 'none' : 'block';

    if (page === 'home') renderHome(container);
    else if (page === 'shorts') renderShorts(container);
    else if (page === 'popular') renderPopular(container);
    else if (page === 'profile') renderProfile(container);

    updateActiveNav(page);
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('active');
}

async function searchMovies(query) {
    const grid = document.getElementById('movie-grid');
    const hero = document.getElementById('hero-section');
    if (!grid) return;

    if (!query || query.trim().length < 2) {
        if (hero) hero.style.display = 'block';
        fetchLatest(); 
        return;
    }

    if (hero) hero.style.display = 'none';
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Mencari...</p>';

    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        grid.innerHTML = data.results.map(m => {
            if (!m.poster_path) return '';
            return `<div class="card" onclick="openPlayer('${m.title.replace(/'/g, "\\'")}', '${m.id}')">
                <div class="card-img-wrapper"><img src="${IMG_URL + m.poster_path}"></div>
                <div class="card-title">${m.title}</div>
            </div>`;
        }).join('');
    } catch (e) { console.log(e); }
}

function renderBottomNav() {
    const nav = document.getElementById('bottom-nav');
    nav.innerHTML = `
        <div class="nav-item" onclick="showPage('home')"><span>🏠</span><p>Home</p></div>
        <div class="nav-item" onclick="showPage('shorts')"><span>📱</span><p>Short</p></div>
        <div class="nav-item" onclick="showPage('popular')"><span>🔥</span><p>Populer</p></div>
        <div class="nav-item" onclick="showPage('profile')"><span>👤</span><p>Profil</p></div>
    `;
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function updateActiveNav(page) {
    const items = document.querySelectorAll('.nav-item');
    const pages = ['home', 'shorts', 'popular', 'profile'];
    items.forEach((item, i) => item.classList.toggle('active', pages[i] === page));
}
