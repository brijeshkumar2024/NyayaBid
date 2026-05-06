// ── SHARED DATA ──────────────────────────────────────
const DEMO_TENDER = {
  id: 'TND-2024-CRPF-001',
  title: 'Road Construction & Maintenance Works',
  authority: 'Delhi Public Works Department (DPWD)',
  tenderId: 'TND-2024-CRPF-001',
  category: 'Infrastructure & Civil Engineering',
  estimatedValue: '₹42 Crore',
  duration: '18 Months',
  location: 'New Delhi, India',
  deadline: '15 February 2026',
  method: 'Open Competitive Bidding',

  minTurnoverCr: 10,
  minExperienceYears: 5,
  gstMandatory: true,

  complexity: 'HIGH',
  reason:
    'Large-scale public infrastructure project involving financial, technical, and regulatory evaluation',

  aiConfidence: 96,
  totalCriteria: 14,
  mandatoryChecks: 9,
  technicalParams: 5,

  criteriaSections: [
    {
      title: '📋 Financial Requirements',
      chips: [
        'Minimum Annual Turnover: ₹10 Cr',
        'EMD Deposit: ₹2 Lakh',
        'Financial statements for last 3 years required',
        'Bid validity: 120 days'
      ]
    },
    {
      title: '🏗 Technical Requirements',
      chips: [
        'Minimum Experience: 5 years',
        'Minimum 2 completed government infrastructure projects',
        'At least 25 skilled workers available',
        'Road safety compliance declaration required'
      ]
    },
    {
      title: '⚖ Compliance Requirements',
      chips: [
        'GST Registration Mandatory',
        'Valid PAN Required',
        'PF & ESI registration mandatory',
        'Labour compliance certificate mandatory',
        'ISO 9001 certification preferred',
        'No blacklisting by any Govt authority'
      ]
    },
    {
      title: '🛡 Regulatory Alignment',
      chips: [
        'GFR Rule 160',
        'GFR Rule 175',
        'CVC Procurement Guidelines 2023',
        'MSME Procurement Policy'
      ]
    }
  ],

  requiredDocuments: [
    'GST Certificate',
    'PAN Card',
    'Financial Statements (3 Years)',
    'Experience Certificates',
    'EMD Receipt',
    'Labour Compliance Certificate',
    'PF/ESI Registration',
    'Bank Solvency Certificate',
    'Project Completion Certificates'
  ]
};

const DEMO_VENDORS = [
  {
    name: 'BuildCorp Industries',
    city: 'Delhi',
    turnoverCr: 18,
    experienceYears: 12,
    gstNumber: '07AABCB1234A1Z5',
    gstValid: true,
    isoValid: true,
    isMSME: false,
    panValid: true,
    bidValue: 4200000000,
    confidence: 95,
    docs: [
      'Financial Statement FY21-23',
      'GST Certificate',
      '12 Exp Certs',
      'EMD Receipt',
      'PF/ESI Reg'
    ]
  },
  {
    name: 'Sunrise Tech Solutions',
    city: 'Pune',
    turnoverCr: 7,
    experienceYears: 5,
    gstNumber: '27AAJCS2098M1Z1',
    gstValid: true,
    isoValid: false,
    isMSME: true,
    panValid: true,
    bidValue: 3950000000,
    confidence: 88,
    docs: [
      'Financial Statement',
      'GST Certificate',
      '5 Exp Certs',
      'EMD Receipt',
      'Labour Comp Cert'
    ]
  },
  {
    name: 'GreenBuild Contractors',
    city: 'Delhi NCR',
    turnoverCr: 12,
    experienceYears: 9,
    gstNumber: '07AABCG4567P1ZA',
    gstValid: true,
    isoValid: false,
    isMSME: false,
    panValid: true,
    bidValue: 4050000000,
    confidence: 92,
    docs: ['Financial Statement', 'GST Certificate (flagged)', '9 Exp Certs', 'EMD Receipt']
  },
  {
    name: 'Mohanty Civil Works',
    city: 'Bhubaneswar',
    turnoverCr: 3,
    experienceYears: 4,
    gstNumber: null,
    gstValid: false,
    isoValid: false,
    isMSME: true,
    panValid: true,
    bidValue: 3850000000,
    confidence: 45,
    docs: ['Financial Statement', 'Exp Certs (2)', 'Labour Comp']
  },
  {
    name: 'Pioneer Systems Ltd',
    city: 'Chennai',
    turnoverCr: 15,
    experienceYears: 11,
    gstNumber: '33AACCP7654N1ZT',
    gstValid: true,
    isoValid: true,
    isMSME: false,
    panValid: true,
    bidValue: 4100000000,
    confidence: 97,
    docs: [
      'Financial FY21-23',
      'GST Cert',
      '11 Exp Certs',
      'ISO 9001',
      'EMD Receipt',
      'Road Safety Decl'
    ]
  }
];

const SIM_VENDORS = [
  { name: 'BuildCorp Industries', city: 'Delhi', turnoverCr: 85, experienceYears: 12, gstValid: true, isoValid: true, isMSME: false },
  { name: 'Singh Construction', city: 'Mumbai', turnoverCr: 25, experienceYears: 6, gstValid: true, isoValid: true, isMSME: true },
  { name: 'Sharma Builders', city: 'Bangalore', turnoverCr: 12, experienceYears: 3, gstValid: true, isoValid: false, isMSME: true },
  { name: 'Patel Group', city: 'Hyderabad', turnoverCr: 55, experienceYears: 8, gstValid: true, isoValid: true, isMSME: false },
  { name: 'Kumar Associates', city: 'Chennai', turnoverCr: 18, experienceYears: 4, gstValid: false, isoValid: true, isMSME: true },
  { name: 'Reddy Constructions', city: 'Pune', turnoverCr: 42, experienceYears: 7, gstValid: true, isoValid: true, isMSME: false },
  { name: 'Verma Enterprises', city: 'Ahmedabad', turnoverCr: 15, experienceYears: 2, gstValid: true, isoValid: false, isMSME: true },
  { name: 'Gupta Infrastructure', city: 'Kolkata', turnoverCr: 95, experienceYears: 15, gstValid: true, isoValid: true, isMSME: false },
  { name: 'Nair Group', city: 'Kochi', turnoverCr: 8, experienceYears: 1, gstValid: true, isoValid: false, isMSME: true },
  { name: 'Mishra & Co', city: 'Lucknow', turnoverCr: 35, experienceYears: 5, gstValid: true, isoValid: true, isMSME: false }
];

const SAMPLE_DASHBOARD_DATA = {
  tenders: [
    { id: 'TND-2024-001', title: 'Road Construction Works — Delhi PWD', vendors: 5, eligible: 3, flagged: 1, rejected: 1, status: 'Completed', date: '2024-01-15' },
    { id: 'TND-2024-002', title: 'Govt Building Construction — CPWD', vendors: 4, eligible: 2, flagged: 1, rejected: 1, status: 'Completed', date: '2024-01-18' },
    { id: 'TND-2024-003', title: 'IT Infrastructure Supply — NIC', vendors: 6, eligible: 4, flagged: 0, rejected: 2, status: 'Under Review', date: '2024-01-20' }
  ],
  auditLog: [
    { time: '2024-01-20 14:35', action: 'Flag raised — GreenBuild Contractors — GST mismatch detected', officer: 'System AI' },
    { time: '2024-01-20 14:34', action: '6 vendor documents processed for TND-2024-003', officer: 'System AI' },
    { time: '2024-01-20 14:33', action: 'Criteria extracted from TND-2024-003 — 4 criteria found', officer: 'System AI' },
    { time: '2024-01-18 11:20', action: 'Report finalized and signed — TND-2024-002', officer: 'Priya Sharma' },
    { time: '2024-01-18 10:15', action: 'Manual override — Mohanty Civil Works — justified by officer', officer: 'Amit Singh' },
    { time: '2024-01-15 09:52', action: 'Officer sign-off complete — TND-2024-001', officer: 'Rajesh Kumar, Deputy Director' },
    { time: '2024-01-15 09:44', action: 'Collusion risk detected — address overlap — Mohanty Civil Works', officer: 'System AI' },
    { time: '2024-01-15 09:42', action: 'Evaluation started — TND-2024-001 — 5 vendors submitted', officer: 'Rajesh Kumar' }
  ]
};

// ── UTILITIES ──────────────────────────────────────
function safeJSON(text) {
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    return null;
  }
}

function getStorage(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function logAction(action, officer = 'System AI') {
  const log = getStorage('audit-log', []);
  const now = new Date();
  const time = now.toISOString().slice(0, 16).replace('T', ' ');
  log.unshift({ time, action, officer });
  if (log.length > 50) log.pop();
  setStorage('audit-log', log);
}

function initDashboardData() {
  const existing = getStorage('all-tenders', null);
  if (!existing) {
    setStorage('all-tenders', SAMPLE_DASHBOARD_DATA);
    setStorage('audit-log', SAMPLE_DASHBOARD_DATA.auditLog);
  }
}

function resetDemoEnvironment() {
  const confirmMessage = [
    'Reset Demo Environment?',
    '',
    'This will clear:',
    '• evaluation results',
    '• audit reports',
    '• simulation state',
    '• activity timeline',
    '',
    'The application will reload with fresh demo data.'
  ].join('\n');

  if (!window.confirm(confirmMessage)) return;

  ['last-evaluation', 'audit-log', 'all-tenders', 'report-signoff', 'simulation-cache', 'demo-flags'].forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  });

  initDashboardData();
  showToast('Demo environment reset successfully', 'success');
  setTimeout(() => window.location.reload(), 250);
}

// Call on every page load
initDashboardData();

// ── EVALUATION LOGIC ──────────────────────────────
function evaluateVendor(vendor, criteria) {
  try {
    if (!vendor || !criteria) return { vendorName: 'Unknown', status: 'Error', confidence: 0, checks: [] };
    
    const checks = [];
    let eligible = true;
    let needsReview = false;

  // Turnover
  const tPass = vendor.turnoverCr >= criteria.minTurnoverCr;
  checks.push({
    criterion: 'Min Annual Turnover',
    required: '₹' + criteria.minTurnoverCr + ' Cr',
    found: '₹' + vendor.turnoverCr + ' Cr',
    passed: tPass,
    reason: tPass
      ? 'Turnover of ₹' + vendor.turnoverCr + 'Cr meets the minimum ₹' + criteria.minTurnoverCr + 'Cr requirement'
      : 'Turnover ₹' + vendor.turnoverCr + 'Cr is below required ₹' + criteria.minTurnoverCr + 'Cr'
  });
  if (!tPass) eligible = false;

  // Experience
  const ePass = vendor.experienceYears >= criteria.minExperienceYears;
  checks.push({
    criterion: 'Min Experience',
    required: criteria.minExperienceYears + ' years',
    found: vendor.experienceYears + ' years',
    passed: ePass,
    reason: ePass
      ? vendor.experienceYears + ' years experience meets the ' + criteria.minExperienceYears + ' year requirement'
      : 'Only ' + vendor.experienceYears + ' years experience — need ' + criteria.minExperienceYears + ' years'
  });
  if (!ePass) eligible = false;

  // GST
  if (criteria.gstMandatory) {
    checks.push({
      criterion: 'GST Registration',
      required: 'Valid GST',
      found: vendor.gstValid ? vendor.gstNumber : 'Invalid/Missing',
      passed: vendor.gstValid,
      reason: vendor.gstValid
        ? 'Valid GST registration ' + vendor.gstNumber + ' confirmed'
        : 'GST certificate is invalid or not submitted — flagging for review'
    });
    if (!vendor.gstValid) {
      eligible = false;
      needsReview = true;
    }
  }

  // Confidence threshold
  if (vendor.confidence < 60) {
    needsReview = true;
  }

  const status = needsReview ? 'Needs Review' : eligible ? 'Eligible' : 'Not Eligible';
  const flagReason = needsReview
    ? vendor.confidence < 60
      ? 'Document confidence ' + vendor.confidence + '% is below threshold — manual verification required'
      : 'GST invalid — needs officer review'
    : null;

  return {
    vendorName: vendor.name,
    city: vendor.city,
    status,
    confidence: vendor.confidence,
    checks,
    flagForReview: needsReview,
    flagReason,
    turnoverCr: vendor.turnoverCr,
    experienceYears: vendor.experienceYears,
    gstValid: vendor.gstValid,
    isMSME: vendor.isMSME
  };
  } catch (err) {
    console.error('Evaluation error for vendor:', vendor, err);
    return {
      vendorName: vendor ? vendor.name : 'Unknown',
      status: 'Error',
      confidence: 0,
      checks: [],
      flagForReview: true,
      flagReason: 'Evaluation processing error'
    };
  }
}

function detectCollusion(vendors) {
  try {
    if (!vendors || !Array.isArray(vendors)) return [];
    
    const flags = [];
    // Check for GST mismatches
    vendors.forEach((v) => {
      if (!v || !v.name) return;
      if (!v.gstValid)
      flags.push({
        vendor: v.name,
        type: 'GST Mismatch',
        detail: 'GST certificate could not be validated',
        action: 'Verify directly with GST portal'
      });
    if (v.confidence < 60)
      flags.push({
        vendor: v.name,
        type: 'Low Confidence',
        detail: 'Document confidence ' + v.confidence + '% — possible scan quality issue or data mismatch',
        action: 'Request original documents'
      });
  });

  // Check for similar bid values (collusion signal)
  for (let i = 0; i < vendors.length; i++) {
    for (let j = i + 1; j < vendors.length; j++) {
      if (vendors[i].bidValue && vendors[j].bidValue) {
        const diff =
          Math.abs(vendors[i].bidValue - vendors[j].bidValue) /
          Math.max(vendors[i].bidValue, vendors[j].bidValue);
        if (diff < 0.02)
          flags.push({
            vendor: vendors[i].name + ' & ' + vendors[j].name,
            type: 'Collusion Risk',
            detail: 'Bid values within 2% of each other — possible bid coordination',
            action: 'Refer to CVC for investigation'
          });
      }
    }
  }

  return flags;
  } catch (err) {
    console.error('Collusion detection error:', err);
    return [];
  }
}

// SHA-256 for report verification
async function sha256(text) {
  try {
    if (!text) return '';
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    console.error('SHA-256 error:', e);
    return 'HASH_UNAVAILABLE';
  }
}

