# 🚛 PT. Fan Indonesia Sejahtera — Company Profile Website

Website Company Profile modern untuk perusahaan Logistics & Transport, dibangun dengan **Vue 3** (CDN) dan **PHP Native** REST API, dilengkapi **CMS Admin Dashboard** untuk mengelola konten website.

---

## 📸 Preview

| Halaman | Deskripsi |
|---------|-----------|
| **Home** | Hero banner + highlight layanan + stats counter + CTA |
| **About Us** | Visi, misi, nilai perusahaan |
| **Services** | 6 layanan logistik dengan card animasi |
| **Fleet** | Jenis armada (CDD, Fuso, Tronton, dll) |
| **Coverage** | Area jangkauan pengiriman seluruh Indonesia |
| **Clients** | Testimoni klien |
| **Contact** | Form kontak + info alamat |
| **Request Quote** | Form permintaan penawaran lengkap |
| **Admin CMS** | Dashboard untuk mengelola semua konten |

---

## 🛠 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Vue 3 (CDN) + Vue Router 4 (Hash Mode) |
| Backend | PHP 8.x Native (REST API) |
| Database | MySQL |
| Animations | AOS.js + CSS Transitions |
| Icons | Bootstrap Icons 1.11 |
| Fonts | Google Fonts — Inter |
| Server | Apache (Laragon) |

---

## 📁 Struktur Folder

```
website/
├── index.html                  ← Frontend SPA entry
├── database.sql                ← SQL schema + seed data
├── README.md
├── assets/
│   ├── css/
│   │   ├── main.css            ← Global styles & design system
│   │   └── admin.css           ← Admin dashboard styles
│   └── js/
│       ├── api.js              ← API wrapper (fetch)
│       ├── app.js              ← Vue 3 app + router
│       └── components/
│           ├── Navbar.js
│           ├── Footer.js
│           ├── Home.js
│           ├── AboutUs.js
│           ├── Services.js
│           ├── Fleet.js
│           ├── CoverageArea.js
│           ├── Clients.js
│           ├── ContactUs.js
│           └── RequestQuote.js
├── admin/
│   ├── login.html              ← Admin login page
│   ├── index.html              ← Admin dashboard SPA
│   └── assets/js/
│       └── admin-app.js        ← Admin Vue app logic
└── api/
    ├── .htaccess               ← Apache rewrite rules
    ├── index.php               ← API router
    ├── config/
    │   └── database.php        ← PDO connection
    ├── middleware/
    │   └── Auth.php            ← Session auth
    └── controllers/
        ├── AuthController.php
        ├── ContentController.php
        ├── ServicesController.php
        ├── FleetController.php
        ├── ClientsController.php
        ├── CoverageController.php
        ├── QuoteController.php
        └── ContactController.php
```

---

## 🚀 Cara Install & Menjalankan

### Prasyarat
- [Laragon](https://laragon.org/) (Apache + MySQL + PHP)
- PHP 8.x
- MySQL 5.7+

### Langkah-langkah

1. **Clone/copy project** ke folder `c:\laragon\www\website`

2. **Start Laragon** — pastikan Apache dan MySQL aktif

3. **Import database:**
   - Buka **phpMyAdmin** → `http://localhost/phpmyadmin`
   - Buat database baru: `db_logistics`
   - Import file `database.sql`
   - Atau via terminal:
     ```bash
     mysql -u root < database.sql
     ```

4. **Konfigurasi database** (jika perlu):
   Edit `api/config/database.php`:
   ```php
   private $host     = 'localhost';
   private $db_name  = 'db_logistics';
   private $username = 'root';
   private $password = '';
   ```

5. **Buka website:**
   - Frontend: `http://localhost/website/`
   - Admin CMS: `http://localhost/website/admin/login.html`

---

## 🔑 Login Admin

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `password` |

> ⚠️ **Penting:** Ganti password default sebelum deploy ke production!

---

## 📋 Fitur CMS Admin

| Menu | Fungsi |
|------|--------|
| **Dashboard** | Overview statistik (quotes, pesan masuk) |
| **Hero Banner** | Edit judul, subtitle, dan statistik hero |
| **About Us** | Edit visi, misi, deskripsi perusahaan |
| **Services** | CRUD layanan (tambah, edit, hapus) |
| **Fleet** | CRUD armada |
| **Clients** | CRUD klien & testimoni |
| **Coverage** | CRUD area jangkauan |
| **Quote Requests** | Lihat & kelola permintaan penawaran |
| **Messages** | Lihat & baca pesan dari form kontak |

---

## 🎨 Fitur & Animasi

- ✅ **Sticky Navbar** — transparan → solid saat scroll
- ✅ **AOS Animations** — fade-up, fade-left, zoom-in saat scroll
- ✅ **Hover Effects** — card lift + shadow, button scale
- ✅ **Loading Screen** — spinner animation saat load
- ✅ **Page Transitions** — fade in/out antar route
- ✅ **Particle Background** — animated particles di hero
- ✅ **Smooth Scrolling** — scroll halus antar section
- ✅ **Fully Responsive** — mobile friendly (375px, 768px, 1280px)
- ✅ **CTA Button** — "Request Quote" yang menonjol di navbar

---

## 🔌 API Endpoints

```
POST   /api/auth/login              ← Admin login
POST   /api/auth/logout             ← Admin logout
GET    /api/auth/check              ← Cek session

GET    /api/content/{section}       ← Get konten (hero, about, contact)
PUT    /api/content/{section}       ← Update konten (admin)

GET    /api/services                ← List layanan
POST   /api/services               ← Tambah (admin)
PUT    /api/services/{id}           ← Edit (admin)
DELETE /api/services/{id}           ← Hapus (admin)

GET    /api/fleet                   ← List armada
POST   /api/fleet                   ← Tambah (admin)
PUT    /api/fleet/{id}              ← Edit (admin)
DELETE /api/fleet/{id}              ← Hapus (admin)

GET    /api/clients                 ← List klien
GET    /api/coverage                ← List area
POST   /api/quotes                  ← Submit quote (public)
GET    /api/quotes                  ← List quotes (admin)
POST   /api/contact                 ← Submit pesan (public)
GET    /api/contact                 ← List pesan (admin)
GET    /api/stats                   ← Dashboard stats (admin)
```

---

## 📝 Catatan

- Website menggunakan **Vue CDN** (tanpa build tool), sehingga langsung jalan di PHP server tanpa perlu `npm install` atau build process
- Routing menggunakan **hash mode** (`#/about`, `#/services`, dll)
- Semua konten di-load via **JavaScript fetch** ke PHP API (tidak ada kode PHP di HTML)
- Admin menggunakan **PHP Session** untuk autentikasi
- Password di-hash menggunakan **bcrypt** (PHP `password_hash`)

---

## 📄 License

© 2026 PT. Fan Indonesia Sejahtera. All rights reserved.
