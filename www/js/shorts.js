let hasUserInteracted = false;
window.addEventListener('click', () => { hasUserInteracted = true; }, { once: true });

async function renderShorts(container) {
    container.innerHTML = `<div class="shorts-container" id="shorts-wrapper"></div>`;
    try {
        const res = await fetch(`https://www.tikwm.com/api/feed/list?region=ID&count=15`);
        const result = await res.json();
        const wrapper = document.getElementById('shorts-wrapper');
        
        result.data.forEach((vid, i) => {
            const div = document.createElement('div');
            div.className = 'short-video-post';
            div.innerHTML = `
                <div class="shorts-overlay" onclick="togglePlayShort(this)"></div>
                <video loop playsinline style="width:100%; height:100%; object-fit:cover;" src="${vid.play}"></video>
                <div style="position:absolute; bottom:80px; left:15px; z-index:20;">
                    <p style="font-weight:bold;">@${vid.author.unique_id}</p>
                    <p style="font-size:12px; opacity:0.8;">${vid.title}</p>
                </div>`;
            wrapper.appendChild(div);
        });
        initShortsObserver();
    } catch (e) { container.innerHTML = "Gagal memuat Shorts."; }
}

function initShortsObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (entry.isIntersecting) {
                video.play();
                if (hasUserInteracted) video.muted = false;
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.8 });
    document.querySelectorAll('.short-video-post').forEach(v => observer.observe(v));
}

function togglePlayShort(overlay) {
    const video = overlay.nextElementSibling;
    if (video.paused) { video.play(); video.muted = false; }
    else { video.pause(); }
}
