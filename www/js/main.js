window.addEventListener('load', () => {
    auth.onAuthStateChanged(user => {
        document.getElementById('splash-screen').style.display = 'none';
        if (user) {
            document.getElementById('loginOverlay').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            renderBottomNav();
            showPage('home');
        } else {
            document.getElementById('loginOverlay').style.display = 'flex';
            document.getElementById('main-content').style.display = 'none';
        }
    });
});

function showPage(page) {
    const container = document.getElementById('content-container');
    const searchRoot = document.getElementById('search-root');
    if (!container) return;

    container.innerHTML = "";
    if (searchRoot) searchRoot.style.display = (page === 'shorts') ? 'none' : 'block';

    if (page === 'home') renderHome(container);
    else if (page === 'shorts') renderShorts(container);
    else if (page === 'popular') renderPopular(container);
    else if (page === 'profile') renderProfile(container);

    updateActiveNav(page);
    document.getElementById('sidebar').classList.remove('active');
}

async function renderPopular(container) {
    container.innerHTML = `<div style="padding:15px;"><h3 style="margin-bottom:15px;">Paling Populer</h3><div id="movie-grid" class="movie-grid"></div></div>`;
    const grid = document.getElementById('movie-grid');
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await res.json();
        grid.innerHTML = data.results.map(m => `
            <div class="card" onclick="openPlayer('${(m.title || m.name).replace(/'/g, "\\'")}', '${m.id}')">
                <div class="card-img-wrapper"><img src="${IMG_URL + m.poster_path}"></div>
                <div class="card-title">${m.title || m.name}</div>
            </div>`).join('');
    } catch (e) { console.log(e); }
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
    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        grid.innerHTML = data.results.map(m => `
            <div class="card" onclick="openPlayer('${(m.title || m.name).replace(/'/g, "\\'")}', '${m.id}')">
                <div class="card-img-wrapper"><img src="${IMG_URL + (m.poster_path || '')}"></div>
                <div class="card-title">${m.title || m.name}</div>
            </div>`).join('');
    } catch (e) { console.log(e); }
}

function renderBottomNav() {
    document.getElementById('bottom-nav').innerHTML = `
        <div class="nav-item" onclick="showPage('home')"><span>🏠</span><p>Home</p></div>
        <div class="nav-item" onclick="showPage('shorts')"><span>📱</span><p>Short</p></div>
        <div class="nav-item" onclick="showPage('popular')"><span>🔥</span><p>Populer</p></div>
        <div class="nav-item" onclick="showPage('profile')"><span>👤</span><p>Profil</p></div>`;
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }

function updateActiveNav(page) {
    const items = document.querySelectorAll('.nav-item');
    const pages = ['home', 'shorts', 'popular', 'profile'];
    items.forEach((item, i) => item.classList.toggle('active', pages[i] === page));
}
