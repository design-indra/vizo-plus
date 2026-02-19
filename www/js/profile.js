// File: www/js/profile.js

function renderProfile(container) {
    // Mengambil data user yang sedang login dari Firebase
    const user = firebase.auth().currentUser;

    if (!user) {
        container.innerHTML = `
            <div style="padding: 50px 20px; text-align: center;">
                <p>Silakan login untuk melihat profil.</p>
                <button onclick="location.reload()" style="background:var(--primary); color:white; border:none; padding:10px 20px; border-radius:5px; margin-top:15px;">Login Sekarang</button>
            </div>
        `;
        return;
    }

    // Tampilan Halaman Profil
    container.innerHTML = `
        <div class="profile-page" style="padding: 20px; text-align: center; animation: fadeIn 0.5s ease;">
            <div class="profile-header" style="margin-top: 30px;">
                <div class="profile-avatar" style="width: 100px; height: 100px; background: #222; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 3px solid var(--primary); overflow: hidden;">
                    ${user.photoURL ? 
                        `<img src="${user.photoURL}" style="width:100%; height:100%; object-fit:cover;">` : 
                        `<span style="font-size: 40px;">👤</span>`
                    }
                </div>
                <h2 style="margin-top: 15px; font-size: 20px;">${user.displayName || 'Pengguna Vizo+'}</h2>
                <p style="color: #888; font-size: 14px;">${user.email}</p>
            </div>

            <div class="profile-menu" style="margin-top: 40px; text-align: left;">
                <div style="background: #111; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
                    <div style="padding: 15px; border-bottom: 1px solid #222; display: flex; justify-content: space-between;">
                        <span>Langganan</span>
                        <span style="color: var(--primary); font-weight: bold;">Premium Plan</span>
                    </div>
                    <div style="padding: 15px; border-bottom: 1px solid #222; display: flex; justify-content: space-between;">
                        <span>Status Akun</span>
                        <span style="color: #4CAF50;">Aktif</span>
                    </div>
                    <div style="padding: 15px; display: flex; justify-content: space-between;" onclick="alert('Fitur Edit Profil segera hadir')">
                        <span>Edit Profil</span>
                        <span>❯</span>
                    </div>
                </div>

                <button onclick="handleLogout()" style="width: 100%; background: #222; color: #ff4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold; font-size: 15px;">
                    🚪 Keluar dari Akun
                </button>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #444;">Vizo+ Version 2.0.1</p>
        </div>
    `;
}
