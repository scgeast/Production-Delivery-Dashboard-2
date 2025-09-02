document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi data jika belum ada
    if (!localStorage.getItem('deliveryData')) {
        localStorage.setItem('deliveryData', JSON.stringify([]));
    }
    
    // Elemen UI
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const addRowBtn = document.getElementById('add-row');
    const simpanDataBtn = document.getElementById('simpan-data');
    const resetDataBtn = document.getElementById('reset-data');
    const notification = document.getElementById('notification');
    const terapkanFilterBtn = document.getElementById('terapkan-filter');
    const resetFilterBtn = document.getElementById('reset-filter');
    
    // Fungsi untuk berpindah tab
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Nonaktifkan semua tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Aktifkan tab yang dipilih
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Jika pindah ke dashboard, perbarui data
            if (tabId === 'dashboard') {
                updateDashboard();
            }
        });
    });
    
    // Fungsi untuk menampilkan notifikasi
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.style.display = 'block';
        notification.style.backgroundColor = isError ? '#e74c3c' : '#2ecc71';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // Event listeners
    addRowBtn.addEventListener('click', addNewRow);
    
    simpanDataBtn.addEventListener('click', function() {
        // Perbarui timestamp
        const formattedDate = saveData(getAllData());
        document.getElementById('last-update').textContent = formattedDate;
        showNotification('Data berhasil disimpan!');
    });
    
    resetDataBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
            clearAllData();
            renderTable();
            showNotification('Semua data telah dihapus!');
        }
    });
    
    terapkanFilterBtn.addEventListener('click', function() {
        updateDashboard();
        showNotification('Filter diterapkan!');
    });
    
    resetFilterBtn.addEventListener('click', function() {
        document.getElementById('dari-tanggal').value = '';
        document.getElementById('sampai-tanggal').value = '';
        document.getElementById('plant').value = 'semua';
        document.getElementById('status').value = 'semua';
        updateDashboard();
        showNotification('Filter direset!');
    });
    
    // Inisialisasi
    const lastUpdate = localStorage.getItem('lastUpdate');
    if (lastUpdate) {
        document.getElementById('last-update').textContent = lastUpdate;
    }
    
    renderTable();
});
