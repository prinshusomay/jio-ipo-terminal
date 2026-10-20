// Jio IPO Dashboard - Unified Data Store with Advanced Peer Comparison & Scenario Data
window.JioData = {
  company: {
    name: "Reliance Jio Infocomm Limited",
    issuer: "Jio Platforms Limited",
    branding: "JIO-IPO Dashboard",
    cin: "U72900GJ2019PLC110816",
    drhpDate: "June 19, 2026",
    drhpPages: 528,
    registeredOffice: "Office-101, Saffron, Nr. Centre Point, Panchwati 5 Rasta, Ambawadi, Ahmedabad 380 006, Gujarat, India",
    corporateOffice: "TC-22, 5th Floor, A Wing, Reliance Corporate Park, Thane Belapur Road, Ghansoli, Navi Mumbai 400 701, Maharashtra, India",
    website: "www.jio.com",
    promoter: "Reliance Industries Limited",
    promoterHolding: "66.43%",
    companySecretary: "Ms. Savithri Parekh",
    complianceOfficer: "Mr. Venkataraman Ramachandran",
    ceo: "Mr. Pankaj Mohan Pawar",
    cfo: "Mr. Saurabh Sancheti",
    chairman: "Mr. Mukesh Dhirubhai Ambani",
    md: "Mr. Akash Mukesh Ambani",
    jointAuditors: "Chaturvedi & Shah LLP and Deloitte Haskins & Sells LLP",
    snapshot: {
      tagline: "India's premier digital technology platform powering pan-India 5G and high-speed broadband.",
      incorporation: "November 15, 2019",
      businessModel: "Unified digital service platform combining high-speed mobile connectivity (4G/5G), FTTH/AirFiber fixed broadband, enterprise cloud/IoT solutions, and proprietary digital software.",
      marketTam: "$1.4 Trillion (₹125.8 Trillion) by FY2031 (Source: Analysys Mason Report, June 16, 2026)",
      subscribers: 524.4,
      fiveGSubscribers: 268.5,
      fixedBroadband: 27.1,
      marketShareData: "~60% of India's total wireless data traffic (Source: Analysys Mason Report, DRHP Page 142)",
      spectrumHolding: "26,800.8 MHz across 22 telecom circles (Avg remaining life: 16.0 years)",
      patents: 6817,
      rndHeadcount: 11303
    }
  },
  financials: {
    units: "₹ Million",
    fiscalYears: ["FY2024", "FY2025", "FY2026"],
    pnl: {
      revenueFromOperations: { fy24: 1095581, fy25: 1282184, fy26: 1468853, note: "Note 26", label: "Revenue from Operations" },
      otherIncome: { fy24: 6173, fy25: 11146, fy26: 28738, note: "Note 27", label: "Other Income" },
      totalIncome: { fy24: 1101754, fy25: 1293330, fy26: 1497591, note: "-", label: "Total Income" },
      networkExpenses: { fy24: 303377, fy25: 333546, fy26: 344924, note: "Note 28", label: "Network Operating Expenses" },
      accessCharges: { fy24: 10662, fy25: 12810, fy26: 16369, note: "-", label: "Access Charges" },
      licenseFees: { fy24: 92134, fy25: 104953, fy26: 117104, note: "-", label: "License Fees & Spectrum Charges" },
      employeeExpenses: { fy24: 53823, fy25: 62079, fy26: 66487, note: "Note 29", label: "Employee Benefits Expense" },
      financeCosts: { fy24: 40476, fy25: 49051, fy26: 86534, note: "Note 30", label: "Finance Costs" },
      depreciation: { fy24: 221031, fy25: 241376, fy26: 272489, note: "Note 1", label: "Depreciation & Amortisation" },
      sellingDistribution: { fy24: 25454, fy25: 36950, fy26: 45648, note: "Note 31", label: "Selling & Distribution Expenses" },
      otherExpenses: { fy24: 66717, fy25: 101292, fy26: 144505, note: "Note 32", label: "Other Expenses" },
      totalExpenses: { fy24: 813674, fy25: 942057, fy26: 1094060, note: "-", label: "Total Expenses" },
      pbt: { fy24: 288080, fy25: 351273, fy26: 403531, note: "-", label: "Profit Before Tax (excl JV share)" },
      currentTax: { fy24: 702, fy25: 838, fy26: 1180, note: "Note 33", label: "Current Tax" },
      deferredTax: { fy24: 73038, fy25: 89232, fy26: 101824, note: "Note 33", label: "Deferred Tax" },
      pat: { fy24: 214340, fy25: 261203, fy26: 300527, note: "-", label: "Profit After Tax" },
      basicEps: { fy24: 23.96, fy25: 29.21, fy26: 33.63, note: "Note 34", label: "Basic EPS (₹)" },
      dilutedEps: { fy24: 23.93, fy25: 29.17, fy26: 33.59, note: "Note 34", label: "Diluted EPS (₹)" }
    }
  },
  ratios: {
    ebitdaMargin: { fy24: 50.16, fy25: 50.05, fy26: 51.91 },
    patMargin: { fy24: 19.56, fy25: 20.37, fy26: 20.46 },
    ronw: { fy24: 8.02, fy25: 8.97, fy26: 9.42 },
    netLeverage: { fy24: 0.88, fy25: 0.52, fy26: 0.36 },
    navPerShare: { fy24: 310.85, fy25: 340.11, fy26: 373.66 }
  },
  peerComparison: {
    peers: [
      { operator: "Reliance Jio Infocomm", subscribersM: 524.4, fiveGSubscribersM: 268.5, arpuRs: 181.7, ebitdaMarginPct: 51.91, netLeverageX: 0.36, fiveGTechnology: "5G Standalone (SA)", marketLeader: true },
      { operator: "Bharti Airtel", subscribersM: 352.1, fiveGSubscribersM: 90.0, arpuRs: 209.0, ebitdaMarginPct: 52.40, netLeverageX: 2.80, fiveGTechnology: "5G Non-Standalone (NSA)", marketLeader: false },
      { operator: "Vodafone Idea", subscribersM: 212.6, fiveGSubscribersM: 5.0, arpuRs: 146.0, ebitdaMarginPct: 40.10, netLeverageX: 14.50, fiveGTechnology: "4G/5G Hybrid", marketLeader: false }
    ]
  },
  governance: {
    board: [
      { name: "Mr. Mukesh Dhirubhai Ambani", designation: "Chairman & Non-Executive Director", din: "00001695", age: 69, bio: "Chairman & Managing Director of Reliance Industries Limited." },
      { name: "Mr. Akash Mukesh Ambani", designation: "Managing Director", din: "06989825", age: 34, bio: "Pioneered Jio's 4G and 5G network architecture and digital ecosystem." },
      { name: "Isha Mukesh Ambani", designation: "Non-Executive Director", din: "06989815", age: 34, bio: "Drives digital commerce, retail integration, and Jio ecosystem consumer services." },
      { name: "Anant Mukesh Ambani", designation: "Non-Executive Director", din: "07945702", age: 31, bio: "Focuses on green energy, data center infrastructure, and renewable power." },
      { name: "Pankaj Mohan Pawar", designation: "Whole-Time Director & CEO", din: "00085077", age: 54, bio: "25+ years in telecom; leads pan-India operations and 5G deployment." },
      { name: "K.V. Chowdary", designation: "Independent Director", din: "08485341", age: 71, bio: "Former Central Vigilance Commissioner & Chairman of CBDT." },
      { name: "Shumeet Banerji", designation: "Independent Director", din: "02787784", age: 66, bio: "Former CEO of Booz & Company; renowned global strategic advisor." },
      { name: "Dipak C. Jain", designation: "Independent Director", din: "00228513", age: 68, bio: "Former Dean of Kellogg School of Management & INSEAD." },
      { name: "Raminder Singh Gujral", designation: "Independent Director", din: "07175393", age: 72, bio: "Former Finance Secretary & Revenue Secretary, Government of India." },
      { name: "Sunita Maheshwari", designation: "Independent Director", din: "01099684", age: 58, bio: "Pediatric cardiologist & co-founder of Teleradiology Solutions." }
    ]
  },
  management: {
    kmps: [
      { name: "Pankaj Mohan Pawar", role: "Chief Executive Officer & Whole-Time Director", highlights: "Drives pan-India 5G SA rollout, subscriber retention, and network infrastructure." },
      { name: "Saurabh Sancheti", role: "Chief Financial Officer", highlights: "Overcomes capital structure planning, treasury operations, and debt refinancing." },
      { name: "Venkataraman Ramachandran", role: "Company Secretary & Compliance Officer", highlights: "Manages corporate governance, SEBI ICDR compliance, and statutory disclosures." }
    ]
  },
  ipoDetails: {
    issueType: "100% Book Built Issue",
    freshIssue: "Up to 270,000,000 Equity Shares",
    ofs: "Not Applicable",
    objectsOfIssue: [
      { object: "Prepayment/repayment of outstanding borrowings of Material Subsidiary RJIL", amount: "Up to ₹275,000 Million", rationale: "Reduces debt servicing costs and preserves capital for 5G densification & broadband." },
      { object: "General Corporate Purposes", amount: "Not Disclosed (Capped at 25% Gross Proceeds)", rationale: "R&D in 6G/AI and strategic tech growth." }
    ],
    brlms: [
      "Kotak Mahindra Capital", "Morgan Stanley India", "BofA Securities India", "Axis Capital", "BNP Paribas",
      "Citigroup Global Markets", "CLSA India", "DAM Capital Advisors", "Goldman Sachs (India)", "HDFC Bank",
      "HSBC Securities", "ICICI Securities", "IIFL Capital Services", "Jefferies India", "JM Financial",
      "J.P. Morgan India", "SBI Capital Markets", "UBS Securities India", "360 ONE WAM"
    ]
  },
  shareholding: {
    categories: [
      { name: "Promoter — Reliance Industries Limited", percentage: 66.43, shares: 5937841645, color: "#1E3A8A" },
      { name: "Jaadhu Holdings, LLC (Meta Affiliate)", percentage: 9.98, shares: 892275913, color: "#2563EB" },
      { name: "Google International LLC", percentage: 7.73, shares: 690947702, color: "#3B82F6" },
      { name: "Public & Institutional Shareholders", percentage: 15.86, shares: 1417965570, color: "#60A5FA" }
    ]
  },
  spectrum: {
    totalQuantum: "26,800.8 MHz",
    circles: [
      { name: "Delhi LSA", totalQuantum: 1220.0, breakdown: "700MHz (10MHz), 800MHz (10MHz), 1800MHz (15MHz), 2300MHz (40MHz), 3300MHz (100MHz), 26GHz (1000MHz)" },
      { name: "Mumbai LSA", totalQuantum: 1220.0, breakdown: "700MHz (10MHz), 800MHz (10MHz), 1800MHz (15MHz), 2300MHz (40MHz), 3300MHz (100MHz), 26GHz (1000MHz)" },
      { name: "Kolkata LSA", totalQuantum: 1220.0, breakdown: "700MHz (10MHz), 800MHz (10MHz), 1800MHz (15MHz), 2300MHz (40MHz), 3300MHz (100MHz), 26GHz (1000MHz)" },
      { name: "Maharashtra & Goa", totalQuantum: 1220.0, breakdown: "700MHz (10MHz), 800MHz (10MHz), 1800MHz (15MHz), 2300MHz (40MHz), 3300MHz (100MHz), 26GHz (1000MHz)" },
      { name: "Gujarat LSA", totalQuantum: 1220.0, breakdown: "700MHz (10MHz), 800MHz (10MHz), 1800MHz (15MHz), 2300MHz (40MHz), 3300MHz (100MHz), 26GHz (1000MHz)" },
      { name: "Andhra Pradesh & Telangana", totalQuantum: 1220.0, breakdown: "700MHz (10MHz), 800MHz (10MHz), 1800MHz (15MHz), 2300MHz (40MHz), 3300MHz (100MHz), 26GHz (1000MHz)" },
      { name: "Karnataka LSA", totalQuantum: 1220.0, breakdown: "700MHz (10MHz), 800MHz (10MHz), 1800MHz (15MHz), 2300MHz (40MHz), 3300MHz (100MHz), 26GHz (1000MHz)" },
      { name: "Tamil Nadu & Chennai", totalQuantum: 1220.0, breakdown: "700MHz (10MHz), 800MHz (10MHz), 1800MHz (15MHz), 2300MHz (40MHz), 3300MHz (100MHz), 26GHz (1000MHz)" }
    ]
  },
  riskFactors: {
    list: [
      { id: 1, severity: "High", title: "Spectrum renewal and auction acquisition risks", summary: "High capital expenditure required for future spectrum auctions and DoT fee commitments." },
      { id: 2, severity: "High", title: "Network and technology disruption risk", summary: "Disruptions in passive infrastructure or fiber cuts could impair service quality." },
      { id: 6, severity: "High", title: "Cybersecurity and data privacy breach risk", summary: "Breaches or subscriber data leak could lead to regulatory penalties and loss of trust." },
      { id: 7, severity: "High", title: "Significant indebtedness and obligation servicing", summary: "₹1,045,137M spectrum deferred payment liabilities to DoT require substantial cash flow servicing." },
      { id: 8, severity: "High", title: "Highly regulated telecom business environment", summary: "Subject to evolving Telecommunications Act 2023, TRAI tariff orders, and QoS penalty disincentives." },
      { id: 16, severity: "High", title: "Outstanding legal & tax proceedings", summary: "Tax disputes (₹497B total claims), DoT spectrum usage dispute (₹13.89B), TRAI disincentives (~₹271M)." },
      { id: 27, severity: "High", title: "Related party transactions with Reliance Group", summary: "Significant ongoing RPTs across tower leasing, fiber, distribution, and IT services." },
      { id: 35, severity: "High", title: "Promoter's continuing substantial shareholding (66.43%)", summary: "RIL retains controlling voting power post-listing." }
    ]
  },
  litigation: {
    taxSummary: { totalClaims: 969, totalAmount: "₹497,263 Million (₹497.26 Billion)" },
    keyCases: [
      { id: "SUB-18", entity: "RJIL", forum: "TDSAT / Supreme Court", category: "Spectrum SUC", amount: "₹13,891 Million", status: "TDSAT quashed demand; DoT appeal pending before Supreme Court." },
      { id: "SUB-16", entity: "RJIL", forum: "TRAI / TDSAT", category: "QoS Disincentives", amount: "~₹271 Million", status: "TDSAT granted interim stay against TRAI disincentives." },
      { id: "RIL-5", entity: "RIL (Promoter)", forum: "Supreme Court / SAT", category: "SEBI RPL Scrip", amount: "₹4,473M Disgorgement", status: "Supreme Court (May 2026) held 'fraud' NOT established under PFUTP; RIL complied." }
    ]
  },
  timeline: [
    { date: "Dec 9, 2011", title: "JIO Brand Registration", description: "Promoter files initial 'JIO' trademark applications." },
    { date: "Sep 5, 2016", title: "Commercial 4G VoLTE Launch", description: "Pan-India 4G VoLTE network launched; 100M users reached in 180 days." },
    { date: "Nov 15, 2019", title: "Jio Platforms Incorporation", description: "Digital technology holding company incorporated." },
    { date: "Apr-Jul 2020", title: "Landmark $20B Investment", description: "Raises ₹1,520,553M from Meta, Google, PIF, Silver Lake, KKR, Vista, GA, etc." },
    { date: "Oct 2022", title: "5G Standalone Rollout", description: "Launches 5G SA network across 700MHz, 3300MHz, and 26GHz bands." },
    { date: "Jun 19, 2026", title: "DRHP Filing with SEBI", description: "Filing of 528-page Draft Red Herring Prospectus for Jio IPO." }
  ],
  subsidiaries: {
    key: [
      { name: "Reliance Jio Infocomm Limited (RJIL)", ownership: "100.00%", category: "Telecom & Connectivity" },
      { name: "Saavn Media Limited (JioSaavn)", ownership: "88.15%", category: "Audio Streaming" },
      { name: "Radisys Corporation", ownership: "100.00%", category: "5G Software" },
      { name: "Reverie Language Technologies", ownership: "84.56%", category: "Indic Vernacular AI" },
      { name: "Jio Haptik Technologies", ownership: "100.00%", category: "Conversational AI" }
    ]
  },
  notesToAccounts: [
    { noteNo: 1, title: "Property, Plant & Equipment", lineItem: "Land (Own Assets)", fy24: 18815, fy25: 18805, fy26: 18800, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Property, Plant & Equipment", lineItem: "Buildings (Own Assets)", fy24: 14520, fy25: 14017, fy26: 13167, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Property, Plant & Equipment", lineItem: "Plant and Machinery (Own Assets)", fy24: 1317695, fy25: 1699999, fy26: 2321273, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Property, Plant & Equipment", lineItem: "Equipments (Own Assets)", fy24: 1928, fy25: 1268, fy26: 915, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Property, Plant & Equipment", lineItem: "Furniture and Fixtures", fy24: 194, fy25: 154, fy26: 114, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Property, Plant & Equipment", lineItem: "Vehicles", fy24: 24, fy25: 24, fy26: 20, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Property, Plant & Equipment", lineItem: "Total Own Assets Net Carrying Value", fy24: 1353177, fy25: 1734267, fy26: 2354289, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Right of Use Assets", lineItem: "Plant and Machinery (ROU Towers & Fiber)", fy24: 132041, fy25: 135091, fy26: 152600, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Right of Use Assets", lineItem: "Total Right of Use Assets", fy24: 135561, fy25: 138442, fy26: 155627, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Other Intangible Assets", lineItem: "Software", fy24: 37170, fy25: 43249, fy26: 59561, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Other Intangible Assets", lineItem: "Platform and Product Development", fy24: 62774, fy25: 134644, fy26: 251544, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Depreciation Breakdown", lineItem: "Depreciation on PPE Own Assets", fy24: 122612, fy25: 136002, fy26: 124939, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Depreciation Breakdown", lineItem: "Depreciation on ROU Assets", fy24: 32007, fy25: 31668, fy26: 55920, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Depreciation Breakdown", lineItem: "Amortisation of Spectrum", fy24: 54873, fy25: 59740, fy26: 74791, unit: "INR Million", page: "302 to 307" },
    { noteNo: 1, title: "Depreciation Breakdown", lineItem: "Amortisation of Other Intangibles", fy24: 11764, fy25: 14127, fy26: 20325, unit: "INR Million", page: "302 to 307" },
    { noteNo: 2, title: "Goodwill", lineItem: "Goodwill on Business Combinations", fy24: 38483, fy25: 38483, fy26: 38170, unit: "INR Million", page: "307" },
    { noteNo: 3, title: "Non-Current Investments", lineItem: "Investment in Associate Two Platforms Inc", fy24: 962, fy25: 848, fy26: 0, unit: "INR Million", page: "308, 309" },
    { noteNo: 3, title: "Non-Current Investments", lineItem: "Investment in Joint Venture Jio Space Technology", fy24: 40, fy25: 41, fy26: 41, unit: "INR Million", page: "308, 309" },
    { noteNo: 3, title: "Non-Current Investments", lineItem: "Other Investments at FVOCI", fy24: 25170, fy25: 27999, fy26: 37713, unit: "INR Million", page: "308, 309" },
    { noteNo: 5, title: "Deferred Tax", lineItem: "Deferred Tax Liabilities Net", fy24: 218849, fy25: 308646, fy26: 412104, unit: "INR Million", page: "309 to 311" },
    { noteNo: 5, title: "Deferred Tax", lineItem: "Net Deferred Tax Liability", fy24: -218339, fy25: -308239, fy26: -411573, unit: "INR Million", page: "309 to 311" },
    { noteNo: 8, title: "Current Investments", lineItem: "Callable Corporate Instruments at Amortised Cost", fy24: 0, fy25: 138000, fy26: 192500, unit: "INR Million", page: "312" },
    { noteNo: 8, title: "Current Investments", lineItem: "Mutual Funds at FVTPL", fy24: 6869, fy25: 38934, fy26: 36799, unit: "INR Million", page: "312" },
    { noteNo: 10, title: "Cash & Cash Equivalents", lineItem: "Balances with Banks", fy24: 23037, fy25: 12858, fy26: 15767, unit: "INR Million", page: "314" },
    { noteNo: 10, title: "Cash & Cash Equivalents", lineItem: "Fixed Deposits with Banks", fy24: 1852, fy25: 67257, fy26: 149803, unit: "INR Million", page: "314" },
    { noteNo: 14, title: "Share Capital", lineItem: "Issued & Paid-up Equity Shares", fy24: 89390, fy25: 89390, fy26: 89390, unit: "INR Million", page: "316, 317" },
    { noteNo: 15, title: "Other Equity", lineItem: "Securities Premium Reserve", fy24: 1965152, fy25: 1965152, fy26: 1965152, unit: "INR Million", page: "317, 318" },
    { noteNo: 15, title: "Other Equity", lineItem: "Retained Earnings", fy24: 712091, fy25: 978193, fy26: 1269374, unit: "INR Million", page: "317, 318" },
    { noteNo: 16, title: "Non-Current Borrowings", lineItem: "Term Loans from Banks", fy24: 370380, fy25: 443819, fy26: 505380, unit: "INR Million", page: "318, 319" },
    { noteNo: 17, title: "Deferred Payment Liabilities", lineItem: "DoT Spectrum Liabilities Non-Current", fy24: 1082697, fy25: 1044099, fy26: 995517, unit: "INR Million", page: "320" },
    { noteNo: 17, title: "Deferred Payment Liabilities", lineItem: "March 2021 Spectrum Auction Payable (7.30%)", fy24: 0, fy25: 0, fy26: 302123, unit: "INR Million", page: "320" },
    { noteNo: 17, title: "Deferred Payment Liabilities", lineItem: "August 2022 Spectrum Auction Payable (7.20%)", fy24: 0, fy25: 0, fy26: 734251, unit: "INR Million", page: "320" },
    { noteNo: 17, title: "Deferred Payment Liabilities", lineItem: "July 2024 Spectrum Auction Payable (8.65%)", fy24: 0, fy25: 0, fy26: 8763, unit: "INR Million", page: "320" },
    { noteNo: 21, title: "Current Borrowings", lineItem: "Unsecured Bank Loans", fy24: 44914, fy25: 129002, fy26: 144992, unit: "INR Million", page: "320, 321" },
    { noteNo: 21, title: "Current Borrowings", lineItem: "Commercial Papers", fy24: 24691, fy25: 79390, fy26: 982, unit: "INR Million", page: "320, 321" },
    { noteNo: 26, title: "Revenue from Operations", lineItem: "Value of Services", fy24: 1274094, fy25: 1490873, fy26: 1691349, unit: "INR Million", page: "322" },
    { noteNo: 26, title: "Revenue from Operations", lineItem: "Less GST Recovered", fy24: -189632, fy25: -220518, fy26: -254319, unit: "INR Million", page: "322" },
    { noteNo: 28, title: "Network Operating Expenses", lineItem: "Rent and Service Charges", fy24: 106629, fy25: 114727, fy26: 96409, unit: "INR Million", page: "325" },
    { noteNo: 28, title: "Network Operating Expenses", lineItem: "Power and Fuel", fy24: 95141, fy25: 95794, fy26: 109328, unit: "INR Million", page: "325" },
    { noteNo: 28, title: "Network Operating Expenses", lineItem: "Fibre Usage & Network Costs", fy24: 72827, fy25: 91787, fy26: 100364, unit: "INR Million", page: "325" },
    { noteNo: 30, title: "Finance Costs", lineItem: "Interest Expenses", fy24: 29015, fy25: 37964, fy26: 73033, unit: "INR Million", page: "325" },
    { noteNo: 30, title: "Finance Costs", lineItem: "Interest on Lease Liabilities", fy24: 11461, fy25: 11087, fy26: 13501, unit: "INR Million", page: "325" },
    { noteNo: 32, title: "Other Expenses", lineItem: "Professional Fees", fy24: 22690, fy25: 26280, fy26: 31453, unit: "INR Million", page: "326" },
    { noteNo: 32, title: "Other Expenses", lineItem: "Content Charges", fy24: 3623, fy25: 9153, fy26: 17348, unit: "INR Million", page: "326" },
    { noteNo: 32, title: "Other Expenses", lineItem: "Corporate Social Responsibility (CSR)", fy24: 4190, fy25: 5035, fy26: 5982, unit: "INR Million", page: "326" },
    { noteNo: 38, title: "Capital Management & Debt", lineItem: "Gross Debt", fy24: 543489, fy25: 730603, fy26: 707810, unit: "INR Million", page: "357" },
    { noteNo: 38, title: "Capital Management & Debt", lineItem: "Cash & Marketable Securities", fy24: 59089, fy25: 277869, fy26: 432018, unit: "INR Million", page: "357" },
    { noteNo: 38, title: "Capital Management & Debt", lineItem: "Net Debt", fy24: 484400, fy25: 452734, fy26: 275792, unit: "INR Million", page: "357" },
    { noteNo: 44, title: "CSR Spend by Category", lineItem: "Healthcare", fy24: 1304, fy25: 1205, fy26: 1932, unit: "INR Million", page: "374" },
    { noteNo: 44, title: "CSR Spend by Category", lineItem: "Education & Skill Development", fy24: 1490, fy25: 2001, fy26: 1364, unit: "INR Million", page: "374" },
    { noteNo: 44, title: "CSR Spend by Category", lineItem: "Environment & Animal Welfare", fy24: 523, fy25: 719, fy26: 1306, unit: "INR Million", page: "374" }
  ]
};
