// Fungsi untuk mendapatkan semua data
function getAllData() {
    const data = localStorage.getItem('deliveryData');
    return data ? JSON.parse(data) : [];
}

// Fungsi untuk menyimpan data
function saveData(data) {
    localStorage.setItem('deliveryData', JSON.stringify(data));
    // Simpan timestamp update terakhir
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    localStorage.setItem('lastUpdate', formattedDate);
    return formattedDate;
}

// Fungsi untuk menghapus semua data
function clearAllData() {
    localStorage.removeItem('deliveryData');
    localStorage.removeItem('lastUpdate');
}

// Fungsi untuk validasi data
function validateData(data) {
    const errors = [];
    
    if (!data.tanggal) errors.push('Tanggal harus diisi');
    if (!data.plant) errors.push('Plant harus dipilih');
    if (!data.siteNo) errors.push('Site No harus diisi');
    if (!data.siteName) errors.push('Site Name harus diisi');
    if (data.qtyOrder < 0) errors.push('Qty Order tidak boleh negatif');
    if (data.qtyDelivery < 0) errors.push('Qty Delivery tidak boleh negatif');
    if (data.qtyCancel < 0) errors.push('Qty Cancel tidak boleh negatif');
    
    return errors;
}

// Fungsi untuk memfilter data berdasarkan kriteria
function filterData(filters) {
    let data = getAllData();
    
    if (filters.dariTanggal) {
        data = data.filter(item => new Date(item.tanggal) >= new Date(filters.dariTanggal));
    }
    
    if (filters.sampaiTanggal) {
        data = data.filter(item => new Date(item.tanggal) <= new Date(filters.sampaiTanggal));
    }
    
    if (filters.plant && filters.plant !== 'semua') {
        data = data.filter(item => item.plant === filters.plant);
    }
    
    if (filters.status && filters.status !== 'semua') {
        if (filters.status === 'terkirim') {
            data = data.filter(item => item.qtyRemain === 0);
        } else if (filters.status === 'tertunda') {
            data = data.filter(item => item.qtyRemain > 0);
        }
    }
    
    return data;
}
