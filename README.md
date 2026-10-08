# Analisis Tren dan Perbandingan Model Forecasting Nilai Tukar Petani (NTP) Jawa Tengah 🌾

[![Dashboard](https://img.shields.io/badge/Interactive-Web%20Dashboard-emerald)](https://kartika-nur-savira.github.io/Forecasting-NTP-Jawa-Tengah-/)
[![Data Source](https://img.shields.io/badge/Data%20Source-BPS%20Jawa%20Tengah-blue)](https://jateng.bps.go.id)
[![Best Model](https://img.shields.io/badge/Best%20Model-SARIMAX(0%2C1%2C1)(2%2C0%2C0)[12]-indigo)](#performa-model-forecasting)

Repository ini berisi analisis time series komprehensif, eksplorasi data (EDA), dekomposisi musiman, benchmarking model peramalan (**Moving Average**, **Holt-Winters**, dan **SARIMA**), serta **Dashboard Web Interaktif** untuk **Nilai Tukar Petani (NTP) Provinsi Jawa Tengah** periode 2019–2026/2027.

---

## 👥 Tim Peneliti (Tim 5)
- **Kartika Nur Savira**
- **Diyanti Pratiwi**

---

## 📊 Ringkasan Temuan & Statistik Deskriptif

- **Rentang Pengamatan:** Januari 2019 – April 2026 (**88 Bulan**)
- **Pertumbuhan Total:** Naik dari `103.77` (Jan 2019) ke `114.90` (Apr 2026) (**+11.13 poin / +10.73%**)
- **Rata-rata NTP:** `107.61` (Standar Deviasi: `±6.11`, Koefisien Variasi: `5.68%`)
- **Titik Terendah (Krisis):** `98.71` (April 2021) — periode defisit riil akibat disrupsi pandemi COVID-19
- **Titik Tertinggi (Puncak):** `121.94` (Februari 2024) — lonjakan harga komoditas pangan
- **Distribusi Status:** **98.86% Bulan berada di zona Surplus** ($NTP > 100$)

---

## 🤖 Perbandingan Performa Model Forecasting (Test Set 18 Bulan)

Pengujian dilakukan dengan pembagian data *Train* (80% / 70 bulan) dan *Test* (20% / 18 bulan):

| Peringkat | Model Forecasting | Spesifikasi | MAE | RMSE | MAPE (%) | Status |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| 🥇 **1** | **SARIMA (Auto)** | **SARIMAX(0,1,1)(2,0,0)[12]** | **1.330** | **1.521** | **1.157%** | **Model Terbaik** |
| 🥈 2 | Holt-Winters | Triple Exponential Smoothing (Add) | 1.345 | 1.501 | 1.169% | Kompetitif |
| 🥉 3 | Moving Average | Rolling Window 12 Bulan (MA-12) | 1.558 | 1.879 | 1.351% | Baseline |

> **Kesimpulan Model:** Model **SARIMA** terpilih sebagai model terbaik karena menghasilkan nilai **MAPE terendah (1.157%)** berkat kemampuannya menangkap autokorelasi musiman 12 & 24 bulan secara optimal.

---

## 🔮 Proyeksi Masa Depan (Mei 2026 – Desember 2027)
- **Rentang Perkiraan Proyeksi:** `114.92 – 118.69` (dengan batas atas hingga `121.67`)
- **Rata-rata Proyeksi:** `117.12`
- **Outlook:** Nilai Tukar Petani Jawa Tengah diproyeksikan tetap berada dalam kondisi **Stabil dan Surplus ($NTP > 100$)** hingga akhir 2027.

---

## 🌐 Fitur Dashboard Interaktif

Dashboard web yang disertakan memiliki fitur-fitur berikut:
1. **Overview & KPI Eksekutif:** Kartu metrik utama, grafik time series dengan filter rentang tahun, dan distribusi surplus/defisit.
2. **Tren & Moving Averages:** Toggle interaktif untuk membandingkan NTP Aktual dengan MA-3, MA-6, dan MA-12.
3. **Analisis Pertumbuhan MoM & YoY:** Visualisasi lonjakan bulanan serta tabel 5 kenaikan & penurunan terbesar.
4. **Pola Musiman & Dekomposisi:** Radar chart musiman, lintasan bulanan per tahun, serta 4-panel dekomposisi time series (*Observed, Trend, Seasonal, Residual*).
5. **Evaluasi Model:** Perbandingan visual hasil prediksi 3 model pada data pengujian.
6. **Proyeksi Masa Depan:** Grafik proyeksi 20 bulan ke depan dengan *95% Confidence Interval*.
7. **What-If Policy Simulator:** Simulasi interaktif pengaruh guncangan harga gabah, inflasi pupuk/input, atau anomali cuaca (*El Niño/La Niña*).
8. **Data Explorer:** Tabel data 88 bulan lengkap dengan fitur live search, filter tahun/status, dan tombol unduh CSV.
9. **Infografis Viewer:** Modal pop-up untuk melihat poster infografis resmi Tim 5.

---

## 🚀 Cara Menjalankan Dashboard

### 1. Buka Langsung (Tanpa Instalasi)
Cukup buka file `index.html` menggunakan browser apapun:
```bash
open index.html
```

### 2. Jalankan Local Web Server
```bash
python3 -m http.server 8000
```
Lalu buka browser di [http://localhost:8000](http://localhost:8000).

---

## 📁 Struktur File
```text
├── index.html                     # Halaman utama web dashboard interaktif
├── app.js                         # Logika interaktif, ApexCharts, simulator, filter
├── data.js                        # Database komputasi terstruktur (88 bulan + proyeksi)
├── style.css                      # Styling kustom, glassmorphism & responsive layout
├── NTP_Jawa_Tengah_TIm_5.ipynb    # Jupyter Notebook analisis & pemodelan time series
├── NTP Provinsi Jawa Tengah.xlsx  # Dataset mentah BPS Provinsi Jawa Tengah
├── Infografis Tim 5.png           # Poster infografis resmi Tim 5
├── NTP Jawa Tengah .pdf           # Laporan dokumen lengkap riset
└── run_dashboard.sh               # Script launcher cepat
```

