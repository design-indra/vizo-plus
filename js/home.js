const API_KEY = 'f008869b3272ff8ea57a29ec647ca989';

async function renderHome(container) {
    // Header
    document.getElementById('app-header').innerHTML = `
        <img src="https://i.ibb.co.com/BV5v4L9j/1000196715.jpg" class="logo-small">
        <div class="header-icons"><span onclick="toggleSidebar()">☰</span></div>`;
    document.getElementById('app-header').style.display = 'flex';

    container.innerHTML = `
        <section class="hero" style="background-image: url('https://image.tmdb.org/t/p/original/t6SlsTU7c9zSjM0pQM6908vRdb5.jpg')">
            <div class="hero-info">
                <h1>Avatar: The Way of Water</h1>
                <button class="play-hero-btn" onclick="alert('Memutar...')">▶ Putar</button>
            </div>
        </section>
        <div class="movie-grid" id="home-grid"></div>`;
    
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
    const data = await res.json();
    document.getElementById('home-grid').innerHTML = data.results.map(m => `
        <div class="card"><img src="https://image.tmdb.org/t/p/w500${m.poster_path}"></div>
    `).join('');
}
