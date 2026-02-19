async function renderShorts(container) {
    document.getElementById('app-header').style.display = 'none';
    container.innerHTML = `<div class="shorts-container" id="shorts-wrapper"></div>`;
    
    const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`);
    const data = await res.json();
    
    document.getElementById('shorts-wrapper').innerHTML = data.results.map(m => `
        <div class="short-video-post">
            <video loop muted autoplay playsinline><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video>
            <div class="shorts-info"><h3>@VizoPlus</h3><p>${m.title || m.name}</p></div>
        </div>
    `).join('');
}
