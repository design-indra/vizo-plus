window.addEventListener('load', () => {
    renderLogin();
    renderSidebar();
    
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

function renderBottomNav() {
    document.getElementById('bottom-nav').innerHTML = `
        <div class="nav-item" onclick="showPage('home')"><span>🏠</span><p>Home</p></div>
        <div class="nav-item" onclick="showPage('shorts')"><span>📱</span><p>Shorts</p></div>
        <div class="nav-item" onclick="showPage('profile')"><span>👤</span><p>Profil</p></div>`;
}

function showPage(page) {
    const container = document.getElementById('content-container');
    if(page === 'home') renderHome(container);
    else if(page === 'shorts') renderShorts(container);
    else if(page === 'profile') renderProfile(container);
    
    // Update active class
    const items = document.querySelectorAll('.nav-item');
    items.forEach(item => item.classList.remove('active'));
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
