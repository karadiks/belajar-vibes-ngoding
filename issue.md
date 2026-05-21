# Issue: Implementasi Fitur Login User (API)

## 📌 Deskripsi Tugas
Tugas ini adalah membuat fitur *login* untuk *user* menggunakan framework ElysiaJS dan Drizzle ORM. Anda diharapkan untuk menambahkan tabel sesi (*sessions*) pada *database* dan membangun API *endpoint* untuk autentikasi *login* dengan arsitektur yang terpisah antara *routing* dan *business logic*.

---

## 🗄️ Spesifikasi Database

Modifikasi file skema database Drizzle (biasanya di `src/db/schema.ts`) dengan menambahkan tabel baru bernama `sessions`. Struktur tabelnya adalah sebagai berikut:

- `id`: integer, auto increment, primary key
- `token`: varchar(255), unique, not null (akan diisi dengan UUID sebagai token sesi *user* yang login)
- `user_id`: integer, not null (berfungsi sebagai Foreign Key yang merujuk ke tabel `users`)
- `created_at`: timestamp, default `current_timestamp`

*(Pastikan Anda membuat relasi atau referensi Foreign Key yang tepat antara tabel `sessions` dan tabel `users`).*

---

## 🌐 Spesifikasi API

Buat *endpoint* baru untuk autentikasi *login user*.

**Endpoint:**
`POST /api/users/login`

**Request Body (JSON):**
```json
{
    "email": "adikara.adikara@gmail.com",
    "password": "rahasia"
}
```

**Response Body (Success 200/201):**
```json
{
    "data": "token-uuid-anda-disini"
}
```

**Response Body (Error 400/401 - Jika kredensial salah):**
```json
{
    "Error": "Email atau password salah"
}
```

---

## 📂 Struktur Folder dan Penamaan File

Pastikan kode diletakkan dalam direktori `src` dengan standar penamaan sebagai berikut:
- **`src/routes/`**: Untuk *routing* API ElysiaJS.
  - Gunakan (atau modifikasi) file: `users-route.ts`
- **`src/services/`**: Untuk *business logic* aplikasi.
  - Gunakan (atau modifikasi) file: `users-service.ts`

---

## 📋 Tahapan Implementasi (Step-by-Step)

Untuk menyelesaikan *issue* ini, ikuti langkah-langkah berikut secara berurutan:

### 1. Update Skema Database (`src/db/schema.ts`)
- Tambahkan definisi tabel `sessions` menggunakan spesifikasi kolom di atas.
- Kaitkan kolom `user_id` dengan `id` dari tabel `users` (misalnya menggunakan referensi luar dari Drizzle).
- Lakukan sinkronisasi struktur ke database MySQL (misalnya dengan mengeksekusi `bun run db:push` atau migrasi secara manual).

### 2. Modifikasi Service (`src/services/users-service.ts`)
- Di dalam `users-service.ts`, buat fungsi asinkron baru (misal: `loginUser(data)`) yang menerima inputan `email` dan `password`.
- **Logika validasi & pembuatan sesi:**
  1. Cari data *user* berdasarkan `email` di tabel `users`.
  2. Jika *user* tidak ditemukan, lemparkan *error* `"Email atau password salah"`.
  3. Jika *user* ada, lakukan pengecekan kesesuaian sandi menggunakan *hash verifier* (seperti `Bun.password.verify`).
  4. Jika sandi tidak cocok, lemparkan *error* yang sama `"Email atau password salah"`.
  5. Jika validasi sukses, buat *token* string unik (UUID) menggunakan `crypto.randomUUID()`.
  6. Simpan *token* baru tersebut berserta `user_id` yang sesuai ke dalam tabel `sessions` menggunakan query Insert.
  7. Kembalikan data sukses berisikan objek: `{"data": token}`.

### 3. Modifikasi Route (`src/routes/users-route.ts`)
- Buka file *routing* `users-route.ts` yang sudah ada (dengan konfigurasi awal prefix `/api/users`).
- Tambahkan metode HTTP *POST* baru untuk `/login` (yang nantinya menjadi `/api/users/login`).
- Wajibkan validasi properti `email` dan `password` bertipe teks (string) pada *body* request menggunakan library TypeBox bawaan Elysia (`t.Object`).
- **Logika Handler:**
  1. Panggil fungsi `loginUser` dari *service*.
  2. Gunakan metode `try-catch` agar aplikasi tidak berhenti beroperasi ketika *error* dilemparkan.
  3. Jika sukses, teruskan objek kembalian langsung ke *client* (Berisi `{"data": token}`).
  4. Jika mendeteksi pesan kesalahan dari *service* bahwa "Email atau password salah", ubah status HTTP (*set.status*) menjadi `400` atau `401`, lalu kembalikan JSON berisi `{"Error": "Email atau password salah"}`.

### 4. Pengujian (Testing)
- Jalankan lokal aplikasi (`bun run dev`).
- Uji cobakan HTTP POST ke rute *login* dengan detail akun yang belum ada atau *password* yang keliru, pastikan mendapat respons sesuai spesifikasi yang diminta.
- Uji cobakan *login* yang benar (dengan akun uji yang sudah terdaftar), pastikan *token* UUID berhasil dimunculkan.
- Pastikan bahwa setelah pengujian sukses, UUID tersebut memang tersimpan rapi di dalam tabel `sessions` pada MySQL.
