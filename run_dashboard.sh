#!/bin/bash
echo "=========================================================="
echo " Membuka Dashboard NTP Jawa Tengah (Tim 5)..."
echo "=========================================================="

# Check if python3 is available
if command -v python3 &>/dev/null; then
    echo "Menjalankan local web server pada http://localhost:8000"
    open "http://localhost:8000" 2>/dev/null || xdg-open "http://localhost:8000" 2>/dev/null
    python3 -m http.server 8000
else
    echo "Membuka langsung file index.html di browser default..."
    open "index.html" 2>/dev/null || xdg-open "index.html" 2>/dev/null
fi

