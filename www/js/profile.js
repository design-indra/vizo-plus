function clearCache() {
    // Menghapus data sementara di browser/aplikasi
    const confirmClear = confirm("Apakah Anda yakin ingin menghapus cache aplikasi?");
    if (confirmClear) {
        localStorage.clear(); // Menghapus data login otomatis jika ada
        alert("Cache berhasil dibersihkan! Aplikasi akan memuat ulang.");
        location.reload();
    }
}
