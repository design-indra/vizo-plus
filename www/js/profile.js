// File: www/js/profile.js

function renderProfile(container) {
    const user = firebase.auth().currentUser;

    if (!user) {
        container.innerHTML = `<div style="padding:50px; text-align:center;"><p>Silakan login kembali.</p></div>`;
        return;
    }

    container.innerHTML = `
        <div class="profile-page" style="padding: 20px; text-align: center; animation: fadeIn 0.5s ease;">
            <div class="profile-header" style="margin-top: 30px;">
                <div class="profile-avatar" style="width: 100px; height: 100px; background: #222; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 3px solid var(--primary); overflow: hidden;">
                    ${user.photoURL ? 
                        `<img src="${user.photoURL}" style="width:100%; height:100%; object-fit:cover;">` : 
                        `<span style="font-size: 40px;">👤</span>`
                    }
                </div>
                <h2 style="margin-top: 15px; font-size: 20px;" id="profile-name-display">${user.displayName || 'Pengguna Vizo+'}</h2>
                <p style="color: #888; font-size: 14px;">${user.email}</p>
            </div>

            <div class="profile-menu" style="margin-top: 40px; text-align: left;">
                <div style="background: #111; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
                    <div style="padding: 15px; border-bottom: 1px solid #222; display: flex; justify-content: space-between;">
                        <span>Langganan</span>
                        <span style="color: var(--primary); font-weight: bold;">Premium Plan</span>
                    </div>
                    <div style="padding: 15px; display: flex; justify-content: space-between; cursor:pointer;" onclick="openEditModal()">
                        <span>Edit Profil</span>
                        <span style="color:var(--primary)">Ubah ❯</span>
                    </div>
                </div>

                <button onclick="handleLogout()" style="width: 100%; background: #222; color: #ff4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold;">
                    🚪 Keluar dari Akun
                </button>
            </div>
        </div>
    `;
}

// Fungsi membuka modal edit
function openEditModal() {
    const user = firebase.auth().currentUser;
    document.getElementById('editDisplayName').value = user.displayName || "";
    document.getElementById('editPhotoURL').value = user.photoURL || "";
    document.getElementById('editProfileModal').style.display = 'flex';
}

// Fungsi menutup modal
function closeEditModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

// Fungsi menyimpan ke Firebase
async function saveProfileChanges() {
    const user = firebase.auth().currentUser;
    const newName = document.getElementById('editDisplayName').value;
    const newPhoto = document.getElementById('editPhotoURL').value;

    if (!newName) return alert("Nama tidak boleh kosong!");

    try {
        await user.updateProfile({
            displayName: newName,
            photoURL: newPhoto
        });
        
        alert("Profil berhasil diperbarui!");
        closeEditModal();
        showPage('profile'); // Refresh halaman profil
    } catch (error) {
        alert("Gagal memperbarui: " + error.message);
    }
}
