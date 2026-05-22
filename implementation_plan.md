# Website Company Profile — Logistics & Transport

## Deskripsi
Website company profile modern untuk perusahaan Logistics & Transport dengan:
- **Frontend**: Vue 3 (CDN, tanpa build tool agar mudah dijalankan di PHP)
- **Backend**: PHP Native (REST API + CMS)
- **Database**: MySQL (via Laragon)
- **Animasi**: AOS.js + CSS transitions
- **Icons**: Bootstrap Icons
- **Fonts**: Google Fonts (Inter)

---

## Arsitektur Proyek

```
website/
├── index.html              ← Main SPA entry (Vue mounted di sini)
├── assets/
│   ├── css/
│   │   ├── main.css        ← Global styles, design tokens
│   │   ├── animations.css  ← AOS overrides & custom animations
│   │   └── admin.css       ← Admin dashboard styles
│   ├── js/
│   │   ├── app.js          ← Vue 3 App instance + router (hash mode)
│   │   ├── components/     ← Vue single-file-like components (JS)
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── Hero.js
│   │   │   ├── Services.js
│   │   │   ├── Fleet.js
│   │   │   ├── AboutUs.js
│   │   │   ├── CoverageArea.js
│   │   │   ├── Clients.js
│   │   │   ├── ContactUs.js
│   │   │   └── RequestQuote.js
│   │   └── api.js          ← Axios/fetch wrapper untuk PHP API
│   └── images/             ← Logo, fleet photos, client logos
├── admin/
│   ├── index.html          ← Admin SPA entry
│   ├── login.html          ← Admin login page
│   └── assets/
│       └── js/
│           └── admin-app.js ← Vue 3 admin dashboard
└── api/
    ├── index.php           ← Router utama API
    ├── config/
    │   └── database.php    ← DB connection
    ├── controllers/
    │   ├── AuthController.php
    │   ├── ContentController.php
    │   ├── ServicesController.php
    │   ├── FleetController.php
    │   ├── ClientsController.php
    │   └── QuoteController.php
    ├── middleware/
    │   └── Auth.php        ← JWT / session auth check
    └── .htaccess           ← Rewrite rules untuk clean URL
```

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend Framework | Vue 3 (CDN) |
| Routing | Vue Router 4 (CDN, hash mode) |
| HTTP Client | Axios (CDN) |
| Animations | AOS.js + CSS transitions |
| Icons | Bootstrap Icons 1.11 |
| Fonts | Google Fonts — Inter |
| Backend | PHP 8.x Native |
| Database | MySQL |
| Auth | PHP Session + token |
| Web Server | Apache (Laragon) |

---

## Halaman & Section

### Public Website (`index.html`)
| # | Route | Komponen | Keterangan |
|---|---|---|---|
| 1 | `#/` | Home | Hero banner, highlight services, stats counter, CTA |
| 2 | `#/about` | AboutUs | Visi misi, sejarah, tim |
| 3 | `#/services` | Services | Card layanan (Transportasi, Warehousing, dll) |
| 4 | `#/fleet` | Fleet | Galeri armada (CDD, Fuso, Tronton) |
| 5 | `#/coverage` | CoverageArea | Peta area + daftar kota |
| 6 | `#/clients` | Clients | Logo klien + testimoni |
| 7 | `#/contact` | ContactUs | Alamat, map, form kontak |
| 8 | `#/quote` | RequestQuote | Form permintaan penawaran lengkap |

### Admin Dashboard (`admin/index.html`)
| # | Section CMS | Keterangan |
|---|---|---|
| 1 | Dashboard | Overview statistik (pesan masuk, quote, dll) |
| 2 | Hero | Edit teks banner, gambar, CTA |
| 3 | About | Edit visi, misi, deskripsi |
| 4 | Services | CRUD layanan |
| 5 | Fleet | CRUD armada + upload foto |
| 6 | Coverage | Edit area pengiriman |
| 7 | Clients | CRUD logo klien + testimoni |
| 8 | Quote Requests | Lihat & kelola permintaan penawaran |
| 9 | Messages | Lihat pesan dari form kontak |

---

## Animasi & Efek

- **AOS.js** — `fade-up`, `fade-left`, `fade-right`, `zoom-in` saat scroll
- **Navbar** — Transparan → solid + shadow saat di-scroll
- **Hero** — Particle/gradient animated background
- **Counter** — Angka count-up saat masuk viewport
- **Cards** — `hover: translateY(-8px)` + box-shadow transition
- **Buttons** — `hover: scale(1.05)` + gradient shift
- **Loading screen** — Spinner/logo animation sebelum konten tampil
- **Page transitions** — Fade in/out antar route

---

## API Endpoints (PHP)

```
GET    /api/content/{section}         ← Get konten section (hero, about, dll)
PUT    /api/content/{section}         ← Update konten (admin)
GET    /api/services                  ← List semua layanan
POST   /api/services                  ← Tambah layanan (admin)
PUT    /api/services/{id}             ← Edit layanan (admin)
DELETE /api/services/{id}             ← Hapus layanan (admin)
GET    /api/fleet                     ← List armada
POST   /api/fleet                     ← Tambah armada (admin)
PUT    /api/fleet/{id}                ← Edit armada (admin)
DELETE /api/fleet/{id}                ← Hapus armada (admin)
GET    /api/clients                   ← List klien
GET    /api/coverage                  ← List area coverage
POST   /api/quotes                    ← Submit permintaan quote
GET    /api/quotes                    ← List quotes (admin)
POST   /api/contact                   ← Submit pesan kontak
GET    /api/messages                  ← List pesan (admin)
POST   /api/auth/login                ← Admin login
POST   /api/auth/logout               ← Admin logout
GET    /api/auth/check                ← Cek sesi aktif
```

---

## Database Schema

```sql
-- Konten dinamis per section
CREATE TABLE content (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section VARCHAR(50) UNIQUE,
  data JSON,
  updated_at TIMESTAMP
);

-- Layanan
CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  icon VARCHAR(100),
  title VARCHAR(200),
  description TEXT,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
);

-- Armada
CREATE TABLE fleet (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200),
  type VARCHAR(100),
  capacity VARCHAR(100),
  description TEXT,
  image_path VARCHAR(500),
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1
);

-- Klien
CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(200),
  logo_path VARCHAR(500),
  testimonial TEXT,
  client_position VARCHAR(200),
  is_active TINYINT(1) DEFAULT 1
);

-- Area coverage
CREATE TABLE coverage_areas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  region VARCHAR(100),
  cities TEXT,
  is_active TINYINT(1) DEFAULT 1
);

-- Request Quote
CREATE TABLE quote_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200),
  company VARCHAR(200),
  email VARCHAR(200),
  phone VARCHAR(50),
  origin VARCHAR(200),
  destination VARCHAR(200),
  cargo_type VARCHAR(200),
  weight VARCHAR(100),
  volume VARCHAR(100),
  notes TEXT,
  status ENUM('new','processing','done') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pesan kontak
CREATE TABLE contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200),
  email VARCHAR(200),
  phone VARCHAR(50),
  subject VARCHAR(300),
  message TEXT,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin user
CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  name VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Verification Plan

### Automated (Browser Testing)
- Load `http://localhost/website/` → semua section tampil
- Navigasi antar route berjalan lancar
- AOS animasi aktif saat scroll
- Form quote & kontak bisa submit
- Admin login di `http://localhost/website/admin/login.html`
- CMS bisa edit & save konten, perubahan tampil di frontend

### Manual Verification
- Cek responsive di mobile viewport (375px, 768px, 1280px)
- Navbar scroll behavior
- Hover effects pada card dan button
- Loading animation

---

## Open Questions

> [!IMPORTANT]
> **1. Nama Perusahaan**: Apa nama perusahaan yang akan digunakan? (Contoh: "PT. Logistik Nusantara")

> [!IMPORTANT]
> **2. Database**: Apakah MySQL sudah aktif di Laragon? Nama database yang ingin digunakan?

> [!NOTE]
> **3. Foto & Aset**: Apakah ada foto armada / logo klien yang ingin digunakan, atau menggunakan placeholder dulu?

> [!NOTE]
> **4. Peta Coverage**: Apakah menggunakan Google Maps embed, atau cukup daftar teks area coverage?
