async function renderHome(container) {
    container.innerHTML = `
        <section class="hero" id="hero-section" style="height: 40vh; background: linear-gradient(to top, #050505, transparent), url('https://image.tmdb.org/t/p/original/t6SlsTU7c9zSjM0pQM6908vRdb5.jpg'); background-size: cover; background-position: center; display: flex; align-items: flex-end; padding: 20px;">
            <div><h1 style="font-size: 22px;">Avatar: The Way of Water</h1>
            <button class="play-main-btn" onclick="openPlayer('Avatar', '76600')" style="background:#e50914; color:#fff; border:none; padding:8px 15px; border-radius:5px; margin-top:10px;">▶ Putar</button></div>
        </section>
        <h3 style="padding:15px 15px 0 15px; font-size:16px;">Trending Hari Ini</h3>
        <div id="movie-grid" class="movie-grid"></div>
    `;
    fetchLatest();
}

async function fetchLatest() {
    const grid = document.getElementById('movie-grid');
    if (!grid) return;
    try {
        const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        const data = await res.json();
        grid.innerHTML = data.results.map(m => `
            <div class="card" onclick="openPlayer('${m.title.replace(/'/g, "\\'")}', '${m.id}')">
                <div class="card-img-wrapper"><img src="${IMG_URL + m.poster_path}"></div>
                <div class="card-title">${m.title}</div>
            </div>`).join('');
    } catch (e) { console.log(e); }
}
