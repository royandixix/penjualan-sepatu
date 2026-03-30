# 👟 OKKO - Toko Sepatu Online

> 🚧 **PROYEK INI MASIH DALAM TAHAP PENGERJAAN / WORK IN PROGRESS** 🚧
>
> Beberapa fitur mungkin belum berfungsi sepenuhnya atau masih dalam proses pengembangan. Kontribusi dan saran sangat diterima!

Aplikasi web toko sepatu berbasis **AngularJS** (frontend) dan **Node.js + Express** (backend), lengkap dengan fitur toko, keranjang belanja, checkout, dan panel admin.

---

## 🚀 Fitur Utama

### 👤 User
- Browsing produk di halaman **Shop**
- Melihat **Produk Populer**
- Menambah produk ke **Keranjang**
- Proses **Checkout** & pemesanan
- **Login / Register** akun

### 🛠️ Admin
- Login & Register admin
- **Dashboard** ringkasan data
- Manajemen **Produk** (tambah, edit, hapus, upload gambar)
- Manajemen **Pesanan** (lihat daftar & detail)

---

## 🛠️ Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | AngularJS 1.8.2, Bootstrap 5, Font Awesome |
| Backend | Node.js, Express 5 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Upload | Multer |
| Database | JSON file (products.json, users.json, orders.json) |
| Chart | Chart.js |
| Translate | Google Translate Widget |

---

## 📁 Struktur Folder

```
penjualan-sepatu/
├── backend/
│   ├── app.js                   # Entry point server Express
│   ├── data/
│   │   ├── products.json
│   │   ├── users.json
│   │   └── orders.json
│   └── assets/images/products/  # Gambar produk upload
├── css/
│   ├── admin.css
│   └── user.css
├── js/
│   ├── services/
│   │   ├── auth/AuthService.js
│   │   ├── cart/CartService.js
│   │   ├── order/OrderService.js
│   │   └── product/ProductService.js
│   ├── controllers/
│   │   ├── user/
│   │   │   ├── shop/ShopController.js
│   │   │   ├── cart/CartController.js
│   │   │   ├── checkout/CheckoutController.js
│   │   │   └── produk-populer/ProdukPopulerController.js
│   │   ├── admin/
│   │   │   ├── dashboard/AdminDashboardController.js
│   │   │   ├── product/ProductsAdminController.js
│   │   │   └── order/AdminOrdersController.js
│   │   └── auth/admin/
│   │       ├── AdminLoginController.js
│   │       └── AdminRegisterController.js
│   └── directives/
│       └── productCardDirective.js
├── views/
│   ├── admin/
│   ├── user/
│   ├── layouts/
│   └── partials/
├── public/images/
├── index.html                   # Entry point frontend
├── app.js                       # Konfigurasi AngularJS & routing
└── package.json
```

---

## ⚙️ Cara Menjalankan

### 1. Clone Repositori

```bash
git clone https://github.com/royandixix/penjualan-sepatu.git
cd penjualan-sepatu
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Jalankan Backend (Server Express)

```bash
# Mode production
npm start

# Mode development (dengan nodemon)
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

### 4. Jalankan Frontend

Buka file `index.html` langsung di browser, atau gunakan ekstensi **Live Server** di VS Code.

> ⚠️ Pastikan backend sudah berjalan sebelum membuka frontend.

---

## 🔌 API Endpoints

### Produk
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/products` | Ambil semua produk |
| GET | `/api/products/:id` | Ambil produk by ID |
| POST | `/api/products` | Tambah produk (+ upload gambar) |
| PUT | `/api/products/:id` | Update produk |
| DELETE | `/api/products/:id` | Hapus produk |

### Pesanan
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/orders` | Ambil semua pesanan |
| POST | `/api/orders` | Buat pesanan baru |

### Autentikasi
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/register` | Daftar akun baru |
| POST | `/api/login` | Login & dapatkan token |

---

## 🔐 Autentikasi

- Menggunakan **JWT Bearer Token**
- Token disimpan di `localStorage`
- Setiap request ke API admin otomatis menyertakan token via HTTP Interceptor
- Session otomatis dihapus jika token expired (HTTP 401/403)

---

## 🗺️ Routing Frontend

| Path | Halaman |
|---|---|
| `/shop` | Halaman toko (default) |
| `/produk-populer` | Produk populer |
| `/cart` | Keranjang belanja |
| `/checkout/:id` | Checkout |
| `/login` | Login user |
| `/register` | Register user |
| `/admin/login` | Login admin |
| `/admin/dashboard` | Dashboard admin |
| `/admin/products` | Kelola produk |
| `/admin/orders` | Kelola pesanan |

---

## 📦 Dependensi

```json
{
  "express": "^5.2.1",
  "bcryptjs": "^3.0.3",
  "jsonwebtoken": "^9.0.3",
  "multer": "^2.1.0",
  "cors": "^2.8.6",
  "bootstrap": "^5.3.8"
}
```

---

## 📌 Status Pengerjaan

> ⚠️ Proyek ini **belum selesai** dan masih aktif dikerjakan.

| Fitur | Status |
|---|---|
| Halaman Shop | 🔄 Dalam Pengerjaan |
| Produk Populer | 🔄 Dalam Pengerjaan |
| Keranjang Belanja | 🔄 Dalam Pengerjaan |
| Checkout | 🔄 Dalam Pengerjaan |
| Login / Register User | 🔄 Dalam Pengerjaan |
| Dashboard Admin | 🔄 Dalam Pengerjaan |
| Manajemen Produk | 🔄 Dalam Pengerjaan |
| Manajemen Pesanan | 🔄 Dalam Pengerjaan |
| Integrasi Database | ❌ Belum Dikerjakan |
| Payment Gateway | ❌ Belum Dikerjakan |

**Catatan lain:**
- Data saat ini disimpan dalam file JSON lokal (belum menggunakan database seperti MongoDB/MySQL)
- Semua user yang register otomatis mendapatkan role `admin` (perlu diperbaiki)
- Tampilan UI masih bisa berubah sewaktu-waktu

---

## 👨‍💻 Author

**royandixix** — [GitHub](https://github.com/royandixix)