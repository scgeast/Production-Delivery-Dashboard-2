// Fungsi untuk memperbarui dashboard
function updateDashboard() {
    const deliveryData = getAllData();
    const filters = {
        dariTanggal: document.getElementById('dari-tanggal').value,
        sampaiTanggal: document.getElementById('sampai-tanggal').value,
        plant: document.getElementById('plant').value,
        status: document.getElementById('status').value
    };
    
    // Terapkan filter jika ada
    const filteredData = filters.dariTanggal || filters.sampaiTanggal || 
                         filters.plant !== 'semua' || filters.status !== 'semua' ? 
                         filterData(filters) : deliveryData;
    
    // Hitung total volume order, terkirim, dan tertunda
    let totalVolume = 0;
    let totalTerkirim = 0;
    let totalTertunda = 0;
    
    // Hitung untuk setiap plant
    let denpasarOrder = 0;
    let denpasarTerkirim = 0;
    let denpasarTertunda = 0;
    let denpasarProyekTertunda = 0;
    
    let gianyarOrder = 0;
    let gianyarTerkirim = 0;
    let gianyarTertunda = 0;
    let gianyarProyekTertunda = 0;
    
    // Hitung total proyek dan proyek tertunda
    const uniqueSites = new Set();
    const pendingSites = new Set();
    
    filteredData.forEach(data => {
        totalVolume += data.qtyOrder;
        totalTerkirim += data.qtyDelivery;
        totalTertunda += data.qtyRemain;
        
        // Identifikasi proyek unik
        const siteKey = `${data.siteNo}-${data.siteName}`;
        uniqueSites.add(siteKey);
        
        // Identifikasi proyek tertunda
        if (data.qtyRemain > 0) {
            pendingSites.add(siteKey);
        }
        
        // Hitung berdasarkan plant
        if (data.plant === 'Denpasar 2') {
            denpasarOrder += data.qtyOrder;
            denpasarTerkirim += data.qtyDelivery;
            denpasarTertunda += data.qtyRemain;
            
            if (data.qtyRemain > 0) {
                denpasarProyekTertunda++;
            }
        } else if (data.plant === 'Gianyar') {
            gianyarOrder += data.qtyOrder;
            gianyarTerkirim += data.qtyDelivery;
            gianyarTertunda += data.qtyRemain;
            
            if (data.qtyRemain > 0) {
                gianyarProyekTertunda++;
            }
        }
    });
    
    // Perbarui UI
    document.getElementById('total-volume').textContent = totalVolume + ' m³';
    document.getElementById('volume-terkirim').textContent = totalTerkirim + ' m³';
    document.getElementById('volume-tertunda').textContent = totalTertunda + ' m³';
    document.getElementById('total-proyek').textContent = uniqueSites.size;
    
    document.getElementById('denpasar-order').textContent = denpasarOrder;
    document.getElementById('denpasar-terkirim').textContent = denpasarTerkirim;
    document.getElementById('denpasar-tertunda').textContent = denpasarTertunda;
    document.getElementById('denpasar-proyek-tertunda').textContent = denpasarProyekTertunda;
    
    document.getElementById('gianyar-order').textContent = gianyarOrder;
    document.getElementById('gianyar-terkirim').textContent = gianyarTerkirim;
    document.getElementById('gianyar-tertunda').textContent = gianyarTertunda;
    document.getElementById('gianyar-proyek-tertunda').textContent = gianyarProyekTertunda;
    
    // Perbarui progress bars dan persentase
    const denpasarPercent = denpasarOrder > 0 ? (denpasarTerkirim / denpasarOrder) * 100 : 0;
    const gianyarPercent = gianyarOrder > 0 ? (gianyarTerkirim / gianyarOrder) * 100 : 0;
    
    document.getElementById('denpasar-progress').style.width = denpasarPercent + '%';
    document.getElementById('gianyar-progress').style.width = gianyarPercent + '%';
    
    document.getElementById('denpasar-terkirim-pct').textContent = denpasarPercent.toFixed(0);
    document.getElementById('denpasar-tertunda-pct').textContent = (100 - denpasarPercent).toFixed(0);
    
    document.getElementById('gianyar-terkirim-pct').textContent = gianyarPercent.toFixed(0);
    document.getElementById('gianyar-tertunda-pct').textContent = (100 - gianyarPercent).toFixed(0);
    
    // Perbarui last update jika ada
    const lastUpdate = localStorage.getItem('lastUpdate');
    if (lastUpdate) {
        document.getElementById('last-update').textContent = lastUpdate;
    }
}
