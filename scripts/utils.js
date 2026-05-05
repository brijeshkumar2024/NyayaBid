const NVIDIA_CONFIG = {
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: '',
  model: 'openai/gpt-oss-120b'
};

function stableStringify(value) {
  if (Array.isArray(value)) {
    return '[' + value.map((item) => stableStringify(item)).join(',') + ']';
  }

  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort((left, right) => left.localeCompare(right));
    const parts = keys.map((key) => JSON.stringify(key) + ':' + stableStringify(value[key]));
    return '{' + parts.join(',') + '}';
  }

  return JSON.stringify(value);
}

function safeJSON(text, fallback = null) {
  if (text === null || text === undefined) return fallback;

  try {
    const value = typeof text === 'string' ? text : JSON.stringify(text);
    const cleaned = value.replaceAll('```json', '').replaceAll('```', '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn('safeJSON parse failed', error);
    return fallback;
  }
}

function getStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === '') return fallback;
    return safeJSON(raw, fallback);
  } catch (error) {
    console.warn('localStorage read failed', error);
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('localStorage write failed', error);
    return false;
  }
}

function getSafe(key, fallback = null) {
  try {
    const val = getStorage(key, undefined);
    if (val === undefined || val === null) return fallback;
    return val;
  } catch (err) {
    console.warn('getSafe failed for', key, err);
    return fallback;
  }
}

function ensureAllTendersSeeded() {
  try {
    const existing = getSafe('all-tenders', null);
    if (!existing || !Array.isArray(existing.tenders) || existing.tenders.length === 0) {
      const seed = {
        tenders: [{
          id: 'TND-DEM-001',
          title: DEMO_TENDER.tenderTitle,
          vendors: DEMO_VENDORS.length,
          eligible: Math.max(1, Math.floor(DEMO_VENDORS.length * 0.6)),
          flagged: 1,
          rejected: 0,
          status: 'Completed',
          date: new Date().toISOString(),
          tender: DEMO_TENDER
        }],
        auditLog: [
          { time: new Date().toISOString(), action: 'Demo data seeded', officer: 'System', step: 'Init' }
        ]
      };
      setStorage('all-tenders', seed);
      showToast('Initialized demo tenders for offline demo', 'success');
      return seed;
    }
    return existing;
  } catch (e) {
    console.error('ensureAllTendersSeeded failed', e);
    const fallbackSeed = {
      tenders: [{ id: 'demo-1', title: DEMO_TENDER.tenderTitle, tender: DEMO_TENDER, vendors: 0, eligible: 0, flagged: 0, rejected: 0, status: 'Completed', date: new Date().toISOString() }],
      auditLog: []
    };
    setStorage('all-tenders', fallbackSeed);
    showToast('Recovered tenders using demo data', 'warning');
    return fallbackSeed;
  }
}

function showToast(message, type = 'success') {
  const root = document.getElementById('toast-root') || (() => {
    const node = document.createElement('div');
    node.id = 'toast-root';
    node.className = 'toast-root';
    document.body.appendChild(node);
    return node;
  })();

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  root.appendChild(toast);

  globalThis.setTimeout(() => {
    toast.style.animation = 'slideDown 0.25s ease';
    globalThis.setTimeout(() => toast.remove(), 240);
  }, 2800);
}

function setButtonLoading(button, isLoading, loadingLabel = 'Working...') {
  if (!button) return;
  if (!button.dataset.originalLabel) {
    button.dataset.originalLabel = button.textContent || '';
  }
  button.disabled = Boolean(isLoading);
  button.classList.toggle('is-loading', Boolean(isLoading));
  button.textContent = isLoading ? loadingLabel : button.dataset.originalLabel;
}

function logAction(action, officer, details = {}) {
  try {
    const auditLog = getStorage('audit-log', []);
    auditLog.unshift({
      time: new Date().toISOString(),
      action,
      officer: officer || 'System',
      details
    });
    localStorage.setItem('audit-log', JSON.stringify(auditLog));
  } catch (error) {
    console.error('Audit log write failed', error);
  }
}

async function generateSHA256(text) {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(String(text ?? ''));
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function buildAuditHash(payload) {
  return generateSHA256(stableStringify(payload));
}

function calculateConfidence(vendor, criteria) {
  const vendorSignals = [
    vendor?.name,
    vendor?.city,
    vendor?.gstNumber,
    vendor?.bidValue,
    vendor?.turnoverCr,
    vendor?.experienceYears
  ];
  const dataCompleteness = Math.round((vendorSignals.filter((item) => item !== null && item !== undefined && item !== '').length / vendorSignals.length) * 100);
  const documentConfidence = Number.isFinite(Number(vendor?.confidence)) ? Number(vendor.confidence) : 55;
  const criteriaSignals = [criteria?.tenderId, criteria?.tenderTitle, criteria?.minTurnoverCr, criteria?.minExperienceYears, criteria?.gstMandatory, criteria?.isoCertRequired, criteria?.msmeAllowed];
  const criteriaClarity = Math.round((criteriaSignals.filter((item) => item !== null && item !== undefined && item !== '').length / criteriaSignals.length) * 100);
  const score = Math.max(0, Math.min(100, Math.round((documentConfidence * 0.5) + (dataCompleteness * 0.3) + (criteriaClarity * 0.2))));
  let label = 'Low Confidence';
  if (score >= 75) {
    label = 'High Confidence';
  } else if (score >= 50) {
    label = 'Needs Review';
  }

  return {
    score,
    label,
    dataCompleteness,
    criteriaClarity,
    documentConfidence
  };
}

function generateExplanation(vendorResult) {
  const failedCriteria = Array.isArray(vendorResult?.criterionResults)
    ? vendorResult.criterionResults.filter((criterion) => !criterion.passed)
    : [];

  const improvement = [];
  if (failedCriteria.length) {
    failedCriteria.forEach((criterion) => {
      if (/turnover/i.test(criterion.criterion)) {
        improvement.push('Increase turnover eligibility or apply under MSME relaxation.');
      } else if (/gst/i.test(criterion.criterion)) {
        improvement.push('Provide a valid GST certificate.');
      } else if (/experience/i.test(criterion.criterion)) {
        improvement.push('Submit additional project experience evidence.');
      } else if (/iso/i.test(criterion.criterion)) {
        improvement.push('Provide a valid ISO certificate if required.');
      } else {
        improvement.push('Provide supporting compliance documentation.');
      }
    });
  } else {
    improvement.push('Maintain current compliance and documentation quality.');
  }

  let summary = 'Marked for review because of low confidence or unresolved document risk.';
  if (vendorResult?.eligible) {
    summary = 'Selected because the vendor satisfies the published eligibility criteria.';
  } else if (failedCriteria.length) {
    const failureLabels = failedCriteria.map((criterion) => criterion.criterion.toLowerCase()).join(' and ');
    summary = 'Rejected due to ' + failureLabels + '.';
  }

  return {
    summary,
    keyFailures: failedCriteria.map((criterion) => criterion.reason),
    improvement
  };
}

function formatPairKey(leftName, rightName) {
  return [leftName, rightName].sort((left, right) => left.localeCompare(right)).join('::');
}

function collectGstPrefixFindings(vendorList, suspiciousVendors) {
  const findings = [];
  const gstGroups = new Map();

  vendorList.forEach((vendor) => {
    const prefix = String(vendor?.gstNumber || '').slice(0, 2);
    if (!prefix) return;
    const group = gstGroups.get(prefix) || [];
    group.push(vendor);
    gstGroups.set(prefix, group);
  });

  gstGroups.forEach((group, prefix) => {
    if (group.length <= 1) return;
    const names = group.map((vendor) => vendor.name);
    names.forEach((name) => suspiciousVendors.add(name));
    findings.push({
      type: 'GST_PREFIX',
      score: 18 + ((group.length - 2) * 4),
      title: 'Shared GST prefix ' + prefix,
      detail: names.join(', ') + ' share the same GST prefix.',
      vendors: names
    });
  });

  return findings;
}

function evaluateBidPair(left, right, suspiciousVendors, scoredPairs) {
  const leftBid = Number(left?.bidValue);
  const rightBid = Number(right?.bidValue);
  if (!Number.isFinite(leftBid) || !Number.isFinite(rightBid)) return null;

  const pairKey = formatPairKey(left.name, right.name);
  if (scoredPairs.has(pairKey)) return null;

  const averageBid = (leftBid + rightBid) / 2;
  const bidSpread = Math.abs(leftBid - rightBid) / Math.max(averageBid, 1);
  const sameCity = String(left?.city || '').toLowerCase() === String(right?.city || '').toLowerCase();

  if (bidSpread <= 0.01) {
    scoredPairs.add(pairKey);
    suspiciousVendors.add(left.name);
    suspiciousVendors.add(right.name);
    return {
      type: 'BID_CLUSTER',
      score: 20,
      title: 'Bid values clustered within 1%',
      detail: left.name + ' and ' + right.name + ' are bidding within a 1% band.',
      vendors: [left.name, right.name]
    };
  }

  if (sameCity && bidSpread <= 0.05) {
    scoredPairs.add(pairKey);
    suspiciousVendors.add(left.name);
    suspiciousVendors.add(right.name);
    return {
      type: 'CITY_CLUSTER',
      score: 12,
      title: 'Same city with similar bids',
      detail: left.name + ' and ' + right.name + ' operate in the same city and bid closely.',
      vendors: [left.name, right.name]
    };
  }

  return null;
}

function collectBidClusterFindings(vendorList, suspiciousVendors) {
  const findings = [];
  const scoredPairs = new Set();

  for (let leftIndex = 0; leftIndex < vendorList.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < vendorList.length; rightIndex += 1) {
      const left = vendorList[leftIndex];
      const right = vendorList[rightIndex];
      const finding = evaluateBidPair(left, right, suspiciousVendors, scoredPairs);
      if (finding) findings.push(finding);
    }
  }

  return findings;
}

function detectCollusionRisk(vendors = []) {
  const vendorList = Array.isArray(vendors) ? vendors : [];
  const suspiciousVendors = new Set();
  const findings = [
    ...collectGstPrefixFindings(vendorList, suspiciousVendors),
    ...collectBidClusterFindings(vendorList, suspiciousVendors)
  ];

  const riskScore = Math.min(100, findings.reduce((sum, finding) => sum + finding.score, 0));
  let level = 'LOW';
  let badgeClass = 'badge-eligible';
  if (riskScore >= 71) {
    level = 'HIGH';
    badgeClass = 'badge-ineligible';
  } else if (riskScore >= 31) {
    level = 'MEDIUM';
    badgeClass = 'badge-review';
  }

  return {
    score: riskScore,
    level,
    badgeClass,
    suspiciousVendors: Array.from(suspiciousVendors),
    findings
  };
}

function formatRiskLabel(score) {
  if (score >= 71) return 'HIGH';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
}

const DEMO_TENDER = {
  tenderId: 'TND-2024-001',
  tenderTitle: 'Road Construction Works',
  minTurnoverCr: 10,
  minExperienceYears: 5,
  gstMandatory: true,
  isoCertRequired: false,
  msmeAllowed: true
};

const DEMO_VENDORS = [
  { name: 'BuildCorp Industries', city: 'Delhi', turnoverCr: 18, experienceYears: 8, gstNumber: '07AABCB1234A1Z5', gstValid: true, isoValid: true, isMSME: false, bidValue: 38900000, confidence: 95 },
  { name: 'Singh Construction', city: 'Mumbai', turnoverCr: 12, experienceYears: 6, gstNumber: '27AABCS5678B1Z3', gstValid: true, isoValid: false, isMSME: true, bidValue: 42000000, confidence: 88 },
  { name: 'Sharma Builders', city: 'Jaipur', turnoverCr: 7, experienceYears: 4, gstNumber: '08AABCS9012C1Z1', gstValid: true, isoValid: false, isMSME: true, bidValue: 35000000, confidence: 82 },
  { name: 'Patel Group', city: 'Ahmedabad', turnoverCr: 22, experienceYears: 10, gstNumber: '24AABCP3456D1Z7', gstValid: true, isoValid: true, isMSME: false, bidValue: 44650000, confidence: 97 },
  { name: 'GreenBuild Contractors', city: 'Bangalore', turnoverCr: 9, experienceYears: 5, gstNumber: '29AABCG7890E1Z2', gstValid: false, isoValid: false, isMSME: false, bidValue: 41000000, confidence: 45 }
];

globalThis.NVIDIA_CONFIG = NVIDIA_CONFIG;
globalThis.safeJSON = safeJSON;
globalThis.getStorage = getStorage;
globalThis.showToast = showToast;
globalThis.setButtonLoading = setButtonLoading;
globalThis.logAction = logAction;
globalThis.generateSHA256 = generateSHA256;
globalThis.buildAuditHash = buildAuditHash;
globalThis.calculateConfidence = calculateConfidence;
globalThis.generateExplanation = generateExplanation;
globalThis.detectCollusionRisk = detectCollusionRisk;
globalThis.formatRiskLabel = formatRiskLabel;
globalThis.DEMO_TENDER = DEMO_TENDER;
globalThis.DEMO_VENDORS = DEMO_VENDORS;
globalThis.setStorage = setStorage;
globalThis.getSafe = getSafe;
globalThis.ensureAllTendersSeeded = ensureAllTendersSeeded;

globalThis.addEventListener('click', (e) => {
  if (e.target.closest('.reset-demo-action')) {
    if (globalThis.confirm('Clear all demo data and restart trial?')) {
      try { localStorage.clear(); globalThis.location.reload(); } catch (err) {}
    }
  }
});