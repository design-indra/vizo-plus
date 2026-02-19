// File: www/js/shorts.js

async function renderShorts(container) {
    const header = document.getElementById('app-header');
    if (header) header.style.display = 'none';

    container.innerHTML = `<div class="shorts-container" id="shorts-wrapper">
        <p id="shorts-loading" style="text-align:center; margin-top:50vh; color:#555;">Memuat Video TikTok...</p>
    </div>`;
    
    const wrapper = document.getElementById('shorts-wrapper');

    try {
        // Menggunakan API publik gratis untuk mengambil video trending TikTok
        // Anda bisa mengganti 'trending' dengan keyword lain seperti 'movie', 'drama', dll.
        const res = await fetch(`https://www.tikwm.com/api/feed/list?region=ID&count=20`);
        const result = await res.json();
        const videos = result.data;

        if (document.getElementById('shorts-loading')) document.getElementById('shorts-loading').remove();

        videos.forEach((vid, index) => {
            const shortItem = document.createElement('div');
            shortItem.className = 'short-video-post';
            shortItem.setAttribute('data-index', index);

            shortItem.innerHTML = `
                <div class="shorts-overlay" onclick="handleVideoTap(this)"></div>
                
                <video 
                    class="vizo-tiktok-player" 
                    loop 
                    playsinline 
                    preload="auto"
                    style="width:100%; height:100%; object-fit:cover;"
                    src="${vid.play}">
                </video>

                <div class="shorts-info">
                    <h3>@${vid.author.unique_id}</h3>
                    <p>${vid.title}</p>
                </div>

                <div class="shorts-actions">
                    <div class="action-item"><span>❤️</span><p>${formatNumber(vid.digg_count)}</p></div>
                    <div class="action-item"><span>💬</span><p>${formatNumber(vid.comment_count)}</p></div>
                    <div class="action-item"><span>🔗</span><p>Share</p></div>
                </div>
            `;
            wrapper.appendChild(shortItem);
        });

        initTikTokScrollObserver();

    } catch (e) {
        console.error("TikTok Shorts Error:", e);
        container.innerHTML = "<p style='text-align:center; padding-top:50px;'>Gagal memuat TikTok Shorts.</p>";
    }
}

function initTikTokScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (entry.isIntersecting) {
                video.play();
                video.muted = false; // Akan bersuara otomatis jika sudah ada interaksi pertama
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.8 });

    document.querySelectorAll('.short-video-post').forEach(post => observer.observe(post));
}

function handleVideoTap(overlay) {
    const video = overlay.parentElement.querySelector('video');
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function formatNumber(num) {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
}
