# Dokumentasi Penggunaan Scraper K24

## Deskripsi

Script `scrape-k24.mjs` digunakan untuk melakukan scraping data produk dari
beberapa kategori di website K24Klik dan menyimpan hasilnya ke file
`k24-products.json`.

## Prasyarat

- Node.js v20 atau lebih baru
- Paket npm: `axios`, `cheerio`

## Instalasi

1. Pastikan Node.js sudah terpasang.
2. Install dependencies dengan perintah:
   ```pwsh
   npm install axios cheerio
   ```

## Cara Menjalankan

1. Pastikan file `scrape-k24.mjs` ada di folder kerja.
2. Jalankan script dengan perintah:
   ```pwsh
   node scrape-k24.mjs
   ```
3. Setelah selesai, hasil scraping akan tersimpan di file `k24-products.json`.

## Output

- File `k24-products.json` berisi array produk dengan struktur:
  ```json
  [
    {
      "name": "Nama Produk",
      "priceText": "Harga (teks)",
      "price": 12345,
      "unit": "Satuan",
      "image": "URL Gambar",
      "link": "URL Produk",
      "categorySource": "URL Kategori"
    },
    ...
  ]
  ```

## Catatan

- Script ini hanya mengambil data dari kategori yang sudah ditentukan di dalam
  array `urls`.
- Pastikan koneksi internet aktif saat menjalankan script.

## Kontak

Untuk pertanyaan atau pengembangan lebih lanjut, silakan hubungi pembuat script.
