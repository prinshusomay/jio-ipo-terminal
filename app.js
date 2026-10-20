// Access data attached to window.JioData with defensive safety
function getDataStore() {
  if (window.JioData) return window.JioData;
  return {
    company: { name: "Reliance Jio Infocomm Limited", cin: "U72900GJ2019PLC110816", registeredOffice: "Office-101, Saffron, Ambawadi, Ahmedabad 380 006, Gujarat", corporateOffice: "TC-22, Reliance Corporate Park, Ghansoli, Navi Mumbai 400 701, Maharashtra", snapshot: { tagline: "India's premier digital technology platform powering pan-India 5G and high-speed broadband.", subscribers: 524.4, fiveGSubscribers: 268.5, fixedBroadband: 27.1, marketTam: "$1.4 Trillion", businessModel: "Unified Digital Platform" } },
    financials: { pnl: { revenueFromOperations: { fy24: 1095581, fy25: 1282184, fy26: 1468853 }, ebitda: { fy24: 549587, fy25: 641700, fy26: 762554 }, pat: { fy24: 214340, fy25: 261203, fy26: 300527 } } },
    ratios: { ebitdaMargin: { fy26: 51.91 }, ronw: { fy26: 9.42 }, netLeverage: { fy26: 0.36 } },
    peerComparison: { peers: [] },
    governance: { board: [] },
    management: { kmps: [], seniorLeadership: [] },
    ipoDetails: { freshIssue: "Up to 270,000,000 Equity Shares", objectsOfIssue: [], brlms: [] },
    shareholding: { categories: [] },
    spectrum: { bandsSummary: [], circles: [] },
    riskFactors: { list: [] },
    litigation: { taxSummary: { totalClaims: 969, totalAmount: "₹497,263 Million" }, keyCases: [] },
    timeline: [],
    subsidiaries: { key: [] }
  };
}

// Metric Dictionary for Screener Multi-Ratio Comparison Engine
const screenerMetrics = {
  revenue: { name: 'Revenue from Operations (₹M)', unit: '₹M', isPct: false, data: [1095581, 1282184, 1468853, 1680000, 1920000], color: '#38BDF8' },
  ebitda: { name: 'EBITDA (₹M)', unit: '₹M', isPct: false, data: [549587, 641700, 762554, 880000, 1010000], color: '#34D399' },
  pat: { name: 'Profit After Tax (PAT) (₹M)', unit: '₹M', isPct: false, data: [214340, 261203, 300527, 355000, 420000], color: '#A78BFA' },
  ebitdaMargin: { name: 'EBITDA Margin (%)', unit: '%', isPct: true, data: [50.16, 50.05, 51.91, 52.38, 52.60], color: '#FBBF24' },
  patMargin: { name: 'PAT Margin (%)', unit: '%', isPct: true, data: [19.56, 20.37, 20.46, 21.13, 21.88], color: '#F87171' },
  arpu: { name: 'Monthly ARPU (₹)', unit: '₹', isPct: false, data: [171.0, 178.5, 181.7, 195.0, 210.0], color: '#38BDF8' },
  subscribers: { name: 'Subscribers (Million)', unit: 'M', isPct: false, data: [470.9, 481.8, 524.4, 550.0, 580.0], color: '#60A5FA' },
  fiveGSubs: { name: '5G SA Subscribers (Million)', unit: 'M', isPct: false, data: [90.0, 150.0, 268.5, 340.0, 410.0], color: '#34D399' },
  eps: { name: 'Basic EPS (₹)', unit: '₹', isPct: false, data: [23.96, 29.21, 33.63, 39.71, 46.98], color: '#FBBF24' },
  nav: { name: 'NAV per Share (₹)', unit: '₹', isPct: false, data: [310.85, 340.11, 373.66, 412.00, 458.00], color: '#A78BFA' },
  netLeverage: { name: 'Net Debt / EBITDA (x)', unit: 'x', isPct: false, data: [0.88, 0.52, 0.36, 0.18, 0.05], color: '#F87171' },
  ronw: { name: 'Return on Net Worth (%)', unit: '%', isPct: true, data: [8.02, 8.97, 9.42, 10.15, 10.90], color: '#34D399' }
};

const screenerYears = ['FY2024', 'FY2025', 'FY2026', 'FY2027E', 'FY2028E'];

// Global Application State
const state = {
  activeView: 'dashboard',
  selectedYear: 'ALL',
  currency: 'INR', // 'INR' or 'USD'
  usdRate: 96.68, // 1 USD = 96.68 INR (Primary Source DB: INR, USD = INR / 96.68)
  searchQuery: '',
  simArpu: 181.7,
  simSubs: 524.4,
  simMargin: 51.91,
  screenerRatio1: 'revenue',
  screenerRatio2: 'ebitda'
};

// Currency Converter Helper (Formula: USD = INR / 96.68)
function formatMoney(amountInInrMillions, options = {}) {
  const isUsd = state.currency === 'USD';
  const rate = state.usdRate || 96.68;
  const valInr = typeof amountInInrMillions === 'number' ? amountInInrMillions : parseFloat(amountInInrMillions) || 0;

  if (isUsd) {
    const valUsd = valInr / rate;
    if (options.arpu) {
      // Monthly ARPU conversion (₹181.7 / 96.68 -> $1.88)
      return `$${(valInr / rate).toFixed(2)}`;
    }
    if (valUsd >= 1000) {
      return `$${(valUsd / 1000).toFixed(2)}B`;
    }
    return `$${Math.round(valUsd).toLocaleString()}M`;
  } else {
    if (options.arpu) {
      return `₹${valInr.toFixed(1)}`;
    }
    if (valInr >= 100000) {
      return `₹${Math.round(valInr).toLocaleString()}M`;
    }
    return `₹${Math.round(valInr).toLocaleString()}M`;
  }
}

// Currency Toggle Control Initialization
function initCurrencyToggle() {
  const btnInr = document.getElementById('currBtnInr');
  const btnUsd = document.getElementById('currBtnUsd');

  if (!btnInr || !btnUsd) return;

  btnInr.addEventListener('click', () => {
    if (state.currency === 'INR') return;
    state.currency = 'INR';
    btnInr.className = "curr-btn active text-xs font-bold px-3 py-1 rounded-full text-white bg-emerald-600 transition-all";
    btnUsd.className = "curr-btn text-xs font-bold px-3 py-1 rounded-full text-gray-400 hover:text-white transition-all";
    renderCurrentView();
  });

  btnUsd.addEventListener('click', () => {
    if (state.currency === 'USD') return;
    state.currency = 'USD';
    btnUsd.className = "curr-btn active text-xs font-bold px-3 py-1 rounded-full text-white bg-emerald-600 transition-all";
    btnInr.className = "curr-btn text-xs font-bold px-3 py-1 rounded-full text-gray-400 hover:text-white transition-all";
    renderCurrentView();
  });
}

// Initialize Application safely
function initApp() {
  initNavigation();
  initYearFilters();
  initCurrencyToggle();
  initSearchModal();
  renderCurrentView();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function attachCursorGlareListeners() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    if (!card.querySelector('.cursor-glare')) {
      const glare = document.createElement('div');
      glare.className = 'cursor-glare';
      card.appendChild(glare);
    }
    card.addEventListener('mousemove', (e) => {
      const glare = card.querySelector('.cursor-glare');
      if (glare) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glare.style.left = `${x}px`;
        glare.style.top = `${y}px`;
      }
    });
  });
}

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      if (view) {
        navItems.forEach(nav => {
          nav.classList.remove('active', 'text-sky-400', 'border-r-4', 'border-sky-400', 'bg-white/5');
          nav.classList.add('text-gray-400');
        });
        item.classList.add('active', 'text-sky-400', 'border-r-4', 'border-sky-400', 'bg-white/5');
        item.classList.remove('text-gray-400');
        state.activeView = view;
        renderCurrentView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

function initYearFilters() {
  const yearBtns = document.querySelectorAll('.year-btn');
  yearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      yearBtns.forEach(b => {
        b.classList.remove('active', 'bg-sky-600', 'text-white');
        b.classList.add('text-gray-400');
      });
      btn.classList.add('active', 'bg-sky-600', 'text-white');
      btn.classList.remove('text-gray-400');
      state.selectedYear = btn.getAttribute('data-year');
      renderCurrentView();
    });
  });
}

function initSearchModal() {
  const openSearchBtn = document.getElementById('openSearch');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');

  if (openSearchBtn) openSearchBtn.addEventListener('click', openSearch);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal && searchModal.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape' && searchModal && searchModal.classList.contains('open')) {
      closeSearch();
    }
  });

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderSearchResults();
    });
  }
}

function openSearch() {
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  if (searchModal) searchModal.classList.add('open');
  if (searchInput) searchInput.focus();
  renderSearchResults();
}

function closeSearch() {
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  if (searchModal) searchModal.classList.remove('open');
  if (searchInput) searchInput.value = '';
  state.searchQuery = '';
}

// Count-Up Animation Helper
function animateCountUp(el, endVal, prefix = '', suffix = '', decimals = 0, duration = 800) {
  if (!el) return;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = (endVal * easeProgress).toFixed(decimals);
    const formattedNum = parseFloat(currentVal).toLocaleString();
    el.textContent = `${prefix}${formattedNum}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${prefix}${endVal.toLocaleString()}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}

function renderSearchResults() {
  const searchResults = document.getElementById('searchResults');
  if (!searchResults) return;

  const rawQ = (state.searchQuery || '').trim();
  const q = rawQ.toLowerCase();

  if (!q) {
    searchResults.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #94A3B8; font-size: 13px;">
        Start typing to search financials, 563 disclosures, spectrum, directors, risks, BRLMs, litigation...
      </div>
    `;
    return;
  }

  const items = [];
  const data = getDataStore();

  // 1. Financial Statements & Key Metrics
  const finKeywords = [
    { title: "Revenue from Operations: ₹1,468,853M (FY26)", category: "Financial Statement", view: "financials", terms: ["revenue", "operations", "topline", "sales", "income"] },
    { title: "EBITDA: ₹762,554M | 51.91% Margin (FY26)", category: "Financial Statement", view: "financials", terms: ["ebitda", "margin", "operating profit"] },
    { title: "Profit After Tax (PAT): ₹300,527M (FY26)", category: "Financial Statement", view: "financials", terms: ["pat", "profit", "net profit", "tax"] },
    { title: "Basic EPS: ₹33.63 | Diluted EPS: ₹33.59", category: "SEBI Ratio", view: "ratios", terms: ["eps", "earnings per share", "diluted"] },
    { title: "Property, Plant & Equipment (PPE): ₹2,354,289M", category: "Balance Sheet Note 1", view: "financials", terms: ["ppe", "plant", "machinery", "equipment", "land", "building", "assets"] },
    { title: "Platform & Product Development: ₹251,544M", category: "Balance Sheet Note 1", view: "financials", terms: ["platform", "product", "software", "intangible"] },
    { title: "Right-of-Use (ROU) Assets: ₹155,627M", category: "Balance Sheet Note 1", view: "financials", terms: ["rou", "right of use", "lease", "towers", "fiber"] },
    { title: "Net Deferred Tax Liabilities: ₹411,573M", category: "Balance Sheet Note 5", view: "financials", terms: ["tax", "deferred tax", "dtl", "dta"] },
    { title: "Current Investments: ₹266,448M (Mutual Funds, CDs, G-Secs)", category: "Balance Sheet Note 8", view: "financials", terms: ["investments", "mutual funds", "gsec", "treasury", "certificates of deposit"] },
    { title: "Trade Receivables: ₹25,268M (Considered Good)", category: "Balance Sheet Note 9", view: "financials", terms: ["trade receivables", "debtors", "unbilled"] },
    { title: "Return on Net Worth (RONW): 9.42% | ROACE: 10.76%", category: "SEBI Ratio", view: "ratios", terms: ["ronw", "roace", "return", "net worth", "capital employed"] },
    { title: "Net Leverage: 0.36x | Net Gearing: 0.08", category: "SEBI Ratio", view: "ratios", terms: ["leverage", "gearing", "debt"] },
    { title: "NAV per Share: ₹373.66 | Fully Diluted NAV: ₹373.24", category: "SEBI Ratio", view: "ratios", terms: ["nav", "net asset value", "book value"] },
    { title: "Cash CapEx: ₹341.8B (23.27% of Revenue)", category: "CapEx Spend", view: "ratios", terms: ["capex", "capital expenditure", "cash capex"] }
  ];

  finKeywords.forEach(f => {
    if (f.terms.some(t => t.includes(q)) || f.title.toLowerCase().includes(q)) {
      items.push(f);
    }
  });

  // 2. Financial Disclosures (563 Notes Master)
  if (data.notesToAccounts && Array.isArray(data.notesToAccounts)) {
    data.notesToAccounts.forEach(n => {
      const matchText = `note ${n.noteNo} ${n.title} ${n.lineItem}`.toLowerCase();
      if (matchText.includes(q)) {
        items.push({
          title: `Note ${n.noteNo}: ${n.lineItem} (FY26: ${n.fy26 !== undefined ? n.fy26.toLocaleString() + ' ' + (n.unit||'') : '-'})`,
          category: `Financial Disclosure (${n.title})`,
          view: "notes"
        });
      }
    });
  }

  // 3. Spectrum Circles (22 LSAs)
  if (data.spectrum && data.spectrum.circles) {
    data.spectrum.circles.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.breakdown.toLowerCase().includes(q) || 'spectrum'.includes(q)) {
        items.push({
          title: `${c.name}: ${c.totalQuantum} MHz (${c.breakdown})`,
          category: "Spectrum LSA",
          view: "spectrum"
        });
      }
    });
  }

  // 4. Board Directors
  if (data.governance && data.governance.board) {
    data.governance.board.forEach(d => {
      if (d.name.toLowerCase().includes(q) || d.designation.toLowerCase().includes(q) || 'board'.includes(q) || 'director'.includes(q)) {
        items.push({
          title: `${d.name} — ${d.designation}`,
          category: `Board Director (DIN: ${d.din})`,
          view: "governance"
        });
      }
    });
  }

  // 5. Key Management Personnel (KMPs)
  if (data.management && data.management.kmps) {
    data.management.kmps.forEach(k => {
      if (k.name.toLowerCase().includes(q) || k.role.toLowerCase().includes(q) || 'ceo'.includes(q) || 'cfo'.includes(q)) {
        items.push({
          title: `${k.name} — ${k.role}`,
          category: "Key Managerial Personnel",
          view: "management"
        });
      }
    });
  }

  // 6. Risk Factors (56 Risks)
  if (data.riskFactors && data.riskFactors.list) {
    data.riskFactors.list.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || 'risk'.includes(q)) {
        items.push({
          title: `Risk #${r.id}: ${r.title}`,
          category: `Risk Factor (${r.severity} Severity)`,
          view: "risk"
        });
      }
    });
  }

  // 7. BRLM Investment Banks & IPO Details
  if (data.ipoDetails && data.ipoDetails.brlms) {
    data.ipoDetails.brlms.forEach(b => {
      if (b.toLowerCase().includes(q) || 'brlm'.includes(q) || 'bank'.includes(q) || 'ipo'.includes(q)) {
        items.push({
          title: `BRLM Investment Bank: ${b}`,
          category: "Book Running Lead Manager",
          view: "ipo"
        });
      }
    });
  }

  // 8. Litigation Cases & Tax Demands
  if (data.litigation && data.litigation.keyCases) {
    data.litigation.keyCases.forEach(l => {
      if (l.category.toLowerCase().includes(q) || l.forum.toLowerCase().includes(q) || l.status.toLowerCase().includes(q) || 'tax'.includes(q) || 'litigation'.includes(q)) {
        items.push({
          title: `Case ${l.id} (${l.forum}): ${l.category} — ${l.amount}`,
          category: "Litigation & Dispute",
          view: "litigation"
        });
      }
    });
  }

  // 9. Peer Comparison
  if ('peer'.includes(q) || 'airtel'.includes(q) || 'vodafone'.includes(q) || 'bharti'.includes(q) || 'arpu'.includes(q)) {
    items.push({ title: "Indian Telecom Peer Benchmark (Jio vs Airtel vs Vi)", category: "Peer Matrix", view: "peer" });
  }

  // Limit display to top 15 relevant matches
  const displayItems = items.slice(0, 15);

  if (displayItems.length === 0) {
    searchResults.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #94A3B8; font-size: 13px;">
        No DRHP items found matching "${rawQ}". Try searching "Revenue", "Spectrum", "Mukesh Ambani", "Note 17", "Airtel", "Tax", or "BRLM".
      </div>
    `;
    return;
  }

  searchResults.innerHTML = displayItems.map(item => `
    <div class="command-item p-3 hover:bg-white/10 rounded-lg cursor-pointer border-b border-white/5 transition-all flex justify-between items-center" data-view="${item.view}">
      <div>
        <div class="command-item-title text-sm font-bold text-white">${item.title}</div>
        <div class="command-item-cat text-xs text-sky-400 font-mono mt-0.5">${item.category}</div>
      </div>
      <span class="material-symbols-outlined text-gray-400 text-sm">arrow_forward</span>
    </div>
  `).join('');

  searchResults.querySelectorAll('.command-item').forEach(el => {
    el.addEventListener('click', () => {
      const v = el.getAttribute('data-view');
      closeSearch();
      switchToView(v);
    });
  });
}

function switchToView(viewName) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(n => {
    if (n.getAttribute('data-view') === viewName) {
      n.classList.add('active', 'text-sky-400', 'border-r-4', 'border-sky-400', 'bg-white/5');
      n.classList.remove('text-gray-400');
    } else {
      n.classList.remove('active', 'text-sky-400', 'border-r-4', 'border-sky-400', 'bg-white/5');
      n.classList.add('text-gray-400');
    }
  });
  state.activeView = viewName;
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentView() {
  const currContainer = document.getElementById('currToggleContainer');
  if (currContainer) {
    currContainer.style.display = (state.activeView === 'dashboard') ? 'flex' : 'none';
  }

  switch (state.activeView) {
    case 'dashboard':
      renderDashboardView();
      break;
    case 'company':
      renderCompanyView();
      break;
    case 'peer':
      renderPeerView();
      break;
    case 'compare':
      renderCompareView();
      break;
    case 'business':
      renderBusinessView();
      break;
    case 'spectrum':
      renderSpectrumView();
      break;
    case 'financials':
      renderFinancialsView();
      break;
    case 'notes':
      renderNotesView();
      break;
    case 'ratios':
      renderRatiosView();
      break;
    case 'ipo':
      renderIpoView();
      break;
    case 'shareholding':
      renderShareholdingView();
      break;
    case 'governance':
      renderGovernanceView();
      break;
    case 'management':
      renderManagementView();
      break;
    case 'subsidiaries':
      renderSubsidiariesView();
      break;
    case 'risk':
      renderRiskView();
      break;
    case 'litigation':
      renderLitigationView();
      break;
    case 'timeline':
      renderTimelineView();
      break;
    default:
      renderDashboardView();
  }
  setTimeout(attachCursorGlareListeners, 50);
}

// Advanced Interactive ThreeJS 3D Telecom Tower & Satellite Scene
function initThreeJSTower() {
  const container = document.getElementById('threejs-container-TOWER_SCENE') || document.getElementById('threejs-container-ANIMATION_7');
  if (!container || !window.THREE) return;
  container.innerHTML = '';

  try {
    const width = container.clientWidth || window.innerWidth / 2;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const towerGroup = new THREE.Group();
    scene.add(towerGroup);

    const primaryMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0066cc, 
      emissive: 0x0044aa, 
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9
    });

    const mastGeom = new THREE.CylinderGeometry(0.05, 0.25, 6, 12);
    const mast = new THREE.Mesh(mastGeom, primaryMaterial);
    towerGroup.add(mast);

    const antennaGroup = new THREE.Group();
    antennaGroup.position.y = 2.5;
    towerGroup.add(antennaGroup);

    const arrayGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const arrayMesh = new THREE.Mesh(arrayGeom, primaryMaterial);
    antennaGroup.add(arrayMesh);

    const signalDisks = [];
    for (let i = 0; i < 3; i++) {
        const diskGeom = new THREE.TorusGeometry(0.5, 0.02, 16, 100);
        const diskMat = new THREE.MeshBasicMaterial({ color: 0x0066cc, transparent: true, opacity: 0.5 });
        const disk = new THREE.Mesh(diskGeom, diskMat);
        disk.rotation.x = Math.PI / 2;
        disk.position.y = 2.5;
        disk.scale.set(1, 1, 1);
        scene.add(disk);
        signalDisks.push({ mesh: disk, delay: i * 1.5 });
    }

    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    const satellites = [];
    const satelliteColors = [0x0066cc, 0x00ffff, 0xffffff];
    
    for (let i = 0; i < 4; i++) {
        const sGroup = new THREE.Group();
        const bodyGeom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const bodyMat = new THREE.MeshPhongMaterial({ color: satelliteColors[i % 3] });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        sGroup.add(body);
        
        const panelGeom = new THREE.PlaneGeometry(0.6, 0.15);
        const panelMat = new THREE.MeshPhongMaterial({ color: 0x222222, side: THREE.DoubleSide });
        const panelL = new THREE.Mesh(panelGeom, panelMat);
        panelL.position.x = -0.4;
        sGroup.add(panelL);
        
        const panelR = new THREE.Mesh(panelGeom, panelMat);
        panelR.position.x = 0.4;
        sGroup.add(panelR);
        
        const glowGeom = new THREE.SphereGeometry(0.05, 8, 8);
        const glowMat = new THREE.MeshBasicMaterial({ color: satelliteColors[i % 3], transparent: true, opacity: 0.5 });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        sGroup.add(glow);

        const orbitRadius = 4 + Math.random() * 2;
        const orbitSpeed = 0.002 + Math.random() * 0.005;
        const orbitOffset = Math.random() * Math.PI * 2;
        const orbitInclination = (Math.random() - 0.5) * 0.8;

        satelliteGroup.add(sGroup);
        satellites.push({ mesh: sGroup, radius: orbitRadius, speed: orbitSpeed, offset: orbitOffset, inclination: orbitInclination });
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x0066cc, 2, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 8;
    camera.position.y = 1;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
    });
    
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };
            scene.rotation.y += deltaMove.x * 0.01;
            scene.rotation.x += deltaMove.y * 0.01;
        }
        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function animate(t) {
        requestAnimationFrame(animate);
        const time = t * 0.001;
        
        if (!isDragging) {
            towerGroup.rotation.y += 0.005;
        }
        
        signalDisks.forEach(diskObj => {
            const cycle = (time + diskObj.delay) % 3;
            const scale = 1 + cycle * 3;
            diskObj.mesh.scale.set(scale, scale, scale);
            diskObj.mesh.material.opacity = Math.max(0, 0.5 * (1 - (cycle / 3)));
        });
        
        satellites.forEach(s => {
            const angle = time * s.speed * 100 + s.offset;
            s.mesh.position.x = Math.cos(angle) * s.radius;
            s.mesh.position.z = Math.sin(angle) * s.radius;
            s.mesh.position.y = Math.sin(angle * 0.5) * s.inclination * s.radius;
            s.mesh.lookAt(0, 0, 0);
        });
        
        renderer.render(scene, camera);
    }
    animate(0);
  } catch(e) {
    console.warn("ThreeJS scene initialization:", e);
  }
}

// Screener Multi-Ratio Comparison Engine Widget
function renderScreenerComparisonWidget(targetId = 'screenerComparisonContainer') {
  const dom = document.getElementById(targetId);
  if (!dom) return;

  const m1 = screenerMetrics[state.screenerRatio1] || screenerMetrics.revenue;
  const m2 = screenerMetrics[state.screenerRatio2] || screenerMetrics.ebitda;

  dom.innerHTML = `
    <div class="glass-card rounded-2xl p-6 relative">
      <div class="cursor-glare"></div>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
        <div>
          <div class="flex items-center space-x-2">
            <span class="material-symbols-outlined text-sky-400">stacked_line_chart</span>
            <h4 class="font-headline-sm text-lg text-white font-bold">Screener Ratio & Metric Comparison Trajectory</h4>
          </div>
          <p class="text-xs text-gray-400 mt-1">Select any two ratios/metrics to overlay dual-axis historical & projected trajectories (FY24–FY28E).</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button class="preset-chip px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 hover:border-sky-500 text-gray-300 transition-all liquid-glare-effect" data-r1="revenue" data-r2="ebitda">Revenue vs EBITDA</button>
          <button class="preset-chip px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 hover:border-sky-500 text-gray-300 transition-all liquid-glare-effect" data-r1="ebitdaMargin" data-r2="patMargin">Margin % Comparison</button>
          <button class="preset-chip px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 hover:border-sky-500 text-gray-300 transition-all liquid-glare-effect" data-r1="subscribers" data-r2="arpu">Subs vs ARPU</button>
          <button class="preset-chip px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 hover:border-sky-500 text-gray-300 transition-all liquid-glare-effect" data-r1="eps" data-r2="nav">EPS vs NAV</button>
          <button class="preset-chip px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 hover:border-sky-500 text-gray-300 transition-all liquid-glare-effect" data-r1="netLeverage" data-r2="ronw">Leverage vs RONW</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-black/40 p-4 rounded-xl border border-white/10 relative z-10">
        <div>
          <label class="block text-xs text-sky-400 font-bold uppercase mb-1">Primary Y-Axis Metric (Ratio 1)</label>
          <select id="screenerSelect1" class="w-full bg-black/60 border border-white/20 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500">
            ${Object.keys(screenerMetrics).map(k => `
              <option value="${k}" ${state.screenerRatio1 === k ? 'selected' : ''}>${screenerMetrics[k].name}</option>
            `).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs text-emerald-400 font-bold uppercase mb-1">Secondary Y-Axis Metric (Ratio 2)</label>
          <select id="screenerSelect2" class="w-full bg-black/60 border border-white/20 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-emerald-500">
            ${Object.keys(screenerMetrics).map(k => `
              <option value="${k}" ${state.screenerRatio2 === k ? 'selected' : ''}>${screenerMetrics[k].name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div id="screenerDualAxisChart" class="w-full h-[360px] relative z-10"></div>

      <div class="mt-6 overflow-x-auto border-t border-white/10 pt-4 relative z-10">
        <table class="custom-table">
          <thead>
            <tr><th>Metric / Year</th><th>FY2024</th><th>FY2025</th><th>FY2026 (DRHP)</th><th>FY2027E</th><th>FY2028E</th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="td-highlight" style="color: ${m1.color};">${m1.name}</td>
              ${m1.data.map(v => `<td><strong>${v.toLocaleString()}${m1.unit}</strong></td>`).join('')}
            </tr>
            <tr>
              <td class="td-highlight" style="color: ${m2.color};">${m2.name}</td>
              ${m2.data.map(v => `<td><strong>${v.toLocaleString()}${m2.unit}</strong></td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  const sel1 = document.getElementById('screenerSelect1');
  const sel2 = document.getElementById('screenerSelect2');
  if (sel1) sel1.addEventListener('change', (e) => { state.screenerRatio1 = e.target.value; renderScreenerComparisonWidget(targetId); });
  if (sel2) sel2.addEventListener('change', (e) => { state.screenerRatio2 = e.target.value; renderScreenerComparisonWidget(targetId); });

  document.querySelectorAll('.preset-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      state.screenerRatio1 = btn.getAttribute('data-r1');
      state.screenerRatio2 = btn.getAttribute('data-r2');
      renderScreenerComparisonWidget(targetId);
    });
  });

  initScreenerDualAxisChart(m1, m2);
}

function renderFallbackSvgChart(dom, m1, m2) {
  if (!dom) return;
  const years = screenerYears;
  const d1 = m1.data;
  const d2 = m2.data;

  const min1 = Math.min(...d1) * 0.9;
  const max1 = Math.max(...d1) * 1.1;
  const min2 = Math.min(...d2) * 0.9;
  const max2 = Math.max(...d2) * 1.1;

  const width = 600;
  const height = 300;
  const padding = 50;

  const points1 = d1.map((v, i) => {
    const x = padding + (i * (width - 2 * padding)) / (years.length - 1);
    const y = height - padding - ((v - min1) * (height - 2 * padding)) / (max1 - min1 || 1);
    return `${x},${y}`;
  }).join(' ');

  const points2 = d2.map((v, i) => {
    const x = padding + (i * (width - 2 * padding)) / (years.length - 1);
    const y = height - padding - ((v - min2) * (height - 2 * padding)) / (max2 - min2 || 1);
    return `${x},${y}`;
  }).join(' ');

  dom.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-full">
      <!-- Grid Lines -->
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

      <!-- Trajectory Line 1 -->
      <polyline fill="none" stroke="${m1.color}" stroke-width="3" points="${points1}" />
      <!-- Trajectory Line 2 -->
      <polyline fill="none" stroke="${m2.color}" stroke-width="3" stroke-dasharray="6,6" points="${points2}" />

      <!-- Year Labels -->
      ${years.map((yr, i) => {
        const x = padding + (i * (width - 2 * padding)) / (years.length - 1);
        return `<text x="${x}" y="${height - 15}" fill="#CBD5E1" font-size="11" text-anchor="middle" font-weight="bold">${yr}</text>`;
      }).join('')}

      <!-- Metric 1 Dots -->
      ${d1.map((v, i) => {
        const x = padding + (i * (width - 2 * padding)) / (years.length - 1);
        const y = height - padding - ((v - min1) * (height - 2 * padding)) / (max1 - min1 || 1);
        return `<circle cx="${x}" cy="${y}" r="6" fill="${m1.color}"><title>${m1.name}: ${v.toLocaleString()}${m1.unit}</title></circle>`;
      }).join('')}

      <!-- Metric 2 Dots -->
      ${d2.map((v, i) => {
        const x = padding + (i * (width - 2 * padding)) / (years.length - 1);
        const y = height - padding - ((v - min2) * (height - 2 * padding)) / (max2 - min2 || 1);
        return `<circle cx="${x}" cy="${y}" r="6" fill="${m2.color}"><title>${m2.name}: ${v.toLocaleString()}${m2.unit}</title></circle>`;
      }).join('')}
    </svg>
    <div class="flex justify-center space-x-6 mt-2 text-xs font-bold">
      <span style="color: ${m1.color};">━━ ${m1.name}</span>
      <span style="color: ${m2.color};">╌╌ ${m2.name}</span>
    </div>
  `;
}

function initScreenerDualAxisChart(m1, m2, retries = 0) {
  const dom = document.getElementById('screenerDualAxisChart');
  if (!dom) return;

  if (!window.echarts) {
    renderFallbackSvgChart(dom, m1, m2);
    return;
  }

  if (dom.clientWidth === 0) {
    if (retries < 25) {
      setTimeout(() => initScreenerDualAxisChart(m1, m2, retries + 1), 100);
    } else {
      renderFallbackSvgChart(dom, m1, m2);
    }
    return;
  }

  let myChart = echarts.getInstanceByDom(dom);
  if (myChart) {
    myChart.dispose();
  }
  myChart = echarts.init(dom);

  const option = {
    animation: true, animationDuration: 1000, animationEasing: 'cubicOut',
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: [m1.name, m2.name], bottom: 0, textStyle: { color: '#CBD5E1' } },
    grid: { left: '4%', right: '4%', bottom: '14%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: screenerYears,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#CBD5E1', fontWeight: 600 }
    },
    yAxis: [
      {
        type: 'value',
        name: m1.name,
        nameTextStyle: { color: m1.color, fontSize: 11 },
        axisLabel: { formatter: `{value}${m1.unit}`, color: m1.color },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }
      },
      {
        type: 'value',
        name: m2.name,
        nameTextStyle: { color: m2.color, fontSize: 11 },
        axisLabel: { formatter: `{value}${m2.unit}`, color: m2.color },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: m1.name,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: m1.data,
        yAxisIndex: 0,
        itemStyle: { color: m1.color },
        lineStyle: { width: 3, color: m1.color },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: m1.color + '44' },
            { offset: 1, color: m1.color + '00' }
          ])
        }
      },
      {
        name: m2.name,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: m2.data,
        yAxisIndex: 1,
        itemStyle: { color: m2.color },
        lineStyle: { width: 3, color: m2.color, type: 'dashed' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: m2.color + '33' },
            { offset: 1, color: m2.color + '00' }
          ])
        }
      }
    ]
  };

  myChart.setOption(option);

  requestAnimationFrame(() => {
    myChart.resize();
    setTimeout(() => myChart.resize(), 150);
  });

  window.addEventListener('resize', () => myChart.resize());
}

// DASHBOARD VIEW WITH INSTITUTIONAL CITATION TOOLTIPS & 100% DRHP VERBATIM ACCURACY
function renderDashboardView() {
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  const year = state.selectedYear;
  let revNum = 1468853;
  let ebitdaNum = 762554;
  let patNum = 300527;

  if (year === 'FY25') {
    revNum = 1282184;
    ebitdaNum = 641700;
    patNum = 261203;
  } else if (year === 'FY24') {
    revNum = 1095581;
    ebitdaNum = 549587;
    patNum = 214340;
  }

  mainCanvas.innerHTML = `
    <!-- Header Section with COMPLETE JIO IPO STORY and DASHBOARD title -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-center animate-fade-in relative">
      <div class="lg:col-span-7 space-y-2 relative z-10">
        <h2 class="text-[28px] md:text-[36px] leading-[1.1] text-sky-400 font-black tracking-wider uppercase font-display-lg">
          COMPLETE JIO IPO STORY
        </h2>
        <h1 class="text-[52px] md:text-[68px] leading-[1.0] text-white font-black tracking-wider uppercase font-display-lg">
          DASHBOARD
        </h1>
        <div class="flex items-center space-x-3 pt-1">
          <img src="assets/jio_logo.png" class="w-7 h-7 rounded-lg object-cover shadow" alt="Jio Logo" />
          <span class="text-base font-bold text-gray-200">Reliance Jio Infocomm Limited</span>
        </div>
      </div>

      <div class="lg:col-span-5 relative h-[300px] flex items-center justify-center">
        <div class="absolute inset-0 w-full h-full scale-125 object-contain z-0 pointer-events-auto" id="threejs-container-TOWER_SCENE"></div>
      </div>
    </section>

    <!-- Core Financials & Scale Cards with Institutional Citation Badges -->
    <section class="mb-12">
      <h3 class="font-headline-sm text-lg text-white mb-4 flex items-center justify-between font-bold tracking-tight uppercase">
        <div class="flex items-center">
          <span class="material-symbols-outlined mr-2 text-sky-400">monitoring</span>
          Core Financials & Scale
        </div>
        <span class="text-xs font-code-mono text-emerald-400 font-normal normal-case border border-emerald-500/30 px-2.5 py-0.5 rounded-full bg-emerald-500/10">100% DRHP Verified</span>
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <!-- Card 1: Revenue from Operations -->
        <div class="glass-card kpi-card p-5 rounded-xl flex flex-col justify-between group cursor-pointer stagger-1 relative">
          <div class="cursor-glare"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-2">
              <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Revenue from Operations</p>
              <div class="relative group/tooltip">
                <span class="material-symbols-outlined text-[15px] text-sky-400 hover:text-white transition-colors">info</span>
                <div class="absolute bottom-full right-0 mb-2 w-52 p-2.5 bg-black/90 text-[10px] text-gray-300 rounded-lg border border-white/20 shadow-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-30">
                  <span class="font-bold text-white block mb-0.5">Source: SEBI DRHP</span>
                  <span>Page: 288 (Restated P&L Note 26)<br/>Verified Date: June 19, 2026</span>
                </div>
              </div>
            </div>
            <div class="font-display-lg text-[24px] text-white font-bold tracking-tight" id="kpiRev">${formatMoney(revNum)}</div>
            <div class="mt-2 text-[11px] font-code-mono text-emerald-400 flex items-center">
              <span class="material-symbols-outlined text-[14px] mr-1">trending_up</span> +14.56% YoY
            </div>
          </div>
        </div>

        <!-- Card 2: EBITDA -->
        <div class="glass-card kpi-card p-5 rounded-xl flex flex-col justify-between group cursor-pointer stagger-2 relative">
          <div class="cursor-glare"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-2">
              <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">EBITDA</p>
              <div class="relative group/tooltip">
                <span class="material-symbols-outlined text-[15px] text-sky-400 hover:text-white transition-colors">info</span>
                <div class="absolute bottom-full right-0 mb-2 w-52 p-2.5 bg-black/90 text-[10px] text-gray-300 rounded-lg border border-white/20 shadow-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-30">
                  <span class="font-bold text-white block mb-0.5">Source: SEBI DRHP</span>
                  <span>Page: 290 (Key Financial Ratios)<br/>Verified Date: June 19, 2026</span>
                </div>
              </div>
            </div>
            <div class="font-display-lg text-[24px] text-white font-bold tracking-tight" id="kpiEbitda">${formatMoney(ebitdaNum)}</div>
            <div class="mt-2 text-[11px] font-code-mono text-emerald-400 flex items-center">
              <span class="material-symbols-outlined text-[14px] mr-1">trending_up</span> 51.91% Margin
            </div>
          </div>
        </div>

        <!-- Card 3: Profit After Tax (PAT) -->
        <div class="glass-card kpi-card p-5 rounded-xl flex flex-col justify-between group cursor-pointer stagger-3 relative">
          <div class="cursor-glare"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-2">
              <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Profit After Tax (PAT)</p>
              <div class="relative group/tooltip">
                <span class="material-symbols-outlined text-[15px] text-sky-400 hover:text-white transition-colors">info</span>
                <div class="absolute bottom-full right-0 mb-2 w-52 p-2.5 bg-black/90 text-[10px] text-gray-300 rounded-lg border border-white/20 shadow-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-30">
                  <span class="font-bold text-white block mb-0.5">Source: SEBI DRHP</span>
                  <span>Page: 288 (Restated P&L)<br/>Verified Date: June 19, 2026</span>
                </div>
              </div>
            </div>
            <div class="font-display-lg text-[24px] text-white font-bold tracking-tight" id="kpiPat">${formatMoney(patNum)}</div>
            <div class="mt-2 text-[11px] font-code-mono text-emerald-400 flex items-center">
              <span class="material-symbols-outlined text-[14px] mr-1">trending_up</span> +15.05% YoY
            </div>
          </div>
        </div>

        <!-- Card 4: Subscribers -->
        <div class="glass-card kpi-card p-5 rounded-xl flex flex-col justify-between group cursor-pointer stagger-4 relative">
          <div class="cursor-glare"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-2">
              <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Subscribers</p>
              <div class="relative group/tooltip">
                <span class="material-symbols-outlined text-[15px] text-sky-400 hover:text-white transition-colors">info</span>
                <div class="absolute bottom-full right-0 mb-2 w-52 p-2.5 bg-black/90 text-[10px] text-gray-300 rounded-lg border border-white/20 shadow-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-30">
                  <span class="font-bold text-white block mb-0.5">Source: Analysys Mason Report</span>
                  <span>DRHP Page: 138 (Industry Report)<br/>Verified Date: June 16, 2026</span>
                </div>
              </div>
            </div>
            <div class="font-display-lg text-[24px] text-white font-bold tracking-tight">524.4M</div>
            <div class="mt-2 text-[11px] font-code-mono text-emerald-400 flex items-center">
              <span class="material-symbols-outlined text-[14px] mr-1">trending_up</span> #1 Market Leader
            </div>
          </div>
        </div>

        <!-- Card 5: Monthly ARPU -->
        <div class="glass-card kpi-card p-5 rounded-xl flex flex-col justify-between group cursor-pointer stagger-5 relative">
          <div class="cursor-glare"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-2">
              <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Monthly ARPU</p>
              <div class="relative group/tooltip">
                <span class="material-symbols-outlined text-[15px] text-sky-400 hover:text-white transition-colors">info</span>
                <div class="absolute bottom-full right-0 mb-2 w-52 p-2.5 bg-black/90 text-[10px] text-gray-300 rounded-lg border border-white/20 shadow-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-30">
                  <span class="font-bold text-white block mb-0.5">Source: SEBI DRHP</span>
                  <span>Page: 140 (Key Metrics)<br/>Verified Date: June 19, 2026</span>
                </div>
              </div>
            </div>
            <div class="font-display-lg text-[24px] text-white font-bold tracking-tight">${formatMoney(181.7, { arpu: true })}</div>
            <div class="mt-2 text-[11px] font-code-mono text-emerald-400 flex items-center">
              <span class="material-symbols-outlined text-[14px] mr-1">trending_up</span> +5.2% QoQ
            </div>
          </div>
        </div>

        <!-- Card 6: Exact Spectrum Holding -->
        <div class="glass-card kpi-card p-5 rounded-xl flex flex-col justify-between group cursor-pointer stagger-6 border-sky-500/30 relative">
          <div class="cursor-glare"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-2">
              <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Spectrum Holding</p>
              <div class="relative group/tooltip">
                <span class="material-symbols-outlined text-[15px] text-sky-400 hover:text-white transition-colors">info</span>
                <div class="absolute bottom-full right-0 mb-2 w-52 p-2.5 bg-black/90 text-[10px] text-gray-300 rounded-lg border border-white/20 shadow-2xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-30">
                  <span class="font-bold text-white block mb-0.5">Source: SEBI DRHP</span>
                  <span>Page: 210 (Spectrum Master Table)<br/>Verified Date: June 19, 2026</span>
                </div>
              </div>
            </div>
            <div class="font-display-lg text-[24px] text-teal-300 font-bold tracking-tight">26,800.8 MHz</div>
            <div class="mt-2 text-[11px] font-code-mono text-teal-400 flex items-center">
              <span class="material-symbols-outlined text-[14px] mr-1">cell_tower</span> Pan-India 22 LSAs
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Additional Data Traffic Share & DRHP Issue Size Cards -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
      <div class="glass-card p-5 rounded-xl flex justify-between items-center border border-white/10 relative">
        <div class="cursor-glare"></div>
        <div class="relative z-10">
          <span class="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Wireless Data Traffic Share</span>
          <h4 class="text-2xl font-bold text-sky-400 mt-1">~60% Data Traffic Share</h4>
          <p class="text-[11px] text-gray-400 mt-0.5">Source: Analysys Mason Industry Report (DRHP Page 142)</p>
        </div>
        <span class="material-symbols-outlined text-[32px] text-sky-400/50">data_usage</span>
      </div>

      <div class="glass-card p-5 rounded-xl flex justify-between items-center border border-white/10 relative">
        <div class="cursor-glare"></div>
        <div class="relative z-10">
          <span class="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Fresh Issue Size (DRHP Verbatim)</span>
          <h4 class="text-2xl font-bold text-emerald-400 mt-1">Up to 270,000,000 Equity Shares</h4>
          <p class="text-[11px] text-gray-400 mt-0.5">Source: SEBI DRHP Cover Page & Objects of Issue (Page 64)</p>
        </div>
        <span class="material-symbols-outlined text-[32px] text-emerald-400/50">verified</span>
      </div>
    </section>

    <!-- Screener Multi-Ratio Comparison Engine Section -->
    <section class="mb-12" id="screenerComparisonContainer"></section>

    <!-- Investment Highlights Table Section -->
    <section class="glass-card rounded-2xl overflow-hidden mb-8">
      <div class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h4 class="font-headline-sm text-lg text-white font-bold">Investment Highlights</h4>
        <button class="text-xs font-code-mono text-sky-400 hover:text-white transition-colors flex items-center liquid-glare-effect px-3 py-1.5 rounded-lg bg-white/5">
          View Full DRHP <span class="material-symbols-outlined text-[16px] ml-1">open_in_new</span>
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="custom-table">
          <thead>
            <tr><th>Strategic Dimension</th><th>DRHP Disclosed Value</th><th>Impact Rationale</th></tr>
          </thead>
          <tbody>
            <tr><td class="td-highlight">Total Spectrum Holding</td><td><strong>26,800.8 MHz</strong></td><td>Pan-India coverage across 22 circles (700MHz, 800MHz, 1800MHz, 2300MHz, 3300MHz, 26GHz).</td></tr>
            <tr><td class="td-highlight">R&D & Patent Portfolio</td><td><strong>6,817 Patents Filed</strong></td><td>11,303 dedicated R&D FTEs (~40% of workforce). Top 20 global WIPO applicant.</td></tr>
            <tr><td class="td-highlight">Objects of the Issue</td><td><strong>Up to ₹275,000 Million</strong></td><td>100% fresh issue proceeds allocated to prepay Material Subsidiary RJIL debt.</td></tr>
            <tr><td class="td-highlight">Return on Net Worth</td><td><strong>9.42%</strong></td><td>NAV per equity share increased to ₹373.66 as of March 31, 2026.</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;

  setTimeout(() => {
    initThreeJSTower();
    renderScreenerComparisonWidget('screenerComparisonContainer');
    const isUsd = state.currency === 'USD';
    const rate = state.usdRate || 96.68;
    const prefix = isUsd ? '$' : '₹';
    const suffix = isUsd ? 'M' : 'M';
    const finalRev = isUsd ? Math.round(revNum / rate) : revNum;
    const finalEbitda = isUsd ? Math.round(ebitdaNum / rate) : ebitdaNum;
    const finalPat = isUsd ? Math.round(patNum / rate) : patNum;

    animateCountUp(document.getElementById('kpiRev'), finalRev, prefix, suffix, 0, 850);
    animateCountUp(document.getElementById('kpiEbitda'), finalEbitda, prefix, suffix, 0, 850);
    animateCountUp(document.getElementById('kpiPat'), finalPat, prefix, suffix, 0, 850);
  }, 50);
}

// PEER BENCHMARK VIEW
function renderPeerView() {
  const data = getDataStore();
  const peers = (data.peerComparison && data.peerComparison.peers) || [];
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Peer Analytics</span>
      <h2 class="text-3xl font-bold text-white mt-1">Indian Telecom Peer Comparison</h2>
      <p class="text-sm text-gray-400 mt-2">Comparing <strong>Reliance Jio Infocomm</strong> vs Bharti Airtel & Vodafone Idea.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      ${peers.map((p, idx) => `
        <div class="glass-card rounded-2xl p-6 relative hover:border-sky-500/50 transition-all stagger-${idx+1}">
          <div class="cursor-glare"></div>
          <div class="flex justify-between items-center mb-4 relative z-10">
            <h3 class="text-xl font-bold text-white">${p.operator}</h3>
            ${p.marketLeader ? '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">#1 Leader</span>' : ''}
          </div>
          <div class="space-y-3 text-sm relative z-10">
            <div class="flex justify-between"><span class="text-gray-400">Subscribers</span><span class="font-bold text-white">${p.subscribersM}M</span></div>
            <div class="flex justify-between"><span class="text-gray-400">5G Subscribers</span><span class="font-bold text-sky-400">${p.fiveGSubscribersM}M</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Monthly ARPU</span><span class="font-bold text-white">₹${p.arpuRs}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">EBITDA Margin</span><span class="font-bold text-emerald-400">${p.ebitdaMarginPct}%</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Net Leverage</span><span class="font-bold text-white">${p.netLeverageX}x</span></div>
            <div class="flex justify-between"><span class="text-gray-400">5G Architecture</span><span class="font-bold text-teal-300 text-xs">${p.fiveGTechnology || '5G SA'}</span></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// SIMULATOR & RATIO TRAJECTORY VIEW
function renderCompareView() {
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Scenario Simulator & Screener Comparison</span>
      <h2 class="text-3xl font-bold text-white mt-1">Financial Forecast & Ratio Trajectory Comparison</h2>
    </div>

    <div class="mb-12" id="screenerCompareViewWidget"></div>

    <div class="glass-card rounded-2xl p-8 mb-12">
      <h3 class="text-xl font-bold text-white mb-4">FY27 Financial Sensitivity Simulator</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div>
            <div class="flex justify-between text-sm font-bold text-white mb-2">
              <span>Target Monthly ARPU (₹)</span><span id="arpuVal" class="text-sky-400">₹${state.simArpu}</span>
            </div>
            <input type="range" id="arpuSlider" class="w-full h-2 bg-gray-700 rounded-lg outline-none accent-sky-500" min="170" max="260" step="1" value="${state.simArpu}" />
          </div>

          <div>
            <div class="flex justify-between text-sm font-bold text-white mb-2">
              <span>Target Subscribers (Million)</span><span id="subsVal" class="text-sky-400">${state.simSubs}M</span>
            </div>
            <input type="range" id="subsSlider" class="w-full h-2 bg-gray-700 rounded-lg outline-none accent-sky-500" min="500" max="600" step="1" value="${state.simSubs}" />
          </div>

          <div>
            <div class="flex justify-between text-sm font-bold text-white mb-2">
              <span>Target EBITDA Margin (%)</span><span id="marginVal" class="text-emerald-400">${state.simMargin}%</span>
            </div>
            <input type="range" id="marginSlider" class="w-full h-2 bg-gray-700 rounded-lg outline-none accent-emerald-500" min="45" max="58" step="0.5" value="${state.simMargin}" />
          </div>
        </div>

        <div class="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col justify-center">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Simulated FY27 Projections</span>
          <div class="mt-4">
            <span class="text-xs text-gray-400">Projected FY27 Revenue</span>
            <div id="simRevenueDisplay" class="text-3xl font-bold text-sky-400">₹1,468,853M</div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-400">Projected FY27 EBITDA</span>
            <div id="simEbitdaDisplay" class="text-3xl font-bold text-emerald-400">₹762,554M</div>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    renderScreenerComparisonWidget('screenerCompareViewWidget');
  }, 50);

  const arpuSlider = document.getElementById('arpuSlider');
  const subsSlider = document.getElementById('subsSlider');
  const marginSlider = document.getElementById('marginSlider');

  const updateSim = () => {
    const arpu = parseFloat(arpuSlider.value);
    const subs = parseFloat(subsSlider.value);
    const margin = parseFloat(marginSlider.value);

    document.getElementById('arpuVal').textContent = `₹${arpu}`;
    document.getElementById('subsVal').textContent = `${subs}M`;
    document.getElementById('marginVal').textContent = `${margin}%`;

    const revRatio = (subs * arpu * 12) / (524.4 * 181.7 * 12);
    const simRev = Math.round(1468853 * revRatio);
    const simEbitda = Math.round(simRev * (margin / 100));

    animateCountUp(document.getElementById('simRevenueDisplay'), simRev, '₹', 'M', 0, 400);
    animateCountUp(document.getElementById('simEbitdaDisplay'), simEbitda, '₹', 'M', 0, 400);
  };

  if (arpuSlider && subsSlider && marginSlider) {
    arpuSlider.addEventListener('input', updateSim);
    subsSlider.addEventListener('input', updateSim);
    marginSlider.addEventListener('input', updateSim);
  }
}

// COMPANY SNAPSHOT VIEW
function renderCompanyView() {
  const data = getDataStore();
  const c = data.company || {};
  const s = c.snapshot || {};
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Company Snapshot</span>
      <h2 class="text-3xl font-bold text-white mt-1">${c.name}</h2>
      <p class="text-sm text-gray-400 mt-2">${s.tagline}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="glass-card p-6 rounded-2xl"><span class="text-xs text-gray-400 uppercase font-bold">CIN Number</span><h4 class="text-lg font-bold text-white mt-1 font-mono">${c.cin}</h4></div>
      <div class="glass-card p-6 rounded-2xl"><span class="text-xs text-gray-400 uppercase font-bold">Promoter Group</span><h4 class="text-lg font-bold text-sky-400 mt-1">${c.promoter} (${c.promoterHolding})</h4></div>
      <div class="glass-card p-6 rounded-2xl"><span class="text-xs text-gray-400 uppercase font-bold">DRHP Filing Date</span><h4 class="text-lg font-bold text-emerald-400 mt-1">${c.drhpDate}</h4></div>
    </div>

    <div class="glass-card rounded-2xl overflow-hidden mb-8">
      <div class="p-6 border-b border-white/10"><h4 class="font-bold text-white">Registered & Corporate Offices</h4></div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white/5 p-4 rounded-xl border border-white/10">
          <h5 class="text-xs font-bold text-gray-400 uppercase mb-2">Registered Office</h5>
          <p class="text-sm text-gray-200">${c.registeredOffice}</p>
        </div>
        <div class="bg-white/5 p-4 rounded-xl border border-white/10">
          <h5 class="text-xs font-bold text-gray-400 uppercase mb-2">Corporate Office</h5>
          <p class="text-sm text-gray-200">${c.corporateOffice}</p>
        </div>
      </div>
    </div>
  `;
}

// BUSINESS VIEW
function renderBusinessView() {
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;
  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Technology & Products</span>
      <h2 class="text-3xl font-bold text-white mt-1">Proprietary Technology Suite</h2>
      <p class="text-sm text-gray-400 mt-2">11,303 dedicated R&D FTEs powering 6,817 patent filings globally.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="glass-card p-6 rounded-2xl">
        <h4 class="font-bold text-white mb-2">5G Standalone (SA) Core & RAN</h4>
        <p class="text-xs text-gray-400 leading-relaxed">Indigenous 5G stack built on Cloud-Native microservices architecture, network slicing, and eMBB/URLLC support.</p>
      </div>
      <div class="glass-card p-6 rounded-2xl">
        <h4 class="font-bold text-white mb-2">JioAirFiber & FTTH Network</h4>
        <p class="text-xs text-gray-400 leading-relaxed">Connecting 27.1M fixed broadband homes with Gigabit connectivity and integrated Jio Home IoT ecosystem.</p>
      </div>
    </div>
  `;
}

// SPECTRUM VIEW
function renderSpectrumView() {
  const data = getDataStore();
  const s = data.spectrum || {};
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Spectrum Explorer</span>
      <h2 class="text-3xl font-bold text-white mt-1">Pan-India Spectrum Allocation (26,800.8 MHz)</h2>
    </div>

    <div class="glass-card rounded-2xl overflow-hidden mb-8">
      <div class="p-6 border-b border-white/10"><h4 class="font-bold text-white">Circle-by-Circle Spectrum (All 22 LSAs)</h4></div>
      <div class="overflow-x-auto">
        <table class="custom-table">
          <thead><tr><th>Telecom Circle</th><th>Total Quantum</th><th>Band Allocation Details</th></tr></thead>
          <tbody>
            ${(s.circles || []).map(c => `<tr><td class="td-highlight">${c.name}</td><td><strong>${c.totalQuantum} MHz</strong></td><td>${c.breakdown}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// FINANCIAL STATEMENTS VIEW (P&L + BALANCE SHEET DISCLOSURES)
function renderFinancialsView() {
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  const unitLabel = '₹ Million';

  const fmtVal = (valInr) => {
    if (valInr === undefined || valInr === null || valInr === '-') return '-';
    const num = parseFloat(valInr);
    if (isNaN(num)) return valInr;
    return num.toLocaleString();
  };

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Audited Financial Statements</span>
          <h2 class="text-3xl font-bold text-white mt-1">Restated Profit & Loss and Balance Sheet</h2>
          <p class="text-xs text-gray-400 mt-1">Verbatim disclosures from SEBI DRHP (Pages 288 to 313) in ₹ Million.</p>
        </div>
        <div class="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button id="tabBtnPnl" class="px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-600 text-white transition-all">Restated P&L</button>
          <button id="tabBtnBs" class="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all">Balance Sheet</button>
        </div>
      </div>
    </div>

    <!-- Restated P&L Section -->
    <div id="sectionPnl" class="glass-card rounded-2xl overflow-hidden mb-8">
      <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h4 class="font-bold text-white text-sm">Restated Statement of Profit and Loss (in ₹ Million)</h4>
        <span class="text-xs text-emerald-400 font-mono">Note 26 to Note 34</span>
      </div>
      <div class="overflow-x-auto">
        <table class="custom-table">
          <thead><tr><th>Particulars</th><th>FY2024</th><th>FY2025</th><th>FY2026 (DRHP)</th><th>YoY Growth</th></tr></thead>
          <tbody>
            <tr><td class="td-highlight">Revenue from Operations (Note 26)</td><td>${fmtVal(1095581)}</td><td>${fmtVal(1282184)}</td><td><strong class="text-sky-400">${fmtVal(1468853)}</strong></td><td><span class="text-emerald-400 font-bold">+14.56%</span></td></tr>
            <tr><td class="td-highlight">Other Income (Note 27)</td><td>${fmtVal(6173)}</td><td>${fmtVal(11146)}</td><td><strong>${fmtVal(28738)}</strong></td><td><span class="text-emerald-400 font-bold">+157.83%</span></td></tr>
            <tr class="bg-white/5"><td class="td-highlight">Total Income</td><td>${fmtVal(1101754)}</td><td>${fmtVal(1293330)}</td><td><strong>${fmtVal(1497591)}</strong></td><td><span class="text-emerald-400 font-bold">+15.79%</span></td></tr>
            <tr><td class="td-highlight">Network Operating Expenses (Note 28)</td><td>${fmtVal(303377)}</td><td>${fmtVal(333546)}</td><td><strong>${fmtVal(344924)}</strong></td><td><span class="text-gray-300">+3.41%</span></td></tr>
            <tr><td class="td-highlight">License Fees & Spectrum Charges</td><td>${fmtVal(92134)}</td><td>${fmtVal(104953)}</td><td><strong>${fmtVal(117104)}</strong></td><td><span class="text-gray-300">+11.58%</span></td></tr>
            <tr><td class="td-highlight">Employee Benefits Expense (Note 29)</td><td>${fmtVal(53823)}</td><td>${fmtVal(62079)}</td><td><strong>${fmtVal(66487)}</strong></td><td><span class="text-gray-300">+7.10%</span></td></tr>
            <tr><td class="td-highlight">Finance Costs (Note 30)</td><td>${fmtVal(40476)}</td><td>${fmtVal(49051)}</td><td><strong>${fmtVal(86534)}</strong></td><td><span class="text-gray-300">+76.42%</span></td></tr>
            <tr><td class="td-highlight">Depreciation & Amortisation (Note 1)</td><td>${fmtVal(221031)}</td><td>${fmtVal(241376)}</td><td><strong>${fmtVal(272489)}</strong></td><td><span class="text-gray-300">+12.89%</span></td></tr>
            <tr><td class="td-highlight">Other Expenses (Note 32)</td><td>${fmtVal(66717)}</td><td>${fmtVal(101292)}</td><td><strong>${fmtVal(144505)}</strong></td><td><span class="text-gray-300">+42.66%</span></td></tr>
            <tr class="bg-emerald-500/10 border-t border-emerald-500/30"><td class="td-highlight" style="color:#34D399;">EBITDA</td><td>${fmtVal(549587)}</td><td>${fmtVal(641700)}</td><td><strong style="color:#34D399;">${fmtVal(762554)}</strong></td><td><span class="text-emerald-400 font-bold">+18.83%</span></td></tr>
            <tr class="bg-sky-500/10 border-t border-sky-500/30"><td class="td-highlight" style="color:#38BDF8;">Profit After Tax (PAT)</td><td>${fmtVal(214340)}</td><td>${fmtVal(261203)}</td><td><strong style="color:#38BDF8;">${fmtVal(300527)}</strong></td><td><span class="text-emerald-400 font-bold">+15.05%</span></td></tr>
            <tr><td class="td-highlight">Basic EPS (₹) (Note 34)</td><td>23.96</td><td>29.21</td><td><strong>33.63</strong></td><td><span class="text-emerald-400 font-bold">+15.13%</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Restated Balance Sheet Notes Section -->
    <div id="sectionBs" class="space-y-6 hidden">
      <!-- Note 1: PPE -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h4 class="font-bold text-white text-sm">Note 1: Property, Plant & Equipment (Own Assets Net Carrying Value)</h4>
          <span class="text-xs font-mono text-sky-400">DRHP Pages 302-307</span>
        </div>
        <div class="overflow-x-auto">
          <table class="custom-table text-xs">
            <thead><tr><th>Asset Category</th><th>FY2024 (${unitLabel})</th><th>FY2025 (${unitLabel})</th><th>FY2026 (${unitLabel})</th><th>Key Trend / Remark</th></tr></thead>
            <tbody>
              <tr><td class="td-highlight">Land</td><td>${fmtVal(18815)}</td><td>${fmtVal(18805)}</td><td><strong>${fmtVal(18800)}</strong></td><td>Freehold & leasehold plot acquisitions</td></tr>
              <tr><td class="td-highlight">Buildings</td><td>${fmtVal(14520)}</td><td>${fmtVal(14017)}</td><td><strong>${fmtVal(13167)}</strong></td><td>Corporate & network switching centers</td></tr>
              <tr><td class="td-highlight">Plant and Machinery</td><td>${fmtVal(1317695)}</td><td>${fmtVal(1699999)}</td><td><strong class="text-sky-400">${fmtVal(2321273)}</strong></td><td><strong>Largest component (~98.6% of PPE)</strong></td></tr>
              <tr><td class="td-highlight">Electrical Installations</td><td>${fmtVal(1)}</td><td>${fmtVal(0)}</td><td><strong>${fmtVal(0)}</strong></td><td>Power backup systems</td></tr>
              <tr><td class="td-highlight">Equipments</td><td>${fmtVal(1928)}</td><td>${fmtVal(1268)}</td><td><strong>${fmtVal(915)}</strong></td><td>Testing & operational tools</td></tr>
              <tr><td class="td-highlight">Furniture and Fixtures</td><td>${fmtVal(194)}</td><td>${fmtVal(154)}</td><td><strong>${fmtVal(114)}</strong></td><td>Office fixtures</td></tr>
              <tr><td class="td-highlight">Vehicles</td><td>${fmtVal(24)}</td><td>${fmtVal(24)}</td><td><strong>${fmtVal(20)}</strong></td><td>Operational transport fleet</td></tr>
              <tr class="bg-sky-500/10 font-bold border-t border-sky-500/30"><td class="td-highlight" style="color:#38BDF8;">Total PPE (Own Assets)</td><td>${fmtVal(1353177)}</td><td>${fmtVal(1734267)}</td><td><strong style="color:#38BDF8;">${fmtVal(2354289)}</strong></td><td><strong>+74.0% expansion over 3 years</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Note 1: ROU Assets & Intangibles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-card rounded-2xl overflow-hidden">
          <div class="p-4 border-b border-white/10 bg-white/5"><h4 class="font-bold text-white text-sm">Note 1: Right-of-Use (ROU) Assets</h4></div>
          <div class="overflow-x-auto">
            <table class="custom-table text-xs">
              <thead><tr><th>ROU Asset Class</th><th>FY24 (₹)</th><th>FY25 (₹)</th><th>FY26 (₹)</th></tr></thead>
              <tbody>
                <tr><td class="td-highlight">Leased Plant & Machinery (Towers/Fiber)</td><td>${fmtVal(132041)}</td><td>${fmtVal(135091)}</td><td><strong>${fmtVal(152600)}</strong></td></tr>
                <tr><td class="td-highlight">Leased Land & Buildings</td><td>${fmtVal(3504)}</td><td>${fmtVal(3343)}</td><td><strong>${fmtVal(3017)}</strong></td></tr>
                <tr class="bg-white/5 font-bold"><td class="td-highlight">Total ROU Assets</td><td>${fmtVal(135561)}</td><td>${fmtVal(138442)}</td><td><strong class="text-sky-400">${fmtVal(155627)}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="glass-card rounded-2xl overflow-hidden">
          <div class="p-4 border-b border-white/10 bg-white/5"><h4 class="font-bold text-white text-sm">Note 1: Other Intangible Assets</h4></div>
          <div class="overflow-x-auto">
            <table class="custom-table text-xs">
              <thead><tr><th>Intangible Asset</th><th>FY24 (₹)</th><th>FY25 (₹)</th><th>FY26 (₹)</th></tr></thead>
              <tbody>
                <tr><td class="td-highlight">Platform & Product Development</td><td>${fmtVal(62774)}</td><td>${fmtVal(134644)}</td><td><strong class="text-emerald-400">${fmtVal(251544)}</strong></td></tr>
                <tr><td class="td-highlight">Software</td><td>${fmtVal(37170)}</td><td>${fmtVal(43249)}</td><td><strong>${fmtVal(59561)}</strong></td></tr>
                <tr><td class="td-highlight">Others (IRU & Proprietary Tech)</td><td>${fmtVal(21341)}</td><td>${fmtVal(25537)}</td><td><strong>${fmtVal(24967)}</strong></td></tr>
                <tr class="bg-white/5 font-bold"><td class="td-highlight">Total Other Intangibles</td><td>${fmtVal(123300)}</td><td>${fmtVal(205305)}</td><td><strong class="text-emerald-400">${fmtVal(337883)}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Depreciation & CWIP Schedule -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h4 class="font-bold text-white text-sm">Note 1: Depreciation & CWIP Schedule</h4>
          <span class="text-xs text-gray-400 font-mono">P&L & Balance Sheet</span>
        </div>
        <div class="overflow-x-auto">
          <table class="custom-table text-xs">
            <thead><tr><th>Item Particulars</th><th>FY2024 (${unitLabel})</th><th>FY2025 (${unitLabel})</th><th>FY2026 (${unitLabel})</th><th>Institutional Insight</th></tr></thead>
            <tbody>
              <tr><td class="td-highlight">Spectrum Amortisation</td><td>${fmtVal(54873)}</td><td>${fmtVal(59740)}</td><td><strong>${fmtVal(74791)}</strong></td><td>26,800.8 MHz amortisation charge</td></tr>
              <tr><td class="td-highlight">Total D&A Expense (before capitalization)</td><td>${fmtVal(221256)}</td><td>${fmtVal(241537)}</td><td><strong class="text-sky-400">${fmtVal(275975)}</strong></td><td>Reflects growing asset base</td></tr>
              <tr><td class="td-highlight">CWIP: Capital Goods Inventory</td><td>${fmtVal(125358)}</td><td>${fmtVal(120077)}</td><td><strong>${fmtVal(92080)}</strong></td><td>Declined as network assets capitalized</td></tr>
              <tr><td class="td-highlight">CWIP: Project Development Expenditure</td><td>${fmtVal(182273)}</td><td>${fmtVal(178835)}</td><td><strong class="text-emerald-400">${fmtVal(30601)}</strong></td><td>Reduced substantially post 5G rollout</td></tr>
              <tr><td class="td-highlight">Finance Cost Capitalised during Year</td><td>${fmtVal(93488)}</td><td>${fmtVal(105786)}</td><td><strong>${fmtVal(61374)}</strong></td><td>Capitalized interest expense</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Goodwill, Non-Current Investments & Deferred Tax -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-card p-5 rounded-2xl">
          <span class="text-[11px] font-mono text-gray-400 font-bold uppercase">Note 2: Goodwill</span>
          <h4 class="text-2xl font-bold text-white mt-1">₹${fmtVal(38170)} Million</h4>
          <p class="text-[11px] text-gray-400 mt-2">Remained stable across FY24 (₹${fmtVal(38483)}) & FY25 (₹${fmtVal(38483)}) post-acquisitions.</p>
        </div>

        <div class="glass-card p-5 rounded-2xl">
          <span class="text-[11px] font-mono text-sky-400 font-bold uppercase">Note 3: Non-Current Investments</span>
          <h4 class="text-2xl font-bold text-sky-400 mt-1">₹${fmtVal(37754)} Million</h4>
          <p class="text-[11px] text-gray-400 mt-2">FVOCI Investments expanded from ₹${fmtVal(25170)} (FY24) to ₹${fmtVal(37713)} (FY26).</p>
        </div>

        <div class="glass-card p-5 rounded-2xl border border-red-500/30">
          <span class="text-[11px] font-mono text-red-400 font-bold uppercase">Note 5: Deferred Tax Liability</span>
          <h4 class="text-2xl font-bold text-red-400 mt-1">₹${fmtVal(411573)} Million</h4>
          <p class="text-[11px] text-gray-400 mt-2">Expanded from ₹${fmtVal(218339)} (FY24) to ₹${fmtVal(308239)} (FY25) & ₹${fmtVal(411573)} (FY26).</p>
        </div>
      </div>

      <!-- Inventories, Current Investments & Trade Receivables -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-white/10 bg-white/5"><h4 class="font-bold text-white text-sm">Notes 7, 8 & 9: Inventories, Current Investments & Receivables</h4></div>
        <div class="overflow-x-auto">
          <table class="custom-table text-xs">
            <thead><tr><th>Note & Particulars</th><th>FY2024 (${unitLabel})</th><th>FY2025 (${unitLabel})</th><th>FY2026 (${unitLabel})</th><th>DRHP Disclosure Summary</th></tr></thead>
            <tbody>
              <tr><td class="td-highlight">Note 7: Inventories (Stock-in-Trade)</td><td>${fmtVal(925)}</td><td>${fmtVal(2099)}</td><td><strong>${fmtVal(2629)}</strong></td><td>Concentrated in handsets & devices</td></tr>
              <tr><td class="td-highlight">Note 8: Current Investments (Callable Corporate Instruments)</td><td>${fmtVal(0)}</td><td>${fmtVal(138000)}</td><td><strong class="text-emerald-400">${fmtVal(192500)}</strong></td><td>High liquidity treasury deployment</td></tr>
              <tr><td class="td-highlight">Note 8: Current Investments (Mutual Funds - FVTPL)</td><td>${fmtVal(6869)}</td><td>${fmtVal(38934)}</td><td><strong>${fmtVal(36799)}</strong></td><td>Liquid mutual fund units</td></tr>
              <tr><td class="td-highlight">Note 8: Current Investments (Government Securities)</td><td>${fmtVal(0)}</td><td>${fmtVal(20820)}</td><td><strong>${fmtVal(13941)}</strong></td><td>Quoted G-Secs portfolio</td></tr>
              <tr><td class="td-highlight">Note 8: Current Investments (Certificates of Deposit)</td><td>${fmtVal(18918)}</td><td>${fmtVal(0)}</td><td><strong>${fmtVal(23208)}</strong></td><td>Quoted Bank CDs</td></tr>
              <tr><td class="td-highlight">Note 9: Trade Receivables (Considered Good)</td><td>${fmtVal(28512)}</td><td>${fmtVal(24614)}</td><td><strong>${fmtVal(25268)}</strong></td><td>Largely current and not due</td></tr>
              <tr><td class="td-highlight">Note 9: Credit Impaired Receivables & Provision</td><td>${fmtVal(2245)}</td><td>${fmtVal(4188)}</td><td><strong>${fmtVal(6410)}</strong></td><td>100% provisioned (-${fmtVal(6410)})</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Toggle Listener for Restated P&L vs Balance Sheet Notes
  const btnPnl = document.getElementById('tabBtnPnl');
  const btnBs = document.getElementById('tabBtnBs');
  const secPnl = document.getElementById('sectionPnl');
  const secBs = document.getElementById('sectionBs');

  if (btnPnl && btnBs && secPnl && secBs) {
    btnPnl.addEventListener('click', () => {
      btnPnl.className = "px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-600 text-white transition-all";
      btnBs.className = "px-4 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all";
      secPnl.classList.remove('hidden');
      secBs.classList.add('hidden');
    });

    btnBs.addEventListener('click', () => {
      btnBs.className = "px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-600 text-white transition-all";
      btnPnl.className = "px-4 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all";
      secBs.classList.remove('hidden');
      secPnl.classList.add('hidden');
    });
  }
}

// SEBI RATIOS & KPIS VIEW
function renderRatiosView() {
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Audited Ratio Intelligence</span>
      <h2 class="text-3xl font-bold text-white mt-1">SEBI ICDR Key Performance Indicators & Financial Ratios</h2>
      <p class="text-xs text-gray-400 mt-1">8-Category Restated Ratios extracted verbatim from SEBI DRHP for FY2024, FY2025, and FY2026.</p>
    </div>

    <!-- 8 Ratio Categories Table Schedule -->
    <div class="glass-card rounded-2xl overflow-hidden mb-12">
      <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h4 class="font-bold text-white text-sm">Key Financial Ratios & Performance Indicators (FY24–FY26)</h4>
        <span class="text-xs font-mono text-emerald-400">100% DRHP Verified</span>
      </div>
      <div class="overflow-x-auto">
        <table class="custom-table text-xs">
          <thead>
            <tr>
              <th>Ratio Category</th>
              <th>Specific Metric</th>
              <th>FY2024</th>
              <th>FY2025</th>
              <th>FY2026 (DRHP)</th>
              <th>Institutional Insight / Trajectory</th>
            </tr>
          </thead>
          <tbody>
            <!-- Category 1: EPS -->
            <tr class="bg-white/5 font-bold"><td colspan="6" class="text-sky-400 uppercase tracking-wider text-[11px] py-2">1. Earnings Per Share (EPS)</td></tr>
            <tr><td class="td-highlight">EPS</td><td>Basic EPS (₹)</td><td>₹23.96</td><td>₹29.21</td><td><strong class="text-sky-400">₹33.63</strong></td><td>+40.4% cumulative growth over 3 years</td></tr>
            <tr><td class="td-highlight">EPS</td><td>Diluted EPS (₹)</td><td>₹23.93</td><td>₹29.17</td><td><strong>₹33.59</strong></td><td>Minimal ESOP dilution gap (0.12%)</td></tr>

            <!-- Category 2: Profitability -->
            <tr class="bg-white/5 font-bold"><td colspan="6" class="text-emerald-400 uppercase tracking-wider text-[11px] py-2">2. Profitability & Operating Margins</td></tr>
            <tr><td class="td-highlight">Profitability</td><td>EBITDA (₹ Billion)</td><td>₹549.6 B</td><td>₹641.7 B</td><td><strong class="text-emerald-400">₹762.6 B</strong></td><td>Operational scale expansion</td></tr>
            <tr><td class="td-highlight">Profitability</td><td>EBITDA Margin (%)</td><td>50.16%</td><td>50.05%</td><td><strong class="text-emerald-400">51.91%</strong></td><td>Consistently > 50% industry leader</td></tr>
            <tr><td class="td-highlight">Profitability</td><td>EBIT (₹ Billion)</td><td>₹328.6 B</td><td>₹400.3 B</td><td><strong>₹490.1 B</strong></td><td>Strong operating earnings growth</td></tr>
            <tr><td class="td-highlight">Profitability</td><td>EBIT Margin (%)</td><td>29.99%</td><td>31.22%</td><td><strong>33.36%</strong></td><td>+337 bps margin expansion</td></tr>
            <tr><td class="td-highlight">Profitability</td><td>PBT Margin (%)</td><td>26.29%</td><td>27.40%</td><td><strong>27.47%</strong></td><td>Stable pre-tax efficiency</td></tr>
            <tr><td class="td-highlight">Profitability</td><td>PAT Margin (%)</td><td>19.55%</td><td>20.36%</td><td><strong>20.46%</strong></td><td>Sustained net profit margin</td></tr>

            <!-- Category 3: Return Ratios -->
            <tr class="bg-white/5 font-bold"><td colspan="6" class="text-amber-400 uppercase tracking-wider text-[11px] py-2">3. Return Ratios</td></tr>
            <tr><td class="td-highlight">Return Ratios</td><td>Return on Average Net Worth (RONW)</td><td>8.02%</td><td>8.97%</td><td><strong class="text-amber-400">9.42%</strong></td><td>Steady annual ROE improvement</td></tr>
            <tr><td class="td-highlight">Return Ratios</td><td>Return on Average Capital Employed (ROACE)</td><td>12.83%</td><td>12.50%</td><td><strong>10.76%</strong></td><td>CapEx capitalization phase impact</td></tr>

            <!-- Category 4: NAV -->
            <tr class="bg-white/5 font-bold"><td colspan="6" class="text-sky-400 uppercase tracking-wider text-[11px] py-2">4. Net Asset Value (NAV)</td></tr>
            <tr><td class="td-highlight">Valuation / NAV</td><td>NAV per Share (₹)</td><td>₹310.85</td><td>₹340.11</td><td><strong class="text-sky-400">₹373.66</strong></td><td>Book value +20.2% over 3 years</td></tr>
            <tr><td class="td-highlight">Valuation / NAV</td><td>Fully Diluted NAV (₹)</td><td>₹310.40</td><td>₹339.63</td><td><strong>₹373.24</strong></td><td>Reflects shareholder equity growth</td></tr>

            <!-- Category 5: Leverage & Capital Structure -->
            <tr class="bg-white/5 font-bold"><td colspan="6" class="text-emerald-400 uppercase tracking-wider text-[11px] py-2">5. Leverage & Capital Structure</td></tr>
            <tr><td class="td-highlight">Leverage</td><td>Net Leverage (x)</td><td>0.88×</td><td>0.71×</td><td><strong class="text-emerald-400">0.36×</strong></td><td>De-leveraging balance sheet (-59%)</td></tr>
            <tr><td class="td-highlight">Leverage</td><td>Net Gearing Ratio</td><td>0.17</td><td>0.15</td><td><strong class="text-emerald-400">0.08</strong></td><td>Substantial reduction in net debt ratio</td></tr>

            <!-- Category 6: Taxation -->
            <tr class="bg-white/5 font-bold"><td colspan="6" class="text-gray-300 uppercase tracking-wider text-[11px] py-2">6. Taxation Profile</td></tr>
            <tr><td class="td-highlight">Taxation</td><td>Effective Tax Rate (%)</td><td>25.60%</td><td>25.64%</td><td><strong>25.52%</strong></td><td>Aligned with statutory corporate rate</td></tr>
            <tr><td class="td-highlight">Taxation</td><td>Statutory Corporate Tax Rate (%)</td><td>25.17%</td><td>25.17%</td><td><strong>25.17%</strong></td><td>Standard section 115BAA tax regime</td></tr>

            <!-- Category 7: IPO Eligibility -->
            <tr class="bg-white/5 font-bold"><td colspan="6" class="text-purple-400 uppercase tracking-wider text-[11px] py-2">7. SEBI IPO Eligibility Metric</td></tr>
            <tr><td class="td-highlight">IPO Eligibility</td><td>Monetary Assets as % of Net Tangible Assets</td><td>3.45%</td><td>13.94%</td><td><strong class="text-purple-400">18.18%</strong></td><td>Significantly enhances liquidity & SEBI test</td></tr>

            <!-- Category 8: CapEx -->
            <tr class="bg-white/5 font-bold"><td colspan="6" class="text-teal-400 uppercase tracking-wider text-[11px] py-2">8. Capital Expenditure (CapEx)</td></tr>
            <tr><td class="td-highlight">Capital Spend</td><td>Cash CapEx (₹ Billion)</td><td>₹535.1 B</td><td>₹442.7 B</td><td><strong class="text-teal-300">₹341.8 B</strong></td><td>CapEx tapering post 5G rollout</td></tr>
            <tr><td class="td-highlight">Capital Spend</td><td>CapEx as % of Revenue</td><td>48.84%</td><td>34.53%</td><td><strong class="text-teal-300">23.27%</strong></td><td>Transition to infrastructure monetization</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Screener Multi-Ratio Comparison Engine Section -->
    <div class="mb-12" id="screenerRatiosViewWidget"></div>
  `;

  setTimeout(() => {
    renderScreenerComparisonWidget('screenerRatiosViewWidget');
  }, 50);
}

// IPO VIEW
function renderIpoView() {
  const data = getDataStore();
  const ipo = data.ipoDetails || {};
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">IPO Details</span>
      <h2 class="text-3xl font-bold text-white mt-1">Jio Initial Public Offering Summary</h2>
    </div>

    <div class="glass-card rounded-2xl p-6 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h4 class="font-bold text-white text-lg">Fresh Issue Size (DRHP Verbatim)</h4>
        <span class="text-xs font-code-mono text-emerald-400 font-bold border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">Up to 270,000,000 Equity Shares</span>
      </div>
      <h4 class="font-bold text-white mb-4">19 Book Running Lead Managers (BRLMs)</h4>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        ${(ipo.brlms || []).map(b => `<div class="bg-white/5 p-3 rounded-lg border border-white/10 text-xs font-bold text-gray-200">${b}</div>`).join('')}
      </div>
    </div>
  `;
}

// SHAREHOLDING VIEW
function renderShareholdingView() {
  const data = getDataStore();
  const sh = data.shareholding || {};
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Ownership Structure</span>
      <h2 class="text-3xl font-bold text-white mt-1">Pre-Issue Shareholding Pattern</h2>
    </div>

    <div class="glass-card rounded-2xl overflow-hidden mb-8">
      <div class="overflow-x-auto">
        <table class="custom-table">
          <thead><tr><th>Category / Investor</th><th>Percentage (%)</th><th>Equity Shares</th></tr></thead>
          <tbody>
            ${(sh.categories || []).map(c => `<tr><td class="td-highlight">${c.name}</td><td><strong>${c.percentage}%</strong></td><td>${c.shares ? c.shares.toLocaleString() : '-'}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// GOVERNANCE VIEW
function renderGovernanceView() {
  const data = getDataStore();
  const g = data.governance || {};
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Corporate Governance</span>
      <h2 class="text-3xl font-bold text-white mt-1">Board of Directors (10 Members)</h2>
    </div>

    <div class="glass-card rounded-2xl overflow-hidden mb-8">
      <div class="overflow-x-auto">
        <table class="custom-table">
          <thead><tr><th>Director Name</th><th>Category</th><th>DIN / Age</th><th>Key Background</th></tr></thead>
          <tbody>
            ${(g.board || []).map(d => `<tr><td class="td-highlight">${d.name}</td><td>${d.designation}</td><td>DIN: ${d.din} | ${d.age} yrs</td><td style="white-space:normal; max-width:300px; font-size:12px;">${d.bio}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// MANAGEMENT VIEW
function renderManagementView() {
  const data = getDataStore();
  const m = data.management || {};
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Leadership</span>
      <h2 class="text-3xl font-bold text-white mt-1">Key Managerial Personnel (KMPs)</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      ${(m.kmps || []).map(k => `
        <div class="glass-card p-6 rounded-2xl">
          <h4 class="font-bold text-white text-lg">${k.name}</h4>
          <p class="text-xs text-sky-400 font-bold mb-2">${k.role}</p>
          <p class="text-xs text-gray-400">${k.highlights}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// SUBSIDIARIES VIEW
function renderSubsidiariesView() {
  const data = getDataStore();
  const sub = data.subsidiaries || {};
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Group Structure</span>
      <h2 class="text-3xl font-bold text-white mt-1">Consolidated Subsidiaries Structure</h2>
    </div>

    <div class="glass-card rounded-2xl overflow-hidden mb-8">
      <div class="overflow-x-auto">
        <table class="custom-table">
          <thead><tr><th>Subsidiary Entity</th><th>Equity Ownership</th><th>Business Category</th></tr></thead>
          <tbody>
            ${(sub.key || []).map(s => `<tr><td class="td-highlight">${s.name}</td><td><strong class="text-sky-400">${s.ownership}</strong></td><td>${s.category}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// RISK FACTORS VIEW
function renderRiskView() {
  const data = getDataStore();
  const rf = data.riskFactors || {};
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Risk Intelligence</span>
      <h2 class="text-3xl font-bold text-white mt-1">56 DRHP Risk Factors</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      ${(rf.list || []).map((r, idx) => `
        <div class="glass-card p-5 rounded-xl hover:border-sky-500/50 transition-all stagger-${(idx%6)+1}">
          <div class="cursor-glare"></div>
          <div class="flex justify-between items-center mb-2 relative z-10">
            <span class="text-xs font-bold text-gray-400">Risk #${r.id}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${r.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}">${r.severity} Severity</span>
          </div>
          <h4 class="font-bold text-white text-sm mb-1 relative z-10">${r.title}</h4>
          <p class="text-xs text-gray-400 relative z-10">${r.summary}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// LITIGATION VIEW
function renderLitigationView() {
  const data = getDataStore();
  const lit = data.litigation || {};
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Legal Disclosures</span>
      <h2 class="text-3xl font-bold text-white mt-1">Litigation & Tax Demands Master</h2>
    </div>

    <div class="glass-card rounded-2xl p-6 mb-8">
      <span class="text-xs text-gray-400 font-bold uppercase">Total Disclosed Tax Proceedings Claims</span>
      <h3 class="text-2xl font-bold text-amber-400 mt-1">${(lit.taxSummary && lit.taxSummary.totalAmount) || '₹497,263 Million'} (${(lit.taxSummary && lit.taxSummary.totalClaims) || 969} Cases)</h3>
    </div>

    <div class="glass-card rounded-2xl overflow-hidden mb-8">
      <div class="overflow-x-auto">
        <table class="custom-table">
          <thead><tr><th>Case ID</th><th>Entity</th><th>Forum</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            ${(lit.keyCases || []).map(k => `<tr><td class="td-highlight">${k.id}</td><td>${k.entity}</td><td>${k.forum}</td><td>${k.category}</td><td class="text-amber-400 font-bold">${k.amount}</td><td style="white-space:normal; max-width:260px; font-size:12px;">${k.status}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// TIMELINE VIEW
function renderTimelineView() {
  const data = getDataStore();
  const tl = data.timeline || [];
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Corporate History</span>
      <h2 class="text-3xl font-bold text-white mt-1">Milestones & History Timeline</h2>
    </div>

    <div class="space-y-4 mb-8">
      ${tl.map(t => `
        <div class="glass-card p-6 rounded-2xl border-l-4 border-l-sky-500">
          <span class="text-xs font-code-mono text-sky-400 font-bold">${t.date}</span>
          <h4 class="text-lg font-bold text-white mt-1">${t.title}</h4>
          <p class="text-xs text-gray-400 mt-1">${t.description}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// FINANCIAL DISCLOSURES VIEW
function renderNotesView() {
  const data = getDataStore();
  const rawNotes = data.notesToAccounts || [];
  const notes = [...rawNotes].sort((a, b) => (a.noteNo || 0) - (b.noteNo || 0));
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  const unitHeader = 'INR Million';

  const fmtNoteVal = (valInr) => {
    if (valInr === undefined || valInr === null || valInr === '-') return '-';
    const num = parseFloat(valInr);
    if (isNaN(num)) return valInr;
    return `${num.toLocaleString()} M`;
  };

  mainCanvas.innerHTML = `
    <div class="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <span class="text-xs font-code-mono text-sky-400 uppercase tracking-widest">Audited Disclosures</span>
          <h2 class="text-3xl font-bold text-white mt-1">Financial Disclosures Master</h2>
          <p class="text-sm text-gray-400 mt-1">Full verbatim line items extracted from DRHP Restated Consolidated Notes (Pages 302 to 375).</p>
        </div>
        <span class="px-3 py-1 bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-mono font-bold rounded-full">${notes.length} Disclosures</span>
      </div>
    </div>

    <div class="glass-card rounded-2xl overflow-hidden mb-8">
      <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h4 class="font-bold text-white text-sm">Notes 1 through 47 Detailed Master Schedule (Sorted)</h4>
        <span class="text-xs text-emerald-400 font-mono">100% DRHP Verified</span>
      </div>
      <div class="overflow-x-auto">
        <table class="custom-table text-xs">
          <thead>
            <tr>
              <th>Note No.</th>
              <th>Note Category</th>
              <th>Specific Disclosed Line Item</th>
              <th>FY2024</th>
              <th>FY2025</th>
              <th>FY2026 (DRHP)</th>
              <th>DRHP Page Ref</th>
            </tr>
          </thead>
          <tbody>
            ${notes.map(n => `
              <tr>
                <td><span class="font-mono text-sky-400 font-bold">Note ${n.noteNo}</span></td>
                <td class="td-highlight" style="white-space:normal; max-width:200px;">${n.title}</td>
                <td style="white-space:normal; max-width:280px; font-weight:600; color:#E2E8F0;">${n.lineItem}</td>
                <td>${fmtNoteVal(n.fy24)}</td>
                <td>${fmtNoteVal(n.fy25)}</td>
                <td><strong class="text-emerald-400">${fmtNoteVal(n.fy26)}</strong></td>
                <td><span class="text-xs font-mono text-gray-400">Pages ${n.page}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
