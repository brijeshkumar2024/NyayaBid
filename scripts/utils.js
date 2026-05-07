// ── SHARED DATA ──────────────────────────────────────
const STRICT_GOVERNANCE_MODE = true;
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

function sanitizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createSafeElement(tag, className, textContent, styles = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (textContent !== undefined) el.textContent = textContent;
  Object.assign(el.style, styles);
  return el;
}

function sanitizeFileName(name) {
  return sanitizeText(name)
    .replace(/[^a-zA-Z0-9._\-\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\.\s+/g, '.')
    .trim()
    .replace(/(\.[a-zA-Z0-9]+)$/g, (m) => m.toLowerCase());
}

function nowIso() {
  return new Date().toISOString();
}

function createEvidenceRecord(field, value, sourceDocument, pageNumber, extractionMethod, rawEvidenceSnippet, reviewStatus, startIndex, endIndex) {
  return {
    field: sanitizeText(field),
    value: sanitizeText(value),
    confidence: 0,
    sourceDocument: sanitizeFileName(sourceDocument || 'unknown'),
    pageNumber: Number.isFinite(pageNumber) ? pageNumber : 1,
    extractionMethod: sanitizeText(extractionMethod || 'unknown'),
    rawEvidenceSnippet: sanitizeText(rawEvidenceSnippet || ''),
    reviewStatus: sanitizeText(reviewStatus || 'NEEDS_HUMAN'),
    startIndex: Number.isFinite(startIndex) ? startIndex : -1,
    endIndex: Number.isFinite(endIndex) ? endIndex : -1
  };
}

function createReviewLogEntry(payload) {
  return {
    reviewerName: sanitizeText(payload?.reviewerName || ''),
    overrideReason: sanitizeText(payload?.overrideReason || ''),
    timestamp: nowIso(),
    reviewedCriterion: sanitizeText(payload?.reviewedCriterion || ''),
    officerNotes: sanitizeText(payload?.officerNotes || ''),
    status: sanitizeText(payload?.status || 'NEEDS_HUMAN')
  };
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

// Enhanced audit logging for officer overrides
function logOverride(overrideRecord) {
  const overrides = getStorage('officer-overrides', []);
  overrides.unshift(overrideRecord);
  if (overrides.length > 100) overrides.pop(); // Keep last 100 overrides
  setStorage('officer-overrides', overrides);
  
  // Also log in main audit trail
  logAction(`OVERRIDE: ${overrideRecord.officerName} changed ${overrideRecord.vendorName} from ${overrideRecord.originalDecision} to ${overrideRecord.overrideDecision} - ${overrideRecord.auditTrailId}`, overrideRecord.officerName);
}

function appendReviewLog(review) {
  const logs = getStorage('review-logs', []);
  logs.unshift(createReviewLogEntry(review));
  if (logs.length > 300) logs.pop();
  setStorage('review-logs', logs);
}

function renderUnifiedTimeline(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  
  const reviewLogs = getStorage('review-logs', []);
  const overrides = getStorage('officer-overrides', []);
  
  const allActions = [
    ...reviewLogs.map(l => ({ ...l, type: 'REVIEW' })),
    ...overrides.map(o => ({ ...o, type: 'OVERRIDE' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  if (!allActions.length) {
    wrap.textContent = 'No accountability records found.';
    return;
  }
  
  wrap.textContent = '';
  allActions.slice(0, 15).forEach((l) => {
    const row = createSafeElement('div', '', undefined, {
      display: 'flex',
      flexDirection: 'column',
      padding: '12px',
      marginBottom: '10px',
      background: 'rgba(255,255,255,0.02)',
      borderLeft: `3px solid ${l.type === 'OVERRIDE' ? 'var(--amber)' : 'var(--blue)'}`,
      borderRadius: '0 6px 6px 0',
      fontSize: '13px'
    });
    
    const top = createSafeElement('div', '', undefined, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '6px'
    });
    
    const badge = createSafeElement('span', l.type === 'OVERRIDE' ? 'badge badge-review' : 'badge badge-eligible', l.type === 'OVERRIDE' ? 'DECISION OVERRIDE' : 'FIELD VERIFIED', { fontSize: '10px' });
    const time = createSafeElement('span', '', new Date(l.timestamp).toLocaleString(), { fontSize: '11px', color: 'var(--text3)' });
    top.append(badge, time);
    
    let mainText = '';
    if (l.type === 'OVERRIDE') {
      mainText = `Officer ${l.officerName} changed ${l.vendorName} to ${l.overrideDecision}`;
    } else {
      mainText = `Officer ${l.reviewerName} verified ${l.reviewedCriterion}`;
    }
    
    const mid = createSafeElement('div', '', mainText, { fontWeight: '700', marginBottom: '4px' });
    
    const reasonText = `Reason: ${l.overrideReason || l.officerNotes || 'No reason provided'}`;
    const bot = createSafeElement('div', '', reasonText, { fontSize: '12px', color: 'var(--text2)', fontStyle: 'italic' });
    
    row.append(top, mid, bot);
    wrap.appendChild(row);
  });
}

function initDashboardData() {
  const existing = getStorage('all-tenders', null);
  if (!existing) {
    setStorage('all-tenders', SAMPLE_DASHBOARD_DATA);
    setStorage('audit-log', SAMPLE_DASHBOARD_DATA.auditLog);
  }
}

function resetDemoEnvironment(force = false) {
  if (STRICT_GOVERNANCE_MODE && !force) {
    const override = window.confirm('Strict governance mode is active. This action will clear the immutable audit trail. Confirm secure session reset?');
    if (!override) return;
  }
  
  const confirmMessage = force ? 'PERFORMING FORCE RESET...' : [
    'Reset Governance Session?',
    '',
    'This will clear:',
    '• evaluation results',
    '• audit reports',
    '• simulation state',
    '• activity timeline',
    '',
    'The application will reload with secure default state.'
  ].join('\n');

  if (!force && !window.confirm(confirmMessage)) return;

  // Clear all relevant storage keys
  const keysToClear = [
    'last-evaluation', 
    'audit-log', 
    'all-tenders', 
    'report-signoff', 
    'simulation-cache', 
    'demo-flags',
    'review-logs',
    'officer-overrides',
    'extraction-review-state',
    'extraction-review-log'
  ];

  keysToClear.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  });

  initDashboardData();
  showToast('Governance session reset successfully — System Ready', 'success');
  setTimeout(() => window.location.reload(), 500);
}

// Call on every page load
initDashboardData();

// ── EVALUATION LOGIC WITH EVIDENCE REQUIREMENTS ──────────────────────────────
function evaluateVendor(vendor, criteria) {
  try {
    if (!vendor || !criteria) return { vendorName: 'Unknown', status: 'Error', confidence: 0, checks: [] };
    
    const checks = [];
    let eligible = true;
    let needsReview = false;
    
    // Turnover check - requires evidence
    const turnoverEvidence = vendor.evidence?.minTurnover;
    const tPass = vendor.turnoverCr && vendor.turnoverCr >= criteria.minTurnoverCr;
    checks.push({
      criterion: 'Min Annual Turnover',
      required: '₹' + criteria.minTurnoverCr + ' Cr',
      found: vendor.turnoverCr ? '₹' + vendor.turnoverCr + ' Cr' : 'Not extracted',
      passed: tPass,
      evidence: turnoverEvidence,
      reason: tPass
        ? 'Turnover meets minimum requirement with evidence'
        : turnoverEvidence 
          ? 'Turnover below requirement (evidence available)'
          : 'Turnover not extracted - evidence unavailable'
    });
    if (!tPass) {
      eligible = false;
      if (!turnoverEvidence) needsReview = true;
    }

    // Experience check - requires evidence
    const experienceEvidence = vendor.evidence?.experienceYears;
    const ePass = vendor.experienceYears && vendor.experienceYears >= criteria.minExperienceYears;
    checks.push({
      criterion: 'Min Experience',
      required: criteria.minExperienceYears + ' years',
      found: vendor.experienceYears ? vendor.experienceYears + ' years' : 'Not extracted',
      passed: ePass,
      evidence: experienceEvidence,
      reason: ePass
        ? 'Experience meets requirement with evidence'
        : experienceEvidence
          ? 'Experience below requirement (evidence available)'
          : 'Experience not extracted - evidence unavailable'
    });
    if (!ePass) {
      eligible = false;
      if (!experienceEvidence) needsReview = true;
    }

    // GST check - requires evidence
    const gstEvidence = vendor.evidence?.gstNumber || vendor.evidence?.gstRequired;
    if (criteria.gstMandatory) {
      const gstPass = vendor.gstValid && vendor.gstNumber;
      checks.push({
        criterion: 'GST Registration',
        required: 'Valid GST',
        found: vendor.gstValid && vendor.gstNumber ? vendor.gstNumber : 'Invalid/Missing',
        passed: gstPass,
        evidence: gstEvidence,
        reason: gstPass
          ? 'Valid GST registration confirmed with evidence'
          : gstEvidence
            ? 'GST invalid or missing (evidence available)'
            : 'GST not extracted - evidence unavailable'
      });
      if (!gstPass) {
        eligible = false;
        if (!gstEvidence) needsReview = true;
      }
    }

    // Confidence threshold based on extraction quality
    if (vendor.confidence < 70) {
      needsReview = true;
    }

    const status = needsReview ? 'Needs Review' : eligible ? 'Eligible' : 'Not Eligible';
    const flagReason = needsReview
      ? vendor.confidence < 70
        ? 'Document confidence ' + vendor.confidence + '% is below threshold — manual verification required'
        : 'Missing evidence for critical criteria — manual verification required'
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
      isMSME: vendor.isMSME,
      evidence: vendor.evidence
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
    
    // Check for GST mismatches - requires evidence
    vendors.forEach((v) => {
      if (!v || !v.name) return;
      if (!v.gstValid && !v.evidence?.gstNumber) {
        flags.push({
          vendor: v.name,
          type: 'GST Evidence Missing',
          detail: 'GST certificate validation failed and no extraction evidence available',
          action: 'Request original GST certificate with notarized copy'
        });
      } else if (!v.gstValid && v.evidence?.gstNumber) {
        flags.push({
          vendor: v.name,
          type: 'GST Validation Failed',
          detail: 'GST number extracted but validation failed: ' + (v.gstNumber || 'N/A'),
          action: 'Verify GST number with government portal'
        });
      }
    });

    // Check for address overlaps - requires evidence
    for (let i = 0; i < vendors.length; i++) {
      for (let j = i + 1; j < vendors.length; j++) {
        // Only flag if we have evidence of addresses
        if (vendors[i].evidence?.address && vendors[j].evidence?.address) {
          if (vendors[i].evidence.address.value === vendors[j].evidence.address.value) {
            flags.push({
              vendor: vendors[i].name + ' & ' + vendors[j].name,
              type: 'Address Overlap Detected',
              detail: 'Identical registered addresses found with evidence: ' + vendors[i].evidence.address.value,
              action: 'Investigate potential proxy bidder arrangement'
            });
          }
        }
      }
    }

    // Check for GST number overlaps - requires evidence
    for (let i = 0; i < vendors.length; i++) {
      for (let j = i + 1; j < vendors.length; j++) {
        if (vendors[i].gstNumber && vendors[j].gstNumber && 
            vendors[i].evidence?.gstNumber && vendors[j].evidence?.gstNumber) {
          if (vendors[i].gstNumber === vendors[j].gstNumber) {
            flags.push({
              vendor: vendors[i].name + ' & ' + vendors[j].name,
              type: 'GST Number Overlap',
              detail: 'Same GST number used by multiple vendors: ' + vendors[i].gstNumber,
              action: 'Flag for CVC investigation - possible shell companies'
            });
          }
        }
      }
    }

    // Only flag bid similarity if we have substantial evidence of other overlaps
    const hasOtherEvidence = flags.some(f => f.type !== 'Bid Similarity');
    if (hasOtherEvidence) {
      for (let i = 0; i < vendors.length; i++) {
        for (let j = i + 1; j < vendors.length; j++) {
          if (vendors[i].bidValue && vendors[j].bidValue) {
            const diff = Math.abs(vendors[i].bidValue - vendors[j].bidValue) / Math.max(vendors[i].bidValue, vendors[j].bidValue);
            if (diff < 0.02) {
              flags.push({
                vendor: vendors[i].name + ' & ' + vendors[j].name,
                type: 'Bid Coordination Suspected',
                detail: 'Bid values within 2% when other collusion indicators present',
                action: 'Refer to CVC for comprehensive investigation'
              });
            }
          }
        }
      }
    }

    // If no evidence-based flags found, don't create false positives
    if (flags.length === 0) {
      return [{
        type: 'No Collusion Evidence',
        detail: 'Insufficient evidence for collusion determination',
        action: 'Continue monitoring procurement patterns'
      }];
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

// ── PROCUREMENT RELEVANCE VALIDATION ──────────────────────────────────────

// Check if document content is procurement-related
function validateProcurementRelevance(text, documentType = 'auto') {
  try {
    if (!text || typeof text !== 'string') {
      return { isRelevant: false, score: 0, reasons: ['No text content available'] };
    }

    const content = text.toLowerCase();
    let score = 0;
    const reasons = [];
    const indicators = {
      tender: ['tender', 'tnd-', 'notice inviting tender', 'nit', 'bid notice', 'eoi', 'rfp', 'request for proposal', 'procurement', 'quotation', 'purchase order', 'tender document', 'bid document'],
      vendor: ['vendor', 'supplier', 'bidder', 'contractor', 'company', 'firm', 'enterprise', 'gstin', 'gst number', 'pan number', 'registered office'],
      financial: ['turnover', 'rupees', '₹', 'cr', 'crore', 'lakh', 'l', 'amount', 'cost', 'price', 'emd', 'bid value', 'financial bid'],
      legal: ['gst', 'pan', 'tan', 'cin', 'registration', 'certificate', 'compliance', 'terms and conditions', 'eligibility criteria', 'prequalification'],
      technical: ['experience', 'years', 'work', 'project', 'infrastructure', 'construction', 'submission', 'scope', 'technical bid'],
      regulatory: ['gfr', 'cvc', 'government', 'department', 'authority', 'ministry', 'eprocurement', 'notice', 'department of', 'state of']
    };

    // Check for tender indicators
    const tenderMatches = indicators.tender.filter(term => content.includes(term)).length;
    if (tenderMatches > 0) {
      score += tenderMatches * 15;
      reasons.push(`${tenderMatches} tender-related terms found`);
    }

    // Check for vendor indicators
    const vendorMatches = indicators.vendor.filter(term => content.includes(term)).length;
    if (vendorMatches > 0) {
      score += vendorMatches * 10;
      reasons.push(`${vendorMatches} vendor-related terms found`);
    }

    // Check for financial indicators
    const financialMatches = indicators.financial.filter(term => content.includes(term)).length;
    if (financialMatches > 0) {
      score += financialMatches * 12;
      reasons.push(`${financialMatches} financial terms found`);
    }

    // Check for legal/compliance indicators
    const legalMatches = indicators.legal.filter(term => content.includes(term)).length;
    if (legalMatches > 0) {
      score += legalMatches * 20;
      reasons.push(`${legalMatches} legal/compliance terms found`);
    }

    // Check for technical indicators
    const technicalMatches = indicators.technical.filter(term => content.includes(term)).length;
    if (technicalMatches > 0) {
      score += technicalMatches * 8;
      reasons.push(`${technicalMatches} technical terms found`);
    }

    // Check for regulatory indicators
    const regulatoryMatches = indicators.regulatory.filter(term => content.includes(term)).length;
    if (regulatoryMatches > 0) {
      score += regulatoryMatches * 25;
      reasons.push(`${regulatoryMatches} regulatory terms found`);
    }

    // Penalize for non-procurement content
    const nonProcurementTerms = ['resume', 'cv', 'curriculum vitae', 'personal', 'salary', 'job', 'employment', 'interview', 'invoice', 'bill to', 'tax invoice'];
    const nonProcurementMatches = nonProcurementTerms.filter(term => content.includes(term)).length;
    if (nonProcurementMatches > 0) {
      score -= nonProcurementMatches * 30;
      reasons.push(`${nonProcurementMatches} non-procurement terms detected`);
    }

    const thresholds = { tender: 35, vendor: 18, auto: 28 };
    const threshold = thresholds[documentType] || thresholds.auto;
    const isRelevant = score >= threshold;

    return {
      isRelevant,
      score: Math.max(0, Math.min(100, score)),
      reasons,
      threshold,
      confidence: isRelevant ? Math.min(95, score) : Math.max(5, score - 20)
    };
  } catch (err) {
    console.error('Relevance validation error:', err);
    return { isRelevant: false, score: 0, reasons: ['Validation error occurred'] };
  }
}

// Extract text from PDF using pdf.js
async function extractPdfText(file) {
  try {
    if (typeof pdfjsLib === 'undefined') {
      console.warn('pdf.js not available');
      return { text: '', pages: [], confidence: 0, source: 'unavailable' };
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];
    
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str || '').join(' ').trim();
      pages.push({ page: i, text: pageText });
    }
    
    return {
      text: pages.map(p => p.text).join('\n'),
      pages,
      confidence: 90,
      source: 'pdf.js'
    };
  } catch (err) {
    console.error('PDF extraction error:', err);
    return { text: '', pages: [], confidence: 0, source: 'error' };
  }
}

// OCR fallback for scanned PDF pages
async function extractPdfImageText(file, maxPages = 2) {
  try {
    if (typeof pdfjsLib === 'undefined') {
      console.warn('PDF OCR fallback unavailable because pdf.js is not loaded');
      return { text: '', pages: [], confidence: 0, source: 'pdf.ocr-unavailable' };
    }
    if (typeof Tesseract === 'undefined') {
      console.warn('Tesseract.js not available for PDF OCR fallback');
      return { text: '', pages: [], confidence: 0, source: 'pdf.ocr-unavailable' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];
    let confidenceSum = 0;
    const pageLimit = Math.min(pdf.numPages, maxPages);

    for (let i = 1; i <= pageLimit; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      const ocrResult = await Tesseract.recognize(canvas, 'eng', {
        logger: () => {}
      });

      const pageText = (ocrResult?.data?.text || '').trim();
      const pageConfidence = Number(ocrResult?.data?.confidence || 0);
      confidenceSum += pageConfidence;
      pages.push({ page: i, text: pageText });
    }

    const averageConfidence = pages.length ? Math.round(confidenceSum / pages.length) : 0;
    return {
      text: pages.map(p => p.text).join('\n'),
      pages,
      confidence: averageConfidence,
      source: 'pdf.ocr'
    };
  } catch (err) {
    console.error('PDF OCR error:', err);
    return { text: '', pages: [], confidence: 0, source: 'pdf.ocr-error' };
  }
}

// OCR for images using Tesseract.js
async function extractImageText(file) {
  try {
    if (typeof Tesseract === 'undefined') {
      console.warn('Tesseract.js not available');
      return { text: '', confidence: 0, source: 'unavailable' };
    }
    
    const reader = new FileReader();
    const result = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    const { data } = await Tesseract.recognize(result, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing') {
          // Silent progress
        }
      }
    });
    
    return {
      text: data.text,
      confidence: Math.round(data.confidence),
      source: 'tesseract.js'
    };
  } catch (err) {
    console.error('Tesseract OCR error:', err);
    return { text: '', confidence: 0, source: 'error' };
  }
}

// Extract text from DOCX using mammoth.js
async function extractDocxText(file) {
  try {
    if (typeof mammoth === 'undefined') {
      console.warn('Mammoth.js not available');
      return { text: '', confidence: 0, source: 'unavailable' };
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return {
      text: result.value,
      confidence: 85,
      source: 'mammoth.js'
    };
  } catch (err) {
    console.error('DOCX extraction error:', err);
    return { text: '', confidence: 0, source: 'error' };
  }
}

// Regex-based field extraction from raw text with evidence tracking
function extractProcurementFields(text) {
  try {
    function normalizeExtractionText(input) {
      return String(input || '')
        .normalize('NFKC')
        .replace(/[–—]/g, '-')
        .replace(/[|]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\s*:\s*/g, ': ')
        .trim();
    }

    function firstMatch(content, patterns) {
      for (const pattern of patterns) {
        const m = content.match(pattern);
        if (m) return m;
      }
      return null;
    }

    function addEvidence(evidenceObj, key, value, match, snippetLabel = key) {
      if (!match || !value) return;
      evidenceObj[key] = createEvidenceRecord(
        key,
        value,
        sourceDocument,
        1,
        'regex_pattern',
        match[0] || snippetLabel,
        'AUTO_EXTRACTED',
        Number.isFinite(match.index) ? match.index : -1,
        Number.isFinite(match.index) ? match.index + String(match[0] || '').length : -1
      );
    }

    const normalizedText = normalizeExtractionText(text);
    const fields = {};
    const evidence = {};
    const sourceDocument = 'uploaded_document';
    
    function inferCroreFromIndianAmount(amountStr) {
      const digits = String(amountStr || '').replace(/[^\d.]/g, '');
      const amount = Number(digits);
      if (!Number.isFinite(amount) || amount <= 0) return null;
      return Math.round((amount / 10000000) * 100) / 100;
    }

    // Tender ID extraction
    const tenderIdMatch = firstMatch(normalizedText, [
      /\b(?:TND|NIT|RFP|RFQ|GEM)[-\/]?[A-Z0-9][A-Z0-9\-\/]{3,}\b/i,
      /\b(?:tender|bid|nit)\s*(?:reference|id|ref|no|number)?\s*[:\-]?\s*([A-Z0-9][A-Z0-9\-\/]{4,})\b/i,
      /\b(?:reference\s*no|reference)\s*[:\-]?\s*([A-Z0-9][A-Z0-9\-\/]{4,})\b/i
    ]);
    if (tenderIdMatch) {
      fields.tenderId = tenderIdMatch[1] ? tenderIdMatch[1].trim() : tenderIdMatch[0].trim();
      addEvidence(evidence, 'tenderId', fields.tenderId, tenderIdMatch, 'tender id');
    }
    
    // Project/Bid value: ₹X Cr/Lakh
    const valueMatch = firstMatch(normalizedText, [
      /(?:project value|estimated value|bid value|amount)\s*[:\-]?\s*₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(cr|crore|lakh|lac|l)\b/i,
      /₹\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(cr|crore|lakh|lac|l)\b/i
    ]);
    if (valueMatch) {
      fields.projectValue = valueMatch[1].replace(/,/g, '');
      addEvidence(evidence, 'projectValue', fields.projectValue, valueMatch, 'project value');
    }
    
    // Min turnover / turnover requirement (OCR-tolerant and phrasing-flexible)
    const turnoverPatterns = [
      /(?:minimum|annual|average|avg)?\s*(?:annual\s+)?turnover(?:\s+requirement)?\s*[:\-]?\s*₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(cr|crore|lakh|lac|l)\b/i,
      /(?:financial standing|turnover requirement)\s*[:\-]?\s*₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(cr|crore|lakh|lac|l)\b/i,
      /(?:minimum|annual|average|avg)?\s*(?:annual\s+)?turnover(?:\s+requirement)?\s*[:\-]?\s*₹\s*([\d,]+)(?:\s*\(\s*(\d+(?:\.\d+)?)\s*(cr|crore)\s*\))?/i,
      /(?:financial standing|turnover requirement)\s*[:\-]?\s*₹?\s*([\d,]+)(?:\s*\(\s*(\d+(?:\.\d+)?)\s*(cr|crore)\s*\))?/i
    ];
    let turnoverMatch = null;
    let turnoverCr = null;
    for (const pattern of turnoverPatterns) {
      turnoverMatch = normalizedText.match(pattern);
      if (!turnoverMatch) continue;
      const amountPrimary = turnoverMatch[1] ? Number(String(turnoverMatch[1]).replace(/,/g, '')) : null;
      const unitPrimary = String(turnoverMatch[2] || '').toLowerCase();
      const parenAmount = turnoverMatch[3] ? Number(turnoverMatch[3]) : null;
      const parenUnit = String(turnoverMatch[4] || '').toLowerCase();
      if (Number.isFinite(parenAmount) && parenAmount > 0 && (parenUnit.startsWith('c') || parenUnit.includes('crore'))) {
        turnoverCr = parenAmount;
      } else if (Number.isFinite(amountPrimary) && amountPrimary > 0) {
        if (unitPrimary.startsWith('l')) turnoverCr = Math.round((amountPrimary / 100) * 100) / 100;
        else if (unitPrimary.startsWith('c')) turnoverCr = amountPrimary;
        else turnoverCr = inferCroreFromIndianAmount(turnoverMatch[1]);
      }
      if (Number.isFinite(turnoverCr) && turnoverCr > 0) break;
    }
    if (Number.isFinite(turnoverCr) && turnoverCr > 0 && turnoverMatch) {
      fields.minTurnover = turnoverCr;
      fields.turnoverRequirement = turnoverCr;
      addEvidence(evidence, 'minTurnover', fields.minTurnover, turnoverMatch, 'turnover');
      addEvidence(evidence, 'turnoverRequirement', fields.turnoverRequirement, turnoverMatch, 'turnover requirement');
    }
    
    // Experience years / experience requirement
    const expMatch = firstMatch(normalizedText, [
      /(?:minimum|min|years?\s+of)?\s*experience\s*[:\-]?\s*(\d+)\s*(?:years?|yrs?)\b/i,
      /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)\b/i,
      /(?:minimum\s+)?(\d+)\s*(?:years?|yrs?)\s*(?:of\s+)?(?:technical\s+)?experience\b/i,
      /(?:technical\s+experience|project\s+experience|similar\s+projects|completed\s+projects)\s*[:\-]?\s*(\d+)\b/i
    ]);
    if (expMatch) {
      fields.experienceYears = parseInt(expMatch[1]);
      fields.experienceRequirement = fields.experienceYears;
      addEvidence(evidence, 'experienceYears', fields.experienceYears, expMatch, 'experience');
      addEvidence(evidence, 'experienceRequirement', fields.experienceRequirement, expMatch, 'experience requirement');
    }
    
    // EMD amount
    const emdMatch = firstMatch(normalizedText, [
      /emd\s*(?:amount)?\s*[:\-]?\s*₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lac|l|cr|crore)\b/i
    ]);
    if (emdMatch) {
      fields.emdAmount = emdMatch[1];
      evidence.emdAmount = createEvidenceRecord('emdAmount', fields.emdAmount, sourceDocument, 1, 'regex_pattern', emdMatch[0], 'AUTO_EXTRACTED', emdMatch.index, emdMatch.index + emdMatch[0].length);
    }
    
    // GST requirement
    const gstMatch = firstMatch(normalizedText, [
      /(?:valid\s+)?gst(?:\s+registration|\s+certificate|\s+number|\s+details)?\s*(?:is\s*)?(?:mandatory|required|compulsory)\b/i,
      /(?:gst required)\b/i
    ]);
    if (gstMatch) {
      fields.gstRequired = true;
      evidence.gstRequired = createEvidenceRecord('gstRequired', true, sourceDocument, 1, 'regex_pattern', gstMatch[0], 'AUTO_EXTRACTED', gstMatch.index, gstMatch.index + gstMatch[0].length);
    }

    // PAN requirement
    const panRequiredMatch = firstMatch(normalizedText, [
      /\bpan(?:\s+card|\s+number)?\s*(?:is\s*)?(?:mandatory|required|compulsory)\b/i,
      /\bvalid\s+pan(?:\s+card|\s+number)?\b/i
    ]);
    if (panRequiredMatch) {
      fields.panRequired = true;
      addEvidence(evidence, 'panRequired', true, panRequiredMatch, 'pan required');
    }

    const criteriaMatch = firstMatch(normalizedText, [
      /(?:eligibility criteria|pre-qualification|minimum eligibility|required qualification)/i
    ]);
    if (criteriaMatch) {
      fields.eligibilityCriteriaDetected = true;
      addEvidence(evidence, 'eligibilityCriteriaDetected', true, criteriaMatch, 'eligibility criteria');
    }
    
    // Deadline
    const deadlineMatch = text.match(/(\d{1,2})\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{4})/i);
    if (deadlineMatch) {
      fields.deadline = deadlineMatch[0];
      evidence.deadline = createEvidenceRecord('deadline', fields.deadline, sourceDocument, 1, 'regex_pattern', deadlineMatch[0], 'AUTO_EXTRACTED', deadlineMatch.index, deadlineMatch.index + deadlineMatch[0].length);
    }
    
    // Vendor name (common patterns)
    const vendorMatch = firstMatch(normalizedText, [
      /(?:company|vendor|bidder|supplier|firm|entity)\s*(?:name)?\s*[:\-]?\s*([A-Z][A-Za-z0-9\s&.,()\-]{2,})/i
    ]);
    if (vendorMatch) {
      fields.vendorName = vendorMatch[1].trim();
      evidence.vendorName = createEvidenceRecord('vendorName', fields.vendorName, sourceDocument, 1, 'regex_pattern', vendorMatch[0], 'AUTO_EXTRACTED', vendorMatch.index, vendorMatch.index + vendorMatch[0].length);
    }
    
    // GST number (Indian format: DDAAAAAAAADDDD)
    const gstNumberMatch = text.match(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}/);
    if (gstNumberMatch) {
      fields.gstNumber = gstNumberMatch[0];
      evidence.gstNumber = createEvidenceRecord('gstNumber', fields.gstNumber, sourceDocument, 1, 'regex_pattern', gstNumberMatch[0], 'AUTO_EXTRACTED', gstNumberMatch.index, gstNumberMatch.index + gstNumberMatch[0].length);
    }
    
    // PAN number (Indian format: AAAAA0000A)
    const panMatch = text.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
    if (panMatch) {
      fields.panNumber = panMatch[0];
      evidence.panNumber = createEvidenceRecord('panNumber', fields.panNumber, sourceDocument, 1, 'regex_pattern', panMatch[0], 'AUTO_EXTRACTED', panMatch.index, panMatch.index + panMatch[0].length);
    }
    
    // Authority (common pattern)
    const authMatch = firstMatch(normalizedText, [
      /(?:procuring entity|issued by|issuing authority|tendering authority|authority|department)\s*[:\-]?\s*([A-Z][A-Za-z0-9\s&.,()\-]{3,})/i,
      /(?:government of|dept\.?\s+of|department of|ministry)\s+([A-Z][A-Za-z0-9\s&.,()\-]{3,})/i,
      /\b(public works department|pwd|central public works department|cpwd|ministry of [a-z\s]+)\b/i,
      /\btender document\s*-\s*([A-Z][A-Za-z0-9\s&.,()\-]{3,})/i
    ]);
    if (authMatch) {
      fields.authority = authMatch[1].trim().replace(/\s{2,}/g, ' ');
      addEvidence(evidence, 'authority', fields.authority, authMatch, 'authority');
    }
    
    return { fields, evidence };
  } catch (err) {
    console.error('Field extraction error:', err);
    return { fields: {}, evidence: {} };
  }
}

// Main document extraction with source traceability and evidence
async function extractDocumentData(file, documentType = 'auto') {
  try {
    if (!file) return { success: false, message: 'No file provided' };
    
    const fileName = sanitizeFileName(file.name);
    const lowerFileName = fileName.toLowerCase();
    let extractedData = { text: '', confidence: 0, source: 'unknown' };
    
    // Determine file type and extract
    if (lowerFileName.endsWith('.pdf')) {
      extractedData = await extractPdfText(file);

      const noSelectableText = !extractedData.text?.trim();
      const canUseOcr = typeof Tesseract !== 'undefined';

      if ((noSelectableText || extractedData.source === 'error' || extractedData.source === 'unavailable') && canUseOcr) {
        const ocrPdf = await extractPdfImageText(file);
        if (ocrPdf.text && ocrPdf.text.trim()) {
          extractedData = ocrPdf;
        }
      }
    } else if (lowerFileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      extractedData = await extractImageText(file);
    } else if (lowerFileName.endsWith('.docx')) {
      extractedData = await extractDocxText(file);
    } else {
      return { success: false, message: 'Unsupported file format. Use PDF, DOCX, JPG, or PNG.', extractionStatus: 'UNVERIFIED' };
    }

    if (!extractedData.text || extractedData.confidence <= 0 || extractedData.source === 'unavailable' || extractedData.source === 'error') {
      const isPdf = lowerFileName.endsWith('.pdf');
      return {
        success: false,
        message: isPdf ? 'Unsupported or corrupted PDF' : 'Extraction failed — manual review required.',
        extractionStatus: 'UNVERIFIED',
        confidence: extractedData.confidence || 0
      };
    }
    
    // Validate procurement relevance first
    const relevanceCheck = validateProcurementRelevance(extractedData.text, documentType);
    if (!relevanceCheck.isRelevant) {
      return {
        success: false,
        message: 'No relevant procurement information detected.',
        relevanceScore: relevanceCheck.score,
        relevanceReasons: relevanceCheck.reasons,
        relevanceThreshold: relevanceCheck.threshold,
        extractionStatus: 'UNVERIFIED'
      };
    }
    
    // Extract fields with evidence
    const { fields, evidence } = extractProcurementFields(extractedData.text);
    
    return {
      success: extractedData.confidence >= 70,
      fileName,
      fileType: fileName.split('.').pop().toUpperCase(),
      extractedText: sanitizeText(extractedData.text.substring(0, 500)) + '...',
      fields,
      evidence,
      confidence: extractedData.confidence,
      relevanceScore: relevanceCheck.score,
      relevanceReasons: relevanceCheck.reasons,
      relevanceThreshold: relevanceCheck.threshold,
      source: extractedData.source,
      sourceTraceability: {
        fileName,
        extractionTime: new Date().toLocaleString(),
        method: extractedData.source,
        pages: extractedData.pages ? extractedData.pages.length : 1
      },
      extractionStatus: extractedData.confidence >= 70 ? 'VERIFIED' : 'REVIEW_REQUIRED'
    };
  } catch (err) {
    console.error('Document extraction error:', err);
    return { success: false, message: 'Extraction failed — manual review required.', extractionStatus: 'UNVERIFIED' };
  }
}

async function signAuditPayload(payloadText, signedBy) {
  try {
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );
    const signature = await crypto.subtle.sign(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      keyPair.privateKey,
      new TextEncoder().encode(payloadText)
    );
    const reportHash = await sha256(payloadText);
    return {
      reportHash,
      signedBy: sanitizeText(signedBy || 'Unknown Officer'),
      timestamp: nowIso(),
      verificationStatus: 'SIGNED',
      signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
      publicKey: await crypto.subtle.exportKey('jwk', keyPair.publicKey)
    };
  } catch (err) {
    console.error('Audit signing failed:', err);
    return {
      reportHash: await sha256(payloadText || ''),
      signedBy: sanitizeText(signedBy || 'Unknown Officer'),
      timestamp: nowIso(),
      verificationStatus: 'REVIEW REQUIRED'
    };
  }
}

// Process multiple files with pipeline animation
async function processTenderDocuments(files) {
  const results = [];
  for (const file of files) {
    const result = await extractDocumentData(file, 'tender');
    results.push(result);
  }
  return results;
}

async function processVendorDocuments(files) {
  const results = [];
  for (const file of files) {
    const result = await extractDocumentData(file, 'vendor');
    results.push(result);
  }
  return results;
}


/**
 * Calculate Procurement Fairness Score (PFS)
 * Factors: Competition density, MSME inclusion, Threshold tightness, Eligible ratio
 */
function calculatePFS(vendors, criteria, results) {
  if (!vendors || vendors.length === 0) return 0;
  
  const totalVendors = vendors.length;
  const eligibleVendors = results ? results.filter(r => r.status === 'Eligible').length : 0;
  const msmeCount = vendors.filter(v => v.isMSME).length;
  
  // 1. Competition Density (0-30 points)
  let competitionScore = totalVendors >= 5 ? 30 : totalVendors >= 3 ? 15 : 5;
  
  // 2. MSME Inclusion (0-25 points)
  let msmeScore = totalVendors > 0 ? (msmeCount / totalVendors) * 25 : 0;
  
  // 3. Eligible Ratio (0-25 points)
  let eligibilityScore = totalVendors > 0 ? (eligibleVendors / totalVendors) * 25 : 0;
  
  // 4. Threshold Fairness (0-10 points)
  let fairnessScore = (criteria && criteria.msmeRelaxation < 1) ? 10 : 5;

  // 5. Concentration Risk (0-10 points) - New Enterprise Metric
  // Deduct points if market is dominated by a single vendor
  let concentrationPenalty = 0;
  if (totalVendors > 1) {
    const turnovers = vendors.map(v => v.turnoverCr || 0);
    const totalTurnover = turnovers.reduce((a, b) => a + b, 0);
    const maxTurnover = Math.max(...turnovers);
    if (totalTurnover > 0 && (maxTurnover / totalTurnover) > 0.7) {
      concentrationPenalty = 10; // High concentration risk
    }
  }
  
  const total = Math.round(competitionScore + msmeScore + eligibilityScore + fairnessScore - concentrationPenalty);
  return Math.max(5, Math.min(100, total));
}
