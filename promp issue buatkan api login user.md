buatka issue.md yang berisi perencanaan untuk nanti di implementasikan oleh junior programmer atau ai model yang lebih murah.

isi dari planning nya adalah sebagai berikut :

buat tabel sessions;
id integer auto increment
token varchar 255 unique not null (isinya UUID untuk token user yang login)
user_id integer (FK ke tabel users)
created_at timestamp default current_timestamp

buat API untuk login user

Endpoint : POST /api/users/login

Request Body:
{
    "email" : "adikara.adikara@gmail.com",
    "password": "rahasia"
}

Response Body (Success):
{
    "data":"token"
}

Response Body (Error):
{
    "Error":"Email atau password salah"
}

Struktur folder di dalam src
- routes : ini berisi routing elysia js
- services : ini berisi logic bisnis aplikasi


Struktur File
- routes : menggunakan format misal users-route.ts
- services : menggunakan format misal users-service.ts

Jelaskan tahapan-tahapan yang harus dilakukan untuk mengimplementasikan fitur ini, anggap nanti yang mengimplementasikan adalah junior programmer atau model AI yang lebih murah














