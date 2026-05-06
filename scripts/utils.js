// ── SHARED DATA ──────────────────────────────────────
const DEMO_TENDER = {
  id: 'TND-2024-CRPF-001',
  title: 'Road Construction & Maintenance Works',
  authority: 'Delhi Public Works Department',
  date: '2024-01-15',
  minTurnoverCr: 10,
  minExperienceYears: 5,
  gstMandatory: true,
  isoCertRequired: false,
  msmeAllowed: true,
  otherCriteria: ['Valid PAN', 'No blacklisting by any Govt body', 'EMD of ₹2 Lakh']
};

const DEMO_VENDORS = [
  { name: 'BuildCorp Industries', city: 'Delhi', turnoverCr: 18, experienceYears: 8, gstNumber: '07AABCB1234A1Z5', gstValid: true, isoValid: true, isMSME: false, panValid: true, bidValue: 38900000, confidence: 95, docs: ['Financial Statement', 'GST Certificate', 'Experience Certificate', 'EMD Receipt'] },
  { name: 'Singh Construction', city: 'Mumbai', turnoverCr: 12, experienceYears: 6, gstNumber: '27AABCS5678B1Z3', gstValid: true, isoValid: false, isMSME: true, panValid: true, bidValue: 42000000, confidence: 88, docs: ['Financial Statement', 'GST Certificate', 'Experience Certificate', 'EMD Receipt'] },
  { name: 'Sharma Builders', city: 'Jaipur', turnoverCr: 7, experienceYears: 4, gstNumber: '08AABCS9012C1Z1', gstValid: true, isoValid: false, isMSME: true, panValid: true, bidValue: 35000000, confidence: 82, docs: ['Financial Statement', 'GST Certificate', 'Experience Certificate'] },
  { name: 'Patel Group', city: 'Ahmedabad', turnoverCr: 22, experienceYears: 10, gstNumber: '24AABCP3456D1Z7', gstValid: true, isoValid: true, isMSME: false, panValid: true, bidValue: 44650000, confidence: 97, docs: ['Financial Statement', 'GST Certificate', 'Experience Certificate', 'ISO Certificate', 'EMD Receipt'] },
  { name: 'GreenBuild Contractors', city: 'Bangalore', turnoverCr: 9, experienceYears: 5, gstNumber: '29AABCG7890E1Z2', gstValid: false, isoValid: false, isMSME: false, panValid: true, bidValue: 41000000, confidence: 45, docs: ['Financial Statement', 'Experience Certificate'] }
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
  } catch(e) { return null; }
}

function getStorage(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch(e) { return fallback; }
}

function setStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
}

function showToast(message, type='info', duration=4000) {
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
  setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, duration);
}

function logAction(action, officer='System AI') {
  const log = getStorage('audit-log', []);
  const now = new Date();
  const time = now.toISOString().slice(0,16).replace('T',' ');
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

// Call on every page load
initDashboardData();

// ── EVALUATION LOGIC ──────────────────────────────
function evaluateVendor(vendor, criteria) {
  const checks = [];
  let eligible = true;
  let needsReview = false;

  // Turnover
  const tPass = vendor.turnoverCr >= criteria.minTurnoverCr;
  checks.push({ criterion: 'Min Annual Turnover', required: '₹'+criteria.minTurnoverCr+' Cr', found: '₹'+vendor.turnoverCr+' Cr', passed: tPass, reason: tPass ? 'Turnover of ₹'+vendor.turnoverCr+'Cr meets the minimum ₹'+criteria.minTurnoverCr+'Cr requirement' : 'Turnover ₹'+vendor.turnoverCr+'Cr is below required ₹'+criteria.minTurnoverCr+'Cr' });
  if (!tPass) eligible = false;

  // Experience
  const ePass = vendor.experienceYears >= criteria.minExperienceYears;
  checks.push({ criterion: 'Min Experience', required: criteria.minExperienceYears+' years', found: vendor.experienceYears+' years', passed: ePass, reason: ePass ? vendor.experienceYears+' years experience meets the '+criteria.minExperienceYears+' year requirement' : 'Only '+vendor.experienceYears+' years experience — need '+criteria.minExperienceYears+' years' });
  if (!ePass) eligible = false;

  // GST
  if (criteria.gstMandatory) {
    checks.push({ criterion: 'GST Registration', required: 'Valid GST', found: vendor.gstValid ? vendor.gstNumber : 'Invalid/Missing', passed: vendor.gstValid, reason: vendor.gstValid ? 'Valid GST registration '+vendor.gstNumber+' confirmed' : 'GST certificate is invalid or not submitted — flagging for review' });
    if (!vendor.gstValid) { eligible = false; needsReview = true; }
  }

  // Confidence threshold
  if (vendor.confidence < 60) { needsReview = true; }

  const status = needsReview ? 'Needs Review' : (eligible ? 'Eligible' : 'Not Eligible');
  const flagReason = needsReview ? (vendor.confidence < 60 ? 'Document confidence '+vendor.confidence+'% is below threshold — manual verification required' : 'GST invalid — needs officer review') : null;

  return { vendorName: vendor.name, city: vendor.city, status, confidence: vendor.confidence, checks, flagForReview: needsReview, flagReason, turnoverCr: vendor.turnoverCr, experienceYears: vendor.experienceYears, gstValid: vendor.gstValid, isMSME: vendor.isMSME };
}

function detectCollusion(vendors) {
  const flags = [];
  // Check for GST mismatches
  vendors.forEach(v => {
    if (!v.gstValid) flags.push({ vendor: v.name, type: 'GST Mismatch', detail: 'GST certificate could not be validated', action: 'Verify directly with GST portal' });
    if (v.confidence < 60) flags.push({ vendor: v.name, type: 'Low Confidence', detail: 'Document confidence '+v.confidence+'% — possible scan quality issue or data mismatch', action: 'Request original documents' });
  });
  // Check for similar bid values (collusion signal)
  for (let i=0; i<vendors.length; i++) {
    for (let j=i+1; j<vendors.length; j++) {
      if (vendors[i].bidValue && vendors[j].bidValue) {
        const diff = Math.abs(vendors[i].bidValue - vendors[j].bidValue) / Math.max(vendors[i].bidValue, vendors[j].bidValue);
        if (diff < 0.02) flags.push({ vendor: vendors[i].name+' & '+vendors[j].name, type: 'Collusion Risk', detail: 'Bid values within 2% of each other — possible bid coordination', action: 'Refer to CVC for investigation' });
      }
    }
  }
  return flags;
}

// SHA-256 for report verification
async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
