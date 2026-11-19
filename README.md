# Kit Karakter Puci, Kuci dan Putri Paramita

Kit referensi dan rancangan produksi Bahasa Indonesia untuk anak 5–10 tahun. Identitas kanon: Paramita 16 tahun/165 cm, Puci 105 cm biru muda, Kuci 100 cm kuning dan gempal. Tinggi tidak memasukkan topi/mahkota.

**Status:** identitas sumber tetap kanon; profil/belakang, sambungan pakaian, orientasi aksesori dalam rotasi, ekspresi tambahan dan plot “Tiga Pot untuk Taman” adalah USULAN/DRAFT yang membutuhkan approval. Izin membuat kit bukan persetujuan atas plot. Tidak ada video/audio final atau generasi berbayar.

## Struktur
- `AGENTS.md`: aturan kerja AI dan batas kanon.
- `karakter/karakter.md`: deskripsi visual asli + indeks kit dan koreksi dimensi teknis.
- `karakter/karakter.json`: identitas/palet/manifest mesin.
- `karakter/prompts.md`: prompt pack lengkap.
- `karakter/{puci,kuci,putri_paramita,lineup_tinggi}.{svg,png}`: delapan aset asli, tetap di tempatnya dan tidak diubah.
- `karakter/svg/`: sepuluh turunan SVG editabel dari generator.
- `karakter/png/`: sepuluh hasil raster RGBA.
- `karakter/build-validation.json`: bukti dimensi/alpha dan hash aset asli.
- `scripts/build.mjs`: build lokal tanpa paket npm tambahan.
- `brief/brief-70detik.md`: brief cerita draft.
- `naskah/naskah-70detik.md`: dialog dengan slot absolut 0–70 detik.
- `adegan/storyboard-70detik.md`: storyboard tertulis 7×10 detik lengkap dengan frame, kamera, aksi, audio dan kontinuitas.

## Aset hasil build
| Nama untuk setiap tokoh | Dimensi | Isi |
|---|---|---|
| `{id}_transparent.svg/png` | 1080×1920 | Cutout dari SVG asli, alpha transparan, tanpa awan/background/label/bayangan tanah |
| `{id}_turnaround.svg/png` | 1500×1020 | Depan asli, profil kanan dan belakang digambar baru; detail baru usulan |
| `{id}_expressions.svg/png` | 1540×650 | Empat wajah nyata: netral, senang, terkejut, khawatir; usulan |
| `lineup_canonical.svg/png` | 1080×1200 | Lineup terukur 4 px/cm dengan garis ubun-ubun yang benar |

ID: `puci`, `kuci`, `putri_paramita`. Sheet memiliki teks status/arah; hanya cutout yang tanpa label. Semua hasil memakai alpha transparan; buka sheet di atas latar putih agar outline/teks gelap terbaca.

## Build reproducible
Prasyarat: Node.js modern (ES modules) dan Chrome/Edge desktop lokal. Tidak ada instalasi npm, cloud rendering atau biaya API. Build tidak bergantung pada current working directory.

```sh
node scripts/build.mjs
```

Chrome Windows dipilih terlebih dahulu, lalu Edge. Jika executable ada di lokasi lain:

```sh
EDGE_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node scripts/build.mjs
```

Variabel `EDGE_PATH` dapat menunjuk Chrome ataupun Edge. Browser berjalan headless dengan profil sementara yang dihapus setelah build; konfigurasi browser/izin yang ada tidak diubah. Pada lingkungan ini Edge mengembalikan DOM kosong, Chrome berhasil. Jika renderer gagal, script gagal dengan pesan error; PNG sukses sebelumnya tidak boleh dianggap hasil terbaru sebelum build selesai.

Script mengekstrak grup karakter dari struktur SVG asli yang telah dibaca, mempertahankan pola kawung, menggambar detail usulan, dan memakai canvas browser untuk PNG. Tidak memakai penghapusan warna raster yang bisa ikut menghapus pompom/melati. Jika susunan grup sumber berubah, extractor harus disesuaikan; jangan menimpa aset asli.

## Validasi dan pengukuran
Build memeriksa PNG signature, ukuran, RGBA8 non-interlaced, mendekode semua scanline/filter PNG, menghitung piksel alpha 0/255/parsial dan memeriksa empat sudut alpha=0 pada cutout. Semua hasil harus memiliki piksel transparan dan opaque. SHA256 delapan aset asli sebelum/sesudah harus identik. Lihat hasil nyata di `karakter/build-validation.json`.

SVG asli 720×1280, PNG asli 1080×1920. Garis tinggi kurcaci pada lineup asli tampak melintasi topi karena ubun-ubun tertutup topi; transform sumber menunjukkan itu garis anatomi, bukan puncak topi. Lineup baru menyediakan skala eksplisit 4 px/cm memakai landmark ubun-ubun–telapak sumber dan rasio 165:105:100, bukan ukuran seluruh bounding box. Motif, telapak dan landmark mengabaikan tebal outline. Turnaround per tokoh bukan alat perbandingan tinggi antartokoh.

## Produksi 70 detik
Usulan master 1080×1920, 30 fps, 2100 frame; tujuh adegan × 300 frame. Storyboard memakai akhir interval frame eksklusif. Dialog/jeda/transisi harus masuk ke masing-masing 10 detik. Durasi struktur sudah tepat; durasi rekaman suara belum dapat divalidasi karena audio belum direkam.

Langkah berikut yang tetap membutuhkan approval/produksi: konfirmasi plot dan detail tambahan, gambar pose aksi menanam/menyiram, rekam suara berlisensi, animasikan, cek subtitle/kontinuitas, render 2100 frame. Tidak ada klaim bahwa kit ini sudah menjadi video final.
