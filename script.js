document.addEventListener('DOMContentLoaded', function () {
    
    // --- Data Kuliner Awal (7 Resep) ---
    const initialKulinerData = [
      { nama: "Rendang", asal: "Sumatera Barat", gambar: "images/rendang.jpg", 
        bahan: ["1 kg daging sapi", "1 liter santan", "Bumbu halus lengkap", "Daun kunyit, daun jeruk"],
        cara: ["Haluskan bumbu.", "Tumis hingga harum.", "Masukkan daging dan santan.", "Masak dengan api kecil hingga kering dan bumbu meresap."]
      },
      { nama: "Gudeg", asal: "Yogyakarta", gambar: "images/gudeg.jpeg",
        bahan: ["1 kg nangka muda", "Gula jawa", "Santan kental", "Daun jati"],
        cara: ["Rebus nangka dengan air dan daun jati hingga empuk.", "Masak dengan santan, gula jawa, dan bumbu halus selama berjam-jam hingga berwarna coklat dan kuah mengering."]
      },
      { nama: "Pempek", asal: "Palembang", gambar: "images/pempek.jpg",
        bahan: ["Ikan tenggiri giling", "Tepung sagu", "Telur", "Kuah Cuko"],
        cara: ["Campur adonan ikan dan sagu, bentuk.", "Rebus hingga mengapung.", "Goreng dan sajikan dengan kuah cuko yang pedas-asam."]
      },
      { nama: "Sate Madura", asal: "Madura", gambar: "images/sate madura.jpg", 
        bahan: ["500 gr daging ayam", "200 gr kacang tanah goreng", "Cabai merah", "Bawang merah & bawang putih", "Kecap manis"],
        cara: ["Haluskan kacang tanah bersama bawang dan cabai, tambahkan kecap manis, garam, dan gula.", "Potong daging ayam kecil-kecil, tusuk dengan tusukan sate.", "Bakar sate di atas bara api sambil dioles bumbu kecap.", "Sajikan dengan saus kacang dan bawang goreng."]
      },
      { nama: "Soto Betawi", asal: "Jakarta", gambar: "images/soto betawi.jpg", 
        bahan: ["500 gr daging sapi", "500 ml santan", "Kentang goreng", "Tomat", "Daun jeruk", "Bawang goreng"],
        cara: ["Rebus daging sapi hingga empuk, potong-potong.", "Tumis bumbu halus lalu masukkan ke kuah kaldu.", "Tambahkan santan, aduk perlahan agar tidak pecah.", "Masukkan kentang, tomat, dan daun jeruk.", "Sajikan panas dengan bawang goreng dan emping."]
      },
      { nama: "Rawon", asal: "Jawa Timur", gambar: "images/rawon.jpg", 
        bahan: ["500 gr daging sapi", "5 buah kluwek", "Bawang merah & bawang putih", "Cabai", "Serai"],
        cara: ["Haluskan bawang, cabai, dan isi kluwek (kluwek berfungsi memberi warna hitam).", "Tumis bumbu halus hingga harum.", "Masukkan daging sapi, aduk rata.", "Tambahkan air, serai, dan daun jeruk.", "Masak hingga daging empuk dan kuah hitam pekat."]
      },
      { nama: "Papeda", asal: "Papua", gambar: "images/papeda.jpg", 
        bahan: ["200 gr sagu", "1 liter air", "Kuah ikan kuning (pendamping)"],
        cara: ["Larutkan sagu dengan sedikit air dingin.", "Tuang air mendidih sambil terus diaduk cepat hingga sagu berubah menjadi bubur kental, lengket, dan transparan.", "Sajikan papeda dengan kuah ikan kuning yang kaya rempah."]
      }
    ];

    // Mengambil data custom dari Local Storage
    const savedCustomData = JSON.parse(localStorage.getItem('customKulinerData')) || [];
    
    // Gabungkan data awal dan data yang ditambahkan user
    let kulinerData = [...initialKulinerData, ...savedCustomData];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    const kulinerList = document.getElementById("kulinerList");
    const favoriteList = document.getElementById("favoriteList");
    
    const modal = document.getElementById("resepModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBahan = document.getElementById("modalBahan");
    const modalCara = document.getElementById("modalCara");
    const modalImageCSS = document.getElementById("modalImageCSS"); 
    const closeBtn = document.querySelector(".close");

    // --- Fungsi Navigasi Halaman Utama ---
    function navigateTo(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');

        if (pageId === 'dashboard-page') {
             loadUserProfile();
             renderKuliner();
             document.querySelectorAll(".sub-page").forEach(p => p.classList.remove("active"));
             document.getElementById("home").classList.add("active");
             document.querySelectorAll("aside .sidebar a").forEach(a => a.classList.remove("active"));
             document.querySelector("aside .sidebar a[data-page='home']").classList.add("active");
        }
    }
    
    // --- Cek Status Login Saat Aplikasi Dimuat ---
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const hasUser = localStorage.getItem('userEmail');
    if (isLoggedIn) {
        navigateTo('dashboard-page');
    } else {
        navigateTo(hasUser ? 'login-page' : 'register-page'); 
    }

    document.querySelectorAll('[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(e.target.dataset.target);
        });
    });

    // --- Logika Otentikasi & Logout ---
    document.getElementById("registerForm").addEventListener("submit", function(e) {
      e.preventDefault();
      localStorage.setItem("userName", document.getElementById("regName").value);
      localStorage.setItem("userEmail", document.getElementById("regEmail").value);
      localStorage.setItem("userPassword", document.getElementById("regPassword").value);
      alert("Registrasi berhasil! Silakan login.");
      navigateTo('login-page');
    });

    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (email === localStorage.getItem('userEmail') && password === localStorage.getItem('userPassword')) {
            alert('Login berhasil!');
            localStorage.setItem('isLoggedIn', 'true');
            navigateTo('dashboard-page');
        } else {
            alert('Email atau Password salah!');
        }
    });

    document.getElementById("logoutBtn").addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('favorites'); 
      localStorage.removeItem('customKulinerData');
      alert("Anda telah keluar.");
      navigateTo('login-page');
    });
    
    function loadUserProfile() {
        document.getElementById("userName").textContent = localStorage.getItem("userName") || "Guest";
        document.getElementById("userEmail").textContent = localStorage.getItem("userEmail") || "-";
    }

    // --- Fungsi Membuat Card Kuliner ---
    function createKulinerCard(item, isFavoriteView = false) {
        const card = document.createElement("div");
        card.classList.add("card");
        
        const isFav = favorites.some(f => f.nama === item.nama);
        const favButtonText = isFav ? 'Hapus Favorite' : 'Tambah Favorite';
        const favButtonClass = isFav ? 'remove' : '';
        
        card.innerHTML = `
          <h3>${item.nama}</h3>
          <p>Asal: ${item.asal}</p>
          <button class="detailBtn">Lihat Resep</button>
          <button class="favBtn ${favButtonClass}">${favButtonText}</button>
        `;
        
        card.querySelector(".detailBtn").addEventListener("click", () => showResep(item));
        card.querySelector(".favBtn").addEventListener("click", () => {
          toggleFavorite(item);
          renderKuliner();
          if (isFavoriteView) renderFavorite(); 
        });
        
        return card;
    }

    // --- Render Daftar Kuliner (Beranda) ---
    function renderKuliner() {
      kulinerList.innerHTML = "";
      kulinerData.forEach(item => {
        kulinerList.appendChild(createKulinerCard(item));
      });
    }

    // --- Render Daftar Favorit ---
    function renderFavorite() {
      favoriteList.innerHTML = "";
      if (favorites.length === 0) {
          favoriteList.innerHTML = "<p style='text-align: center; grid-column: 1/-1;'>Belum ada makanan favorit.</p>";
          return;
      }
      favorites.forEach(item => {
        favoriteList.appendChild(createKulinerCard(item, true));
      });
    }

    function toggleFavorite(item) {
      const index = favorites.findIndex(f => f.nama === item.nama);
      if (index === -1) {
        favorites.push(item);
        alert(`${item.nama} ditambahkan ke Favorite!`);
      } else {
        favorites.splice(index, 1);
        alert(`${item.nama} dihapus dari Favorite!`);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    
    function showResep(item) {
      modalTitle.textContent = item.nama;
      modalImageCSS.style.setProperty('--bg-url', `url('${item.gambar || 'placeholder.jpg'}')`);

      // Pisahkan elemen bahan dan cara
      modalBahan.innerHTML = "";
      if (Array.isArray(item.bahan)) {
          item.bahan.forEach(b => {
            const li = document.createElement("li");
            li.textContent = b;
            modalBahan.appendChild(li);
          });
      }

      modalCara.innerHTML = "";
      if (Array.isArray(item.cara)) {
          item.cara.forEach(c => {
            const li = document.createElement("li");
            li.textContent = c;
            modalCara.appendChild(li);
          });
      }

      modal.style.display = "flex";
    }
    
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { 
        if (e.target == modal) modal.style.display = "none"; 
    };
    
    // --- Navigasi Sidebar (Perbaikan) ---
    document.querySelectorAll("aside .sidebar a[data-page]").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const targetPageId = link.dataset.page;
        
        if(targetPageId === 'logout') return;
        
        // Nonaktifkan semua sub-page (di dalam main)
        document.querySelectorAll("main .sub-page").forEach(p => p.classList.remove("active"));
        
        // Aktifkan sub-page target
        document.getElementById(targetPageId).classList.add("active");
        
        // Atur status aktif sidebar
        document.querySelectorAll("aside .sidebar a").forEach(a => a.classList.remove("active"));
        link.classList.add("active");
        
        // Panggil renderFavorite jika halaman yang dituju adalah Favorit
        if (targetPageId === 'favorite') {
            renderFavorite();
        }
      });
    });
    
    // --- Logika Tambah Kuliner (FIXED & NEW FEATURE) ---
    document.getElementById("addForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const nama = document.getElementById("namaMakanan").value;
        const asal = document.getElementById("asalDaerah").value;
        const gambarFile = document.getElementById("gambarKuliner").files[0]; 
        const bahanText = document.getElementById("resepMakanan").value;
        const caraText = document.getElementById("caraMembuat").value;

        // Pisahkan teks dengan baris baru untuk membuat array bahan/cara
        const bahanArray = bahanText.split('\n').filter(b => b.trim() !== '');
        const caraArray = caraText.split('\n').filter(c => c.trim() !== '');

        const reader = new FileReader();

        reader.onload = function(event) {
            const newRecipe = {
                nama: nama,
                asal: asal,
                gambar: event.target.result, // Data URL dari file gambar
                bahan: bahanArray,
                cara: caraArray
            };
            
            // 1. Tambahkan resep ke data utama
            kulinerData.push(newRecipe);
            
            // 2. Simpan data baru ke Local Storage (data yang dibuat user)
            const customDataToSave = kulinerData.filter(item => !initialKulinerData.includes(item));
            localStorage.setItem("customKulinerData", JSON.stringify(customDataToSave));

            // 3. Render ulang daftar kuliner
            renderKuliner(); 

            alert(`Kuliner "${nama}" berhasil ditambahkan dan ditampilkan di Beranda!`);
            document.getElementById("addForm").reset();
            
            // Opsional: Langsung pindah ke halaman Beranda setelah menambahkan
            // document.getElementById("home").classList.add("active"); 
        };

        // Mulai membaca file sebagai Data URL
        if (gambarFile) {
             reader.readAsDataURL(gambarFile);
        } else {
             // Fallback
             reader.onload({ target: { result: 'placeholder.jpg' } });
        }
    });
});