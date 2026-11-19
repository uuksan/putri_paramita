# Konvensi AI untuk kit karakter

## Sumber kebenaran dan status
- Baca `karakter/karakter.md`, `karakter/karakter.json` dan SVG/PNG asli sebelum mengubah karakter.
- Identitas kanon berasal dari deskripsi asli dan fakta eksplisit pengguna. Bila gambar dan ukuran teknis berbeda, laporkan perbedaan; jangan mengubah kanon diam-diam.
- Paramita: remaja 16 tahun, 165 cm, kulit terang #FFE9DA, rambut hitam panjang, kebaya pink bernuansa Nusantara, kain kawung dan tumpal emas, tongkat bintang. Jangan menjadikannya anak kecil, dewasa, atau mengganti kebaya dengan gaun generik.
- Puci: 105 cm, ramping, biru muda, rambut cokelat muda, ujung topi ke kanan pada tampak depan dari penonton.
- Kuci: 100 cm, gempal, kuning, rambut cokelat tua, freckles, ujung topi ke kiri pada tampak depan dari penonton.
- Tinggi selalu ubun-ubun sampai telapak kaki, bukan puncak topi/mahkota. Gunakan 165:105:100 pada kedalaman kamera yang sama.
- Gaya kartun 2D flat, garis #3B2A20, palet pada deskripsi asli, tanpa gradien pada karakter. Background gradien pada aset asli bukan gaya wajib karakter.
- Profil/belakang, sambungan busana, orientasi aksesori dalam rotasi, ekspresi tambahan, lokasi, properti cerita dan plot baru berstatus USULAN/DRAFT sampai pengguna menyetujuinya. Jangan menulis bahwa plot telah disetujui.

## Cara kerja dan berkas
- Pertahankan delapan SVG/PNG asli di `karakter/`; jangan menimpa, menghapus atau memindahkannya secara destruktif.
- SVG/PNG di `karakter/svg/` dan `karakter/png/` adalah hasil build. Ubah generator `scripts/build.mjs`, bukan hanya hasilnya, lalu bangun ulang.
- Nama file snake_case; teks produksi dan dialog Bahasa Indonesia; ID karakter `puci`, `kuci`, `putri_paramita`.
- PNG cutout harus 1080×1920 RGBA, transparan, tanpa awan, latar, bayangan tanah, label nama atau bingkai label. Pertahankan properti tongkat dan efek pose yang melekat.
- Turnaround harus menggambar profil dengan satu mata, kontur hidung, kedalaman badan dan tampak belakang tanpa wajah. Dilarang memberi label samping/belakang pada depan yang sekadar dicerminkan.
- Ekspresi harus berbeda pada geometri mata, alis dan mulut, tidak cukup berbeda judulnya. Pertahankan rambut, warna kulit, freckles dan aksesori.
- Jalankan `node scripts/build.mjs`; cek `karakter/build-validation.json`, dimensi, piksel alpha 0/255, empat sudut transparan, serta SHA256 asli tidak berubah. Periksa visual hasil penting juga.
- Renderer hanya Edge/Chrome lokal atau pustaka lokal yang tersedia. Jangan memakai generator gambar/video berbayar, memasang dependensi atau mengirim aset keluar tanpa persetujuan baru.
- Jangan melakukan git commit/push, mengubah konfigurasi izin/keamanan, atau membuat perubahan di luar kit ini.

## Cerita dan pengiriman
- Sasaran anak 5–10 tahun; petualangan, persahabatan, edukasi ringan; dialog sederhana tanpa kekerasan, ejekan atau adegan berbahaya yang mudah ditiru.
- Video tepat 70 detik, 9:16, tujuh adegan masing-masing 10 detik. Usulan produksi: 1080×1920, 30 fps, 2100 frame; interval frame memakai batas akhir eksklusif.
- Plot harus berlabel DRAFT. Sihir membantu kerja sama, bukan menghapus proses belajar. Tidak ada klaim persetujuan pengguna atas cerita yang belum diberikan.
- Laporan akhir menyebut file yang dibuat, validasi yang benar-benar dijalankan dan blocker; jangan mengklaim video/audio sudah dirender jika hanya kit produksi yang dibuat.
