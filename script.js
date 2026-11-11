// ==========================================
    // 1. CRUD TEMAN / PEMINJAM
    // ==========================================
    const friendForm = document.getElementById('friendForm');
    
    friendForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newFriend = {
            id: Date.now(),
            name: document.getElementById('friendName').value,
            phone: document.getElementById('friendPhone').value
        };
        friends.push(newFriend);
        saveData();
        friendForm.reset();
        renderFriends();
        renderDashboard();
    });

    function renderFriends() {
        const tbody = document.getElementById('friendTable');
        tbody.innerHTML = friends.length ? friends.map(f => `
            <tr>
                <td><strong>${f.name}</strong></td>
                <td>${f.phone || '-'}</td>
                <td>
                    <button onclick="deleteFriend(${f.id})" class="logout-btn" style="padding:4px 8px; font-size:0.8rem;">Hapus</button>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="3" class="empty">Belum ada data teman.</td></tr>`;

        // Mengisi dropdown opsi peminjam secara dinamis pada form transaksi
        const friendSelect = document.getElementById('loanFriend');
        friendSelect.innerHTML = friends.map(f => `<option value="${f.name}">${f.name}</option>`).join('');
    }

    window.deleteFriend = (id) => {
        friends = friends.filter(f => f.id !== id);
        saveData();
        renderFriends();
        renderDashboard();
    };


    // ==========================================
    // 2. CRUD TRANSAKSI PEMINJAMAN & 3. PENGELOLAAN PENGEMBALIAN
    // ==========================================
    const loanForm = document.getElementById('loanForm');

    loanForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newLoan = {
            id: Date.now(),
            friend: document.getElementById('loanFriend').value,
            book: document.getElementById('loanBook').value,
            date: document.getElementById('loanDate').value,
            due: document.getElementById('loanDue').value,
            status: 'Dipinjam'
        };
        loans.push(newLoan);
        saveData();
        loanForm.reset();
        renderLoans();
        renderDashboard();
    });

    function renderLoans() {
        // Mengisi dropdown pilihan buku koleksi di form peminjaman
        const bookSelect = document.getElementById('loanBook');
        bookSelect.innerHTML = collections.map(c => `<option value="${c.title}">${c.title}</option>`).join('');

        const tbody = document.getElementById('loanTable');
        tbody.innerHTML = loans.length ? loans.map(l => `
            <tr>
                <td>${l.friend}</td>
                <td>${l.book}</td>
                <td>${l.date}</td>
                <td>${l.due}</td>
                <td>
                    <span style="color: ${l.status === 'Kembali' ? 'var(--success)' : 'var(--warning)'}; font-weight:600;">
                        ${l.status}
                    </span>
                </td>
                <td>
                    <!-- Tombol Pengelolaan Pengembalian Buku -->
                    ${l.status === 'Dipinjam' ? `<button onclick="returnLoan(${l.id})" class="secondary-btn" style="padding:4px 8px; font-size:0.8rem;">Tandai Kembali</button>` : '-'}
                </td>
            </tr>
        `).join('') : `<tr><td colspan="6" class="empty">Belum ada peminjaman.</td></tr>`;
    }

    // Fungsi untuk mengubah status pinjaman menjadi "Kembali"
    window.returnLoan = (id) => {
        const loan = loans.find(l => l.id === id);
        if (loan) loan.status = 'Kembali';
        saveData();
        renderLoans();
        renderDashboard();
    };


    // ==========================================
    // 4. PENCARIAN / FILTER TRANSAKSI & 5. REKAPITULASI
    // ==========================================
    function renderDashboard() {
        const totalItems = collections.reduce((acc, curr) => acc + Number(curr.stock), 0);
        const activeLoans = loans.filter(l => l.status === 'Dipinjam');

        // Rekapitulasi Data pada Kartu Statistik Dashboard & Laporan
        document.getElementById('totalKoleksi').textContent = `${totalItems} item`;
        document.getElementById('totalDipinjam').textContent = `${activeLoans.length} item`;
        document.getElementById('totalTeman').textContent = `${friends.length} orang`;

        document.getElementById('reportBooks').textContent = collections.length;
        document.getElementById('reportFriends').textContent = friends.length;
        document.getElementById('reportLoans').textContent = loans.length;

        // Aktivitas Peminjaman Terbaru di Dashboard
        const recentTbody = document.getElementById('recentLoans');
        recentTbody.innerHTML = loans.length ? loans.slice(-5).reverse().map(l => `
            <tr>
                <td>${l.friend}</td>
                <td>${l.book}</td>
                <td>${l.date}</td>
                <td>${l.status}</td>
            </tr>
        `).join('') : `<tr><td colspan="4" class="empty">Belum ada transaksi peminjaman.</td></tr>`;
    }
    