// Fungsi untuk merender tabel
function renderTable() {
    const deliveryData = getAllData();
    const entryTable = document.getElementById('entry-data');
    entryTable.innerHTML = '';
    
    if (deliveryData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="9" style="text-align: center; padding: 20px;">
                Belum ada data. Klik "Tambah Baris" untuk menambahkan data.
            </td>
        `;
        entryTable.appendChild(row);
        return;
    }
    
    deliveryData.forEach((data, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="date" value="${data.tanggal}" data-field="tanggal" data-index="${index}"></td>
            <td>
                <select data-field="plant" data-index="${index}">
                    <option value="Denpasar 2" ${data.plant === 'Denpasar 2' ? 'selected' : ''}>Denpasar 2</option>
                    <option value="Gianyar" ${data.plant === 'Gianyar' ? 'selected' : ''}>Gianyar</option>
                </select>
            </td>
            <td><input type="text" value="${data.siteNo}" data-field="siteNo" data-index="${index}"></td>
            <td><input type="text" value="${data.siteName}" data-field="siteName" data-index="${index}"></td>
            <td><input type="number" value="${data.qtyOrder}" data-field="qtyOrder" data-index="${index}" min="0"></td>
            <td><input type="number" value="${data.qtyDelivery}" data-field="qtyDelivery" data-index="${index}" min="0"></td>
            <td><input type="number" value="${data.qtyRemain}" data-field="qtyRemain" data-index="${index}" readonly></td>
            <td><input type="number" value="${data.qtyCancel}" data-field="qtyCancel" data-index="${index}" min="0"></td>
            <td class="action-cell">
                <button class="btn btn-danger" onclick="deleteRow(${index})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        entryTable.appendChild(row);
    });
    
    // Tambahkan event listeners untuk input fields
    attachInputListeners();
}

// Fungsi untuk melampirkan event listeners ke input fields
function attachInputListeners() {
    const inputs = document.querySelectorAll('input[data-field], select[data-field]');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const field = this.getAttribute('data-field');
            let value = this.value;
            
            if (field === 'qtyOrder' || field === 'qtyDelivery' || field === 'qtyCancel' || field === 'qtyRemain') {
                value = parseFloat(value) || 0;
            }
            
            const deliveryData = getAllData();
            deliveryData[index][field] = value;
            
            // Jika qtyOrder, qtyDelivery, atau qtyCancel berubah, hitung ulang qtyRemain
            if (field === 'qtyOrder' || field === 'qtyDelivery' || field === 'qtyCancel') {
                const qtyRemain = deliveryData[index].qtyOrder - deliveryData[index].qtyDelivery - deliveryData[index].qtyCancel;
                deliveryData[index].qtyRemain = qtyRemain >= 0 ? qtyRemain : 0;
                
                // Perbarui nilai di input field
                const remainInput = document.querySelector(`input[data-field="qtyRemain"][data-index="${index}"]`);
                if (remainInput) {
                    remainInput.value = deliveryData[index].qtyRemain;
                }
            }
            
            saveData(deliveryData);
        });
    });
}

// Fungsi untuk menambah baris baru
function addNewRow() {
    const deliveryData = getAllData();
    deliveryData.push({
        tanggal: new Date().toISOString().split('T')[0],
        plant: 'Denpasar 2',
        siteNo: '',
        siteName: '',
        qtyOrder: 0,
        qtyDelivery: 0,
        qtyRemain: 0,
        qtyCancel: 0
    });
    saveData(deliveryData);
    renderTable();
}

// Fungsi untuk menghapus baris
function deleteRow(index) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        const deliveryData = getAllData();
        deliveryData.splice(index, 1);
        saveData(deliveryData);
        renderTable();
    }
}
