// AgriData Jateng - Tim 5
// Interactive Application Logic

let charts = {};
let currentTheme = localStorage.getItem('ntp_theme') || 'light';

const tabTitles = {
  landing: 'Beranda & Panduan',
  overview: 'Overview Eksekutif',
  trends: 'Tren & Moving Average',
  growth: 'Fluktuasi MoM & YoY',
  seasonality: 'Musiman & Dekomposisi',
  models: 'Evaluasi Model',
  projections: 'Proyeksi 2026–2027',
  simulator: 'What-If Simulator',
  explorer: 'Data Explorer',
  insights: 'Rekomendasi Kebijakan',
  infografis: 'Infografis Tim 5'
};

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  lucide.createIcons();
  initSidebar();
  initOverviewSection();
  initTrendsSection();
  initGrowthSection();
  initSeasonalitySection();
  initModelsSection();
  initProjectionsSection();
  initSimulatorSection();
  initExplorerSection();
  initExportButtons();
});

// ==========================================
// THEME HANDLING (DARK / LIGHT)
// ==========================================
function initTheme() {
  if (currentTheme === 'dark' || (!('ntp_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    currentTheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    currentTheme = 'light';
  }

  const btn = document.getElementById('btnThemeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        currentTheme = 'light';
      } else {
        document.documentElement.classList.add('dark');
        currentTheme = 'dark';
      }
      localStorage.setItem('ntp_theme', currentTheme);
      updateAllChartsTheme();
      lucide.createIcons();
    });
  }
}

function updateAllChartsTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  Object.values(charts).forEach(chart => {
    if (chart && typeof chart.updateOptions === 'function') {
      chart.updateOptions({
        theme: { mode: isDark ? 'dark' : 'light' },
        chart: { background: 'transparent' }
      });
    }
  });
}

// ==========================================
// SIDEBAR & TAB NAVIGATION
// ==========================================
function initSidebar() {
  const sidebarBtns = document.querySelectorAll('.sidebar-nav-btn');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const btnMobile = document.getElementById('btnMobileSidebar');

  // Tab click listeners
  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      navigateToTab(target);
      
      // Close mobile sidebar on selection
      if (window.innerWidth < 768 && sidebar && backdrop) {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
      }
    });
  });

  // Mobile sidebar toggle
  if (btnMobile && sidebar && backdrop) {
    btnMobile.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
      backdrop.classList.toggle('hidden');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
    });
  }
}

function navigateToTab(tabId) {
  const sidebarBtns = document.querySelectorAll('.sidebar-nav-btn');
  const panes = document.querySelectorAll('.tab-pane');
  const breadcrumb = document.getElementById('breadcrumbCurrent');

  sidebarBtns.forEach(b => {
    if (b.getAttribute('data-tab') === tabId) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  panes.forEach(p => {
    if (p.id === `tab-${tabId}`) {
      p.classList.remove('hidden');
      p.classList.add('active');
    } else {
      p.classList.add('hidden');
      p.classList.remove('active');
    }
  });

  if (breadcrumb && tabTitles[tabId]) {
    breadcrumb.textContent = tabTitles[tabId];
  }

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger chart re-render / resize on visible tab
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    lucide.createIcons();
  }, 60);
}

// ==========================================
// TAB 1: OVERVIEW EKSEKUTIF
// ==========================================
function initOverviewSection() {
  const isDark = currentTheme === 'dark';
  const hist = NTP_DATA.historical;
  const categories = hist.map(d => d.period);
  const ntpValues = hist.map(d => d.ntp);

  // Overview Main Chart
  const options = {
    series: [{
      name: 'NTP Aktual',
      data: ntpValues
    }],
    chart: {
      type: 'area',
      height: 360,
      background: 'transparent',
      toolbar: {
        show: true,
        tools: { download: true, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true }
      },
      animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    colors: ['#10b981'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 95, 100]
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        rotate: -45,
        style: { fontSize: '11px', colors: '#64748b' },
        formatter: (val, opt) => {
          if (!val) return '';
          return (opt && opt % 6 === 0) ? val : (opt === categories.length - 1 ? val : '');
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 95,
      max: 125,
      labels: {
        formatter: val => val.toFixed(1),
        style: { colors: '#64748b', fontSize: '11px' }
      },
      title: { text: 'Indeks Nilai Tukar Petani', style: { color: '#64748b', fontSize: '12px' } }
    },
    annotations: {
      yaxis: [{
        y: 100,
        borderColor: '#f43f5e',
        strokeDashArray: 4,
        label: {
          borderColor: '#f43f5e',
          style: { color: '#fff', background: '#f43f5e', fontSize: '10px', fontWeight: 'bold' },
          text: 'Ambang Batas Impas (NTP = 100)'
        }
      }],
      points: [
        {
          x: 'Apr 2021',
          y: 98.71,
          marker: { size: 6, fillColor: '#f43f5e', strokeColor: '#fff', strokeWidth: 2 },
          label: {
            borderColor: '#f43f5e',
            offsetY: 0,
            style: { color: '#fff', background: '#f43f5e', fontSize: '10px' },
            text: 'Terendah: 98.71 (Apr 2021)'
          }
        },
        {
          x: 'Feb 2024',
          y: 121.94,
          marker: { size: 6, fillColor: '#6366f1', strokeColor: '#fff', strokeWidth: 2 },
          label: {
            borderColor: '#6366f1',
            offsetY: 0,
            style: { color: '#fff', background: '#6366f1', fontSize: '10px' },
            text: 'Tertinggi: 121.94 (Feb 2024)'
          }
        }
      ]
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: { formatter: val => `${val.toFixed(2)} poin` }
    },
    grid: { borderColor: isDark ? '#334155' : '#f1f5f9', strokeDashArray: 4 }
  };

  charts.overviewMain = new ApexCharts(document.querySelector("#chartOverviewMain"), options);
  charts.overviewMain.render();

  // Preset filter range handlers
  document.querySelectorAll('.filter-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-preset-btn').forEach(b => {
        b.classList.remove('active', 'bg-white', 'dark:bg-slate-700', 'shadow-sm', 'text-slate-900', 'dark:text-white');
        b.classList.add('text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.add('active', 'bg-white', 'dark:bg-slate-700', 'shadow-sm', 'text-slate-900', 'dark:text-white');
      btn.classList.remove('text-slate-600', 'dark:text-slate-400');

      const range = btn.getAttribute('data-range');
      let filtered = hist;
      if (range === '2019-2021') filtered = hist.filter(d => d.year <= 2021);
      else if (range === '2022-2024') filtered = hist.filter(d => d.year >= 2022 && d.year <= 2024);
      else if (range === '2024-2026') filtered = hist.filter(d => d.year >= 2024);

      charts.overviewMain.updateOptions({
        xaxis: { categories: filtered.map(d => d.period) }
      });
      charts.overviewMain.updateSeries([{ data: filtered.map(d => d.ntp) }]);
    });
  });

  // Surplus vs Deficit Donut Chart
  const surplusCount = hist.filter(d => d.ntp >= 100).length;
  const deficitCount = hist.filter(d => d.ntp < 100).length;
  const donutOptions = {
    series: [surplusCount, deficitCount],
    labels: ['Surplus (> 100)', 'Defisit (< 100)'],
    chart: { type: 'donut', height: 180, background: 'transparent' },
    colors: ['#10b981', '#f43f5e'],
    legend: { position: 'bottom', fontSize: '11px', labels: { colors: '#64748b' } },
    dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Bulan',
              formatter: () => `${hist.length} Bln`
            }
          }
        }
      }
    }
  };
  charts.surplusDonut = new ApexCharts(document.querySelector("#chartSurplusDonut"), donutOptions);
  charts.surplusDonut.render();
}

// ==========================================
// TAB 2: TREN & MOVING AVERAGES
// ==========================================
function initTrendsSection() {
  const isDark = currentTheme === 'dark';
  const hist = NTP_DATA.historical;
  const categories = hist.map(d => d.period);

  const seriesData = [
    { name: 'NTP Aktual', data: hist.map(d => d.ntp) },
    { name: 'MA-3', data: hist.map(d => d.ma3) },
    { name: 'MA-6', data: hist.map(d => d.ma6) },
    { name: 'MA-12', data: hist.map(d => d.ma12) },
  ];

  const options = {
    series: seriesData,
    chart: {
      type: 'line',
      height: 400,
      background: 'transparent',
      toolbar: { show: true }
    },
    colors: ['#3b82f6', '#f59e0b', '#f97316', '#a855f7'],
    stroke: {
      curve: 'smooth',
      width: [2.5, 2, 2, 2.5],
      dashArray: [0, 3, 4, 0]
    },
    xaxis: {
      categories: categories,
      labels: {
        rotate: -45,
        formatter: (val, opt) => (opt && opt % 6 === 0) ? val : (opt === categories.length - 1 ? val : '')
      }
    },
    yaxis: {
      min: 95,
      max: 125,
      labels: { formatter: val => val.toFixed(1) }
    },
    annotations: {
      yaxis: [{
        y: 100,
        borderColor: '#f43f5e',
        strokeDashArray: 4,
        label: { text: 'Batas NTP 100', style: { color: '#fff', background: '#f43f5e' } }
      }]
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: { formatter: val => val ? `${val.toFixed(2)}` : '-' }
    },
    grid: { borderColor: isDark ? '#334155' : '#f1f5f9' }
  };

  charts.trendsMA = new ApexCharts(document.querySelector("#chartTrendsMA"), options);
  charts.trendsMA.render();

  ['chkNTP', 'chkMA3', 'chkMA6', 'chkMA12'].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        const activeSeries = [];
        if (document.getElementById('chkNTP').checked) activeSeries.push(seriesData[0]);
        if (document.getElementById('chkMA3').checked) activeSeries.push(seriesData[1]);
        if (document.getElementById('chkMA6').checked) activeSeries.push(seriesData[2]);
        if (document.getElementById('chkMA12').checked) activeSeries.push(seriesData[3]);
        charts.trendsMA.updateSeries(activeSeries);
      });
    }
  });
}

// ==========================================
// TAB 3: MOM & YOY GROWTH
// ==========================================
function initGrowthSection() {
  const isDark = currentTheme === 'dark';
  const hist = NTP_DATA.historical.slice(1);
  const categories = hist.map(d => d.period);
  const momValues = hist.map(d => d.mom || 0);

  const momOptions = {
    series: [{
      name: 'Perubahan MoM (Poin)',
      data: momValues
    }],
    chart: {
      type: 'bar',
      height: 350,
      background: 'transparent',
      toolbar: { show: true }
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            { from: -10, to: -0.001, color: '#ef4444' },
            { from: 0, to: 10, color: '#10b981' }
          ]
        },
        columnWidth: '70%',
        borderRadius: 3
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories,
      labels: {
        rotate: -45,
        formatter: (val, opt) => (opt && opt % 6 === 0) ? val : (opt === categories.length - 1 ? val : '')
      }
    },
    yaxis: {
      title: { text: 'Perubahan (Poin)', style: { color: '#64748b' } },
      labels: { formatter: val => val.toFixed(2) }
    },
    grid: { borderColor: isDark ? '#334155' : '#f1f5f9' },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: { formatter: val => `${val >= 0 ? '+' : ''}${val.toFixed(2)} poin` }
    }
  };

  charts.momChart = new ApexCharts(document.querySelector("#chartMoM"), momOptions);
  charts.momChart.render();

  const yoyHist = NTP_DATA.historical.slice(12);
  const yoyOptions = {
    series: [{
      name: 'Pertumbuhan YoY (Poin)',
      data: yoyHist.map(d => d.yoy || 0)
    }],
    chart: {
      type: 'area',
      height: 300,
      background: 'transparent',
      toolbar: { show: true }
    },
    colors: ['#0d9488'],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 95, 100] }
    },
    stroke: { curve: 'smooth', width: 2.5 },
    xaxis: {
      categories: yoyHist.map(d => d.period),
      labels: {
        rotate: -45,
        formatter: (val, opt) => (opt && opt % 6 === 0) ? val : (opt === yoyHist.length - 1 ? val : '')
      }
    },
    yaxis: {
      title: { text: 'Pertumbuhan YoY (Poin)', style: { color: '#64748b' } },
      labels: { formatter: val => val.toFixed(2) }
    },
    annotations: {
      yaxis: [{ y: 0, borderColor: '#94a3b8', strokeDashArray: 2 }]
    },
    grid: { borderColor: isDark ? '#334155' : '#f1f5f9' },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: { formatter: val => `${val >= 0 ? '+' : ''}${val.toFixed(2)} poin YoY` }
    }
  };

  charts.yoyChart = new ApexCharts(document.querySelector("#chartYoY"), yoyOptions);
  charts.yoyChart.render();
}

// ==========================================
// TAB 4: MUSIMAN & DEKOMPOSISI
// ==========================================
function initSeasonalitySection() {
  const isDark = currentTheme === 'dark';
  const hist = NTP_DATA.historical;
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const yearSeries = years.map(y => {
    const yData = months.map((m, mIdx) => {
      const match = hist.find(d => d.year === y && d.month === mIdx + 1);
      return match ? match.ntp : null;
    });
    return { name: `Tahun ${y}`, data: yData };
  });

  const seasonalYearsOptions = {
    series: yearSeries,
    chart: { type: 'line', height: 360, background: 'transparent', toolbar: { show: true } },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: months },
    yaxis: { min: 95, max: 125, labels: { formatter: val => val.toFixed(1) } },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    grid: { borderColor: isDark ? '#334155' : '#f1f5f9' }
  };

  charts.seasonalYears = new ApexCharts(document.querySelector("#chartSeasonalYears"), seasonalYearsOptions);
  charts.seasonalYears.render();

  const seasonalFactors = Object.values(NTP_DATA.seasonality.seasonalIndices);
  const radarOptions = {
    series: [{ name: 'Faktor Musiman', data: seasonalFactors }],
    chart: { type: 'radar', height: 240, background: 'transparent' },
    labels: months,
    colors: ['#6366f1'],
    fill: { opacity: 0.3 },
    markers: { size: 3 },
    yaxis: { show: false },
    tooltip: { theme: isDark ? 'dark' : 'light', y: { formatter: val => `${val >= 0 ? '+' : ''}${val.toFixed(2)}` } }
  };
  charts.seasonalRadar = new ApexCharts(document.querySelector("#chartSeasonalRadar"), radarOptions);
  charts.seasonalRadar.render();

  const categories = hist.map(d => d.period);
  const decompOptions = {
    series: [
      { name: '1. Observed (NTP Aktual)', data: hist.map(d => d.ntp) },
      { name: '2. Trend (Jangka Panjang)', data: hist.map(d => d.trend) },
      { name: '3. Seasonal (Musiman 12-Bln)', data: hist.map(d => d.seasonal) },
      { name: '4. Residual (Noise / Acak)', data: hist.map(d => d.residual) }
    ],
    chart: { type: 'line', height: 480, background: 'transparent', toolbar: { show: true } },
    colors: ['#3b82f6', '#10b981', '#a855f7', '#f59e0b'],
    stroke: { curve: 'smooth', width: [2.5, 3, 1.8, 1.2] },
    xaxis: {
      categories: categories,
      labels: {
        rotate: -45,
        formatter: (val, opt) => (opt && opt % 6 === 0) ? val : (opt === categories.length - 1 ? val : '')
      }
    },
    yaxis: [
      { title: { text: 'Observed / Trend', style: { color: '#3b82f6' } }, min: 95, max: 125 },
      { show: false, min: 95, max: 125 },
      { opposite: true, title: { text: 'Komponen Siklus (Poin)', style: { color: '#a855f7' } }, min: -6, max: 6 },
      { show: false, min: -6, max: 6 }
    ],
    grid: { borderColor: isDark ? '#334155' : '#f1f5f9' },
    tooltip: { theme: isDark ? 'dark' : 'light' }
  };

  charts.decomposition = new ApexCharts(document.querySelector("#chartDecomposition"), decompOptions);
  charts.decomposition.render();
}

// ==========================================
// TAB 5: EVALUASI MODEL FORECASTING
// ==========================================
function initModelsSection() {
  const isDark = currentTheme === 'dark';
  const testPreds = NTP_DATA.testEvaluation.testPredictions;
  const categories = testPreds.map(d => d.period);

  const testCompOptions = {
    series: [
      { name: 'NTP Aktual (Test Set)', data: testPreds.map(d => d.actual) },
      { name: 'SARIMA (Auto)', data: testPreds.map(d => d.sarima) },
      { name: 'Holt-Winters', data: testPreds.map(d => d.hw) },
      { name: 'MA-12 Baseline', data: testPreds.map(d => d.ma) }
    ],
    chart: { type: 'line', height: 380, background: 'transparent', toolbar: { show: true } },
    colors: ['#1e293b', '#10b981', '#f59e0b', '#6366f1'],
    stroke: { curve: 'smooth', width: [3.5, 2.5, 2, 2], dashArray: [0, 4, 3, 5] },
    xaxis: { categories: categories },
    yaxis: { min: 110, max: 120, labels: { formatter: val => val.toFixed(1) } },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    grid: { borderColor: isDark ? '#334155' : '#f1f5f9' }
  };

  charts.testComp = new ApexCharts(document.querySelector("#chartTestComparison"), testCompOptions);
  charts.testComp.render();
}

// ==========================================
// TAB 6: PROYEKSI MASA DEPAN (2026–2027)
// ==========================================
function initProjectionsSection() {
  const isDark = currentTheme === 'dark';
  const histRecent = NTP_DATA.historical.slice(-24);
  const proj = NTP_DATA.projections;

  const allLabels = [...histRecent.map(d => d.period), ...proj.map(d => d.period)];

  const actualSeries = [...histRecent.map(d => d.ntp), ...Array(proj.length).fill(null)];
  const sarimaSeries = [...Array(histRecent.length - 1).fill(null), histRecent[histRecent.length - 1].ntp, ...proj.map(d => d.sarima)];
  const hwSeries = [...Array(histRecent.length - 1).fill(null), histRecent[histRecent.length - 1].ntp, ...proj.map(d => d.hw)];
  const maSeries = [...Array(histRecent.length - 1).fill(null), histRecent[histRecent.length - 1].ntp, ...proj.map(d => d.ma)];

  const projOptions = {
    series: [
      { name: 'Historis Aktual', type: 'line', data: actualSeries },
      { name: 'SARIMA Proyeksi', type: 'line', data: sarimaSeries },
      { name: 'Holt-Winters Proyeksi', type: 'line', data: hwSeries },
      { name: 'MA-12 Proyeksi', type: 'line', data: maSeries }
    ],
    chart: { type: 'line', height: 400, background: 'transparent', toolbar: { show: true } },
    colors: ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6'],
    stroke: { curve: 'smooth', width: [3, 2.5, 2, 2], dashArray: [0, 4, 3, 5] },
    xaxis: {
      categories: allLabels,
      labels: {
        rotate: -45,
        formatter: (val, opt) => (opt && opt % 3 === 0) ? val : (opt === allLabels.length - 1 ? val : '')
      }
    },
    yaxis: {
      min: 105,
      max: 125,
      labels: { formatter: val => val.toFixed(1) }
    },
    annotations: {
      xaxis: [{
        x: 'Apr 2026',
        borderColor: '#94a3b8',
        strokeDashArray: 3,
        label: { text: 'Awal Proyeksi (Mei 2026)', style: { color: '#fff', background: '#475569' } }
      }]
    },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    grid: { borderColor: isDark ? '#334155' : '#f1f5f9' }
  };

  charts.projFuture = new ApexCharts(document.querySelector("#chartProjectionsFuture"), projOptions);
  charts.projFuture.render();

  const selModel = document.getElementById('selForecastModel');
  if (selModel) {
    selModel.addEventListener('change', (e) => {
      const mode = e.target.value;
      if (mode === 'all') {
        charts.projFuture.updateSeries([
          { name: 'Historis Aktual', data: actualSeries },
          { name: 'SARIMA Proyeksi', data: sarimaSeries },
          { name: 'Holt-Winters Proyeksi', data: hwSeries },
          { name: 'MA-12 Proyeksi', data: maSeries }
        ]);
      } else if (mode === 'sarima') {
        charts.projFuture.updateSeries([
          { name: 'Historis Aktual', data: actualSeries },
          { name: 'SARIMA Proyeksi', data: sarimaSeries }
        ]);
      } else if (mode === 'hw') {
        charts.projFuture.updateSeries([
          { name: 'Historis Aktual', data: actualSeries },
          { name: 'Holt-Winters Proyeksi', data: hwSeries }
        ]);
      } else if (mode === 'ma') {
        charts.projFuture.updateSeries([
          { name: 'Historis Aktual', data: actualSeries },
          { name: 'MA-12 Proyeksi', data: maSeries }
        ]);
      }
    });
  }

  const tblBody = document.getElementById('tblProjectionsBody');
  if (tblBody) {
    tblBody.innerHTML = proj.map(p => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
        <td class="p-3 font-sans font-medium text-slate-800 dark:text-slate-200">${p.period}</td>
        <td class="p-3 font-bold text-emerald-600 dark:text-emerald-400">${p.sarima.toFixed(2)}</td>
        <td class="p-3 text-slate-500">${p.sarima_lower.toFixed(2)}</td>
        <td class="p-3 text-slate-500">${p.sarima_upper.toFixed(2)}</td>
        <td class="p-3 text-slate-700 dark:text-slate-300">${p.hw.toFixed(2)}</td>
        <td class="p-3 text-slate-700 dark:text-slate-300">${p.ma.toFixed(2)}</td>
        <td class="p-3 text-right font-sans"><span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Surplus</span></td>
      </tr>
    `).join('');
  }
}

// ==========================================
// TAB 7: WHAT-IF SIMULATOR
// ==========================================
function initSimulatorSection() {
  const isDark = currentTheme === 'dark';
  const baseProj = NTP_DATA.projections;
  const categories = baseProj.map(d => d.period);

  const simOptions = {
    series: [
      { name: 'SARIMA Baseline (Normal)', data: baseProj.map(d => d.sarima) },
      { name: 'Hasil Simulasi Skenario', data: baseProj.map(d => d.sarima) }
    ],
    chart: { type: 'area', height: 350, background: 'transparent', toolbar: { show: false } },
    colors: ['#94a3b8', '#10b981'],
    stroke: { curve: 'smooth', width: [2, 3], dashArray: [4, 0] },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 95, 100] }
    },
    xaxis: { categories: categories },
    yaxis: { min: 90, max: 135, labels: { formatter: val => val.toFixed(1) } },
    annotations: {
      yaxis: [{
        y: 100,
        borderColor: '#f43f5e',
        strokeDashArray: 3,
        label: { text: 'Batas Impas 100', style: { color: '#fff', background: '#f43f5e' } }
      }]
    },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    grid: { borderColor: isDark ? '#334155' : '#f1f5f9' }
  };

  charts.simulator = new ApexCharts(document.querySelector("#chartSimulator"), simOptions);
  charts.simulator.render();

  function updateSimulation() {
    const outputShock = parseFloat(document.getElementById('rngOutputShock').value);
    const inputShock = parseFloat(document.getElementById('rngInputShock').value);
    const climateShock = parseFloat(document.getElementById('rngClimateShock').value);

    document.getElementById('lblOutputShock').textContent = `${outputShock >= 0 ? '+' : ''}${outputShock.toFixed(1)}%`;
    document.getElementById('lblInputShock').textContent = `${inputShock >= 0 ? '+' : ''}${inputShock.toFixed(1)}%`;
    document.getElementById('lblClimateShock').textContent = `${climateShock >= 0 ? '+' : ''}${climateShock.toFixed(1)}`;

    const simulatedData = baseProj.map(d => {
      const val = (d.sarima * (1 + outputShock / 100) / (1 + inputShock / 100)) + climateShock;
      return parseFloat(val.toFixed(2));
    });

    const avgSim = (simulatedData.reduce((a, b) => a + b, 0) / simulatedData.length).toFixed(2);
    const badge = document.getElementById('simSummaryBadge');
    
    if (avgSim >= 100) {
      badge.className = 'px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      badge.textContent = `Skenario Surplus: Rata-rata Proyeksi ${avgSim}`;
    } else {
      badge.className = 'px-2.5 py-1 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      badge.textContent = `Peringatan Defisit: Rata-rata Proyeksi ${avgSim} (< 100)`;
    }

    charts.simulator.updateSeries([
      { name: 'SARIMA Baseline (Normal)', data: baseProj.map(d => d.sarima) },
      { name: 'Hasil Simulasi Skenario', data: simulatedData }
    ]);
  }

  ['rngOutputShock', 'rngInputShock', 'rngClimateShock'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateSimulation);
  });

  document.getElementById('btnResetSim').addEventListener('click', () => {
    document.getElementById('rngOutputShock').value = 0;
    document.getElementById('rngInputShock').value = 0;
    document.getElementById('rngClimateShock').value = 0;
    updateSimulation();
  });
}

// ==========================================
// TAB 8: DATA EXPLORER & TABLE
// ==========================================
function initExplorerSection() {
  renderTableData();

  document.getElementById('selFilterYear').addEventListener('change', renderTableData);
  document.getElementById('selFilterStatus').addEventListener('change', renderTableData);
  document.getElementById('txtSearchTable').addEventListener('input', renderTableData);
}

function renderTableData() {
  const selYear = document.getElementById('selFilterYear').value;
  const selStatus = document.getElementById('selFilterStatus').value;
  const search = document.getElementById('txtSearchTable').value.toLowerCase();

  let filtered = NTP_DATA.historical.filter(d => {
    if (selYear !== 'all' && d.year.toString() !== selYear) return false;
    if (selStatus === 'surplus' && d.ntp < 100) return false;
    if (selStatus === 'deficit' && d.ntp >= 100) return false;
    if (search && !d.period.toLowerCase().includes(search)) return false;
    return true;
  });

  const tbody = document.getElementById('tblExplorerBody');
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="12" class="p-6 text-center text-slate-400">Tidak ada data yang cocok dengan kriteria filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((d, idx) => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
        <td class="p-3 text-slate-400">${idx + 1}</td>
        <td class="p-3 font-sans font-medium text-slate-800 dark:text-slate-200">${d.period}</td>
        <td class="p-3 font-bold ${d.ntp >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">${d.ntp.toFixed(2)}</td>
        <td class="p-3 ${d.mom > 0 ? 'text-emerald-600' : (d.mom < 0 ? 'text-rose-600' : 'text-slate-400')}">${d.mom !== null ? (d.mom >= 0 ? '+' : '') + d.mom.toFixed(2) : '-'}</td>
        <td class="p-3 ${d.yoy > 0 ? 'text-emerald-600' : (d.yoy < 0 ? 'text-rose-600' : 'text-slate-400')}">${d.yoy !== null ? (d.yoy >= 0 ? '+' : '') + d.yoy.toFixed(2) : '-'}</td>
        <td class="p-3 text-slate-600 dark:text-slate-400">${d.ma3 !== null ? d.ma3.toFixed(2) : '-'}</td>
        <td class="p-3 text-slate-600 dark:text-slate-400">${d.ma6 !== null ? d.ma6.toFixed(2) : '-'}</td>
        <td class="p-3 text-slate-600 dark:text-slate-400">${d.ma12 !== null ? d.ma12.toFixed(2) : '-'}</td>
        <td class="p-3 text-slate-600 dark:text-slate-400">${d.trend !== null ? d.trend.toFixed(2) : '-'}</td>
        <td class="p-3 text-slate-600 dark:text-slate-400">${d.seasonal !== null ? (d.seasonal >= 0 ? '+' : '') + d.seasonal.toFixed(2) : '-'}</td>
        <td class="p-3 text-slate-600 dark:text-slate-400">${d.residual !== null ? (d.residual >= 0 ? '+' : '') + d.residual.toFixed(2) : '-'}</td>
        <td class="p-3 text-right font-sans">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${d.ntp >= 100 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'}">
            ${d.status.split(' ')[0]}
          </span>
        </td>
      </tr>
    `).join('');
  }
}

// ==========================================
// EXPORT DATA (CSV)
// ==========================================
function initExportButtons() {
  const exportCsv = (filename, rows) => {
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const btnExport = document.getElementById('btnExportCSV');
  const btnExportTable = document.getElementById('btnExportTableCSV');

  const handler = () => {
    const headers = ["Index", "Tanggal", "Tahun", "Bulan", "Periode", "NTP", "MoM", "YoY", "MA_3", "MA_6", "MA_12", "Trend", "Seasonal", "Residual", "Status"];
    const rows = [headers];

    NTP_DATA.historical.forEach((d, i) => {
      rows.push([
        i + 1,
        d.date,
        d.year,
        d.month,
        `"${d.period}"`,
        d.ntp,
        d.mom || "",
        d.yoy || "",
        d.ma3 || "",
        d.ma6 || "",
        d.ma12 || "",
        d.trend || "",
        d.seasonal || "",
        d.residual || "",
        `"${d.status}"`
      ]);
    });

    exportCsv("NTP_Jawa_Tengah_2019_2026.csv", rows);
  };

  if (btnExport) btnExport.addEventListener('click', handler);
  if (btnExportTable) btnExportTable.addEventListener('click', handler);
}

// ==========================================
// CONFETTI EFFECT
// ==========================================
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}
