# Issue: Implementasi Fitur Registrasi User (API)

## 📌 Deskripsi Tugas
Tugas ini adalah membuat fitur registrasi *user* baru menggunakan framework ElysiaJS dan Drizzle ORM dengan database MySQL. Anda diharapkan untuk mengikuti arsitektur yang memisahkan antara *routing* dan *business logic*.

---

## 🗄️ Spesifikasi Database

Modifikasi atau buat skema database Drizzle (biasanya di `src/db/schema.ts`) untuk menambahkan tabel `users` dengan struktur berikut:

- `id`: integer, auto increment, primary key
- `name`: varchar(255), not null
- `email`: varchar(255), not null, unik
- `password`: varchar(255), not null (harus berupa *hash* dari bcrypt)
- `created_at`: timestamp, default `current_timestamp`

---

## 🌐 Spesifikasi API

Buat *endpoint* baru untuk registrasi *user*.

**Endpoint:**
`POST /api/users`

**Request Body (JSON):**
```json
{
    "name": "Rian",
    "email": "adikara.adikara@gmail.com",
    "password": "rahasia"
}
```

**Response Body (Success 200/201):**
```json
{
    "data": "OK"
}
```

**Response Body (Error - Jika email sudah terdaftar):**
```json
{
    "Error": "Email sudah terdaftar"
}
```

---

## 📂 Struktur Folder dan Penamaan File

Pastikan kode diletakkan dalam direktori `src` dengan pemisahan sebagai berikut:
- **`src/routes/`**: Tempat meletakkan *file routing* ElysiaJS.
  - Format penamaan: `[nama]-route.ts` (contoh: `users-route.ts`)
- **`src/services/`**: Tempat meletakkan *business logic* aplikasi.
  - Format penamaan: `[nama]-service.ts` (contoh: `users-service.ts`)

---

## 📋 Tahapan Implementasi (Step-by-Step)

Untuk menyelesaikan *issue* ini, ikuti langkah-langkah berikut secara berurutan:

### 1. Update Skema Database
- Buka file skema Drizzle Anda (biasanya di `src/db/schema.ts`).
- Sesuaikan atau ubah tabel `users` agar persis seperti spesifikasi di atas (termasuk penambahan kolom `password` dan `created_at`).
- Lakukan migrasi database (contohnya dengan menjalankan `drizzle-kit generate` dan `drizzle-kit push`) untuk menerapkan perubahan struktur tabel ini ke MySQL.

### 2. Persiapan Dependensi (Bcrypt)
- Kita membutuhkan algoritma bcrypt untuk menyimpan password.
- Jika *runtime* adalah Bun, direkomendasikan menggunakan bawaan Bun yaitu `Bun.password.hash` dan `Bun.password.verify` (menggunakan bcrypt secara default).
- Alternatifnya, instal package bcrypt: `bun add bcrypt` dan `bun add -d @types/bcrypt`.

### 3. Buat Service untuk User (`src/services/users-service.ts`)
- Buat file baru: `src/services/users-service.ts`.
- Di dalam file ini, buat sebuah fungsi asinkron (misal: `registerUser(data)`) yang menangani inti proses bisnis.
- **Logika fungsi:**
  1. Lakukan query ke database menggunakan Drizzle untuk mencari apakah `email` yang dikirim sudah ada di tabel `users`.
  2. Jika sudah ada, lemparkan *error* khusus atau kembalikan status gagal dengan pesan `"Email sudah terdaftar"`.
  3. Jika belum ada, lakukan *hashing* pada input password.
  4. Lakukan query *insert* ke tabel `users` dengan `name`, `email`, dan `hashed_password`.
  5. Kembalikan respons sukses jika penyimpanan berhasil.

### 4. Buat Route untuk User (`src/routes/users-route.ts`)
- Buat file baru: `src/routes/users-route.ts`.
- Inisialisasi *route* Elysia dengan prefix `/api/users`.
- Definisikan metode HTTP `POST /`.
- Tambahkan validasi *request body* dengan `t.Object` (dari `elysia`) untuk memastikan `name`, `email`, dan `password` bertipe data *string* dan tidak kosong.
- **Logika *handler* (Controller):**
  1. Panggil fungsi `registerUser` dari *service layer* (`users-service.ts`) dan lempar nilai *body* yang sudah tervalidasi.
  2. Bungkus pemanggilan dengan blok `try-catch`.
  3. Jika sukses, kembalikan objek `{"data": "OK"}`.
  4. Jika terjadi *error* karena email sudah terdaftar (tangkap jenis error dari *service*), kembalikan objek `{"Error": "Email sudah terdaftar"}` dengan HTTP Status Code `400 Bad Request`.

### 5. Mendaftarkan Route ke Aplikasi Utama (`src/index.ts`)
- Buka *entry point* aplikasi, biasanya di `src/index.ts`.
- Import file `users-route.ts`.
- Daftarkan *route* tersebut ke *instance* utama Elysia menggunakan metode `.use()`.

### 6. Pengujian (Testing)
- Jalankan server secara lokal dengan menjalankan `bun run dev`.
- Kirim HTTP POST Request ke `http://localhost:3000/api/users` menggunakan Postman, cURL, atau alat sejenisnya.
- Lakukan percobaan registrasi dengan data valid, cek apakah response sukses (`{"data": "OK"}`) dan data masuk ke MySQL dalam bentuk ter-hash.
- Lakukan percobaan registrasi kedua dengan *email yang sama*, cek apakah server mengembalikan pesan error (`{"Error": "Email sudah terdaftar"}`) dan memastikan aplikasi tidak *crash*.
