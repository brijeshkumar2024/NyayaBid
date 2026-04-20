(function () {
  const root = globalThis;
  root.NyayaBid = root.NyayaBid || {};

  function showToast(message, type) {
    const rootEl = document.getElementById('global-toast-root');
    if (!rootEl) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type || ''}`;
    toast.textContent = message;
    rootEl.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      root.setTimeout(function () { toast.remove(); }, 240);
    }, 3000);
  }

  function formatDateNow() {
    return root.NyayaBid.utils.formatDate(new Date());
  }

  function navigateWithFade(href) {
    document.body.style.transition = 'opacity 0.2s ease';
    document.body.style.opacity = '0';
    setTimeout(function () {
      root.location.href = href;
    }, 200);
  }

  function enablePageTransitions() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(function () {
      document.body.style.opacity = '1';
    });

    document.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = link.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
        if (!href.endsWith('.html') && !href.includes('.html')) return;
        e.preventDefault();
        navigateWithFade(href);
      });
    });
  }

  function findEvaluationEntry(rows, vendorId) {
    for (const row of rows) {
      if (row.vendor.id === vendorId) return row;
    }
    return null;
  }

  function speakDecision(entry) {
    if (!entry || !root.speechSynthesis) return;
    const msg = `${entry.vendor.name} is ${entry.result.status}. ${entry.result.reasons.join('. ')}`;
    root.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
  }

  function setActiveNav() {
    const current = document.body.dataset.activeNav;
    if (!current) return;
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.dataset.nav === current) {
        link.classList.add('is-active');
      }
    });
  }

  function animateMetricCards() {
    document.querySelectorAll('[data-countup]').forEach(function (el) {
      const target = Number(el.dataset.countup || '0');
      if (!Number.isFinite(target)) return;
      const start = performance.now();
      const duration = 800;

      function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = String(Math.floor(progress * target));
        if (progress < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    });
  }

  function injectSidebarIcons() {
    const icons = {
      overview: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="2"></rect><rect x="13" y="3" width="8" height="5" rx="2"></rect><rect x="13" y="10" width="8" height="11" rx="2"></rect><rect x="3" y="13" width="8" height="8" rx="2"></rect></svg>',
      evaluate: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M4 5h16"></path><path d="M4 12h10"></path><path d="M4 19h7"></path><circle cx="18" cy="12" r="3"></circle></svg>',
      simulate: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M4 18h16"></path><path d="M6 15V9"></path><path d="M12 15V6"></path><path d="M18 15v-3"></path></svg>',
      report: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path></svg>',
      settings: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"></path></svg>'
    };
    document.querySelectorAll('.sidebar-link[data-icon]').forEach(function (link) {
      if (link.querySelector('svg')) return;
      link.insertAdjacentHTML('afterbegin', icons[link.dataset.icon] || '');
    });
  }

  function bindKeyboardShortcuts() {
    document.addEventListener('keydown', function (event) {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const key = event.key.toLowerCase();
      const map = { d: 'dashboard.html', e: 'evaluate.html', s: 'simulation.html', r: 'report.html' };
      if (!map[key]) return;
      const isRoot = root.location.pathname.endsWith('/index.html') || root.location.pathname.endsWith('/nyayabid/') || root.location.pathname.endsWith('/nyayabid');
      const target = isRoot ? `pages/${map[key]}` : map[key];
      root.location.href = target;
    });
  }

  function addGlobalFooterHint() {
    const footer = document.createElement('footer');
    footer.className = 'global-footer-hint';
    footer.textContent = 'Press D → Dashboard  |  E → Evaluate  |  S → Simulate  |  R → Report';
    document.body.appendChild(footer);
  }

  function addDemoModeBadge() {
    if (document.body.dataset.page === 'index') return;
    const badge = document.createElement('div');
    badge.className = 'demo-mode-badge';
    badge.textContent = '● DEMO MODE';
    document.body.appendChild(badge);
  }

  function addJudgeDemoHelper() {
    const page = document.body.dataset.page;
    if (page === 'index') return;

    const helper = document.createElement('button');
    helper.className = 'judge-helper-btn';
    helper.type = 'button';
    helper.innerHTML = '▶';
    helper.setAttribute('aria-label', 'Judge demo helper');

    const popup = document.createElement('div');
    popup.className = 'judge-helper-popup hidden';

    const scripts = {
      dashboard: 'Start here. Point to metric cards. Mention 3 tenders evaluated.',
      evaluate: "Click 'Use demo tender'. Then 'Run Evaluation'. Point to flags.",
      simulation: 'Move turnover slider to ₹4Cr. Watch CAG warning appear.',
      report: "Scroll all sections. Click 'Digitally Sign'. Show PDF download."
    };
    popup.textContent = scripts[page] || 'Run the prepared demo flow.';

    helper.addEventListener('click', function () {
      popup.classList.toggle('hidden');
    });

    document.body.appendChild(helper);
    document.body.appendChild(popup);
  }

  function updateSettingsConfidenceLabel(confidenceInput, confidenceValue) {
    if (!confidenceInput || !confidenceValue) return;
    confidenceValue.textContent = `${confidenceInput.value}%`;
  }

  function initLandingPage() {
    const page = document.querySelector('[data-page="index"]');
    if (!page) return;
    const modal = document.getElementById('flowchart-modal');
    const openBtn = document.getElementById('open-flowchart');
    const closeBtn = document.getElementById('close-flowchart');

    openBtn.addEventListener('click', function () {
      modal.classList.add('show');
    });
    closeBtn.addEventListener('click', function () {
      modal.classList.remove('show');
    });
    modal.addEventListener('click', function (event) {
      if (event.target === modal) modal.classList.remove('show');
    });
  }

  function initDashboardPage() {
    const page = document.querySelector('[data-page="dashboard"]');
    if (!page) return;

    const settingsStorageKey = 'nyayabid_settings';
    const defaultSettings = {
      minBidderThreshold: 3,
      confidenceThreshold: 70,
      collusionAutoFlag: true,
      crossDocAutoFlag: true,
      gfrRuleVersion: 'GFR 2017 (Current)',
      reportHeader: 'Government of India',
      defaultIssuingAuthority: 'Delhi Public Works Department',
      includeCagReference: true,
      reportLanguage: 'English',
      autoGenerateReport: false,
      showUncertaintyAlerts: true,
      showCagWarnings: true,
      showCollusionAlerts: true,
      alertSound: false,
      demoMode: true,
      auditTrailRetention: '30 days',
      dataExportFormat: 'PDF'
    };

    function getSettingsElements() {
      return {
        minBidderThreshold: document.getElementById('settings-min-bidder-threshold'),
        confidenceThreshold: document.getElementById('settings-confidence-threshold'),
        confidenceValue: document.getElementById('settings-confidence-value'),
        collusionAutoFlag: document.getElementById('settings-collusion-auto-flag'),
        crossDocAutoFlag: document.getElementById('settings-crossdoc-auto-flag'),
        gfrRuleVersion: document.getElementById('settings-gfr-version'),
        reportHeader: document.getElementById('settings-report-header'),
        defaultIssuingAuthority: document.getElementById('settings-default-authority'),
        includeCagReference: document.getElementById('settings-include-cag-reference'),
        reportLanguage: document.getElementById('settings-report-language'),
        autoGenerateReport: document.getElementById('settings-auto-generate-report'),
        showUncertaintyAlerts: document.getElementById('settings-show-uncertainty-alerts'),
        showCagWarnings: document.getElementById('settings-show-cag-warnings'),
        showCollusionAlerts: document.getElementById('settings-show-collusion-alerts'),
        alertSound: document.getElementById('settings-alert-sound'),
        demoMode: document.getElementById('settings-demo-mode'),
        auditTrailRetention: document.getElementById('settings-audit-retention'),
        dataExportFormat: document.getElementById('settings-export-format')
      };
    }

    function applySettingsToForm(settings) {
      const elements = getSettingsElements();
      elements.minBidderThreshold.value = String(settings.minBidderThreshold);
      elements.confidenceThreshold.value = String(settings.confidenceThreshold);
      elements.collusionAutoFlag.checked = Boolean(settings.collusionAutoFlag);
      elements.crossDocAutoFlag.checked = Boolean(settings.crossDocAutoFlag);
      elements.gfrRuleVersion.value = settings.gfrRuleVersion;
      elements.reportHeader.value = settings.reportHeader;
      elements.defaultIssuingAuthority.value = settings.defaultIssuingAuthority;
      elements.includeCagReference.checked = Boolean(settings.includeCagReference);
      elements.reportLanguage.value = settings.reportLanguage;
      elements.autoGenerateReport.checked = Boolean(settings.autoGenerateReport);
      elements.showUncertaintyAlerts.checked = Boolean(settings.showUncertaintyAlerts);
      elements.showCagWarnings.checked = Boolean(settings.showCagWarnings);
      elements.showCollusionAlerts.checked = Boolean(settings.showCollusionAlerts);
      elements.alertSound.checked = Boolean(settings.alertSound);
      elements.demoMode.checked = Boolean(settings.demoMode);
      elements.auditTrailRetention.value = settings.auditTrailRetention;
      elements.dataExportFormat.value = settings.dataExportFormat;
      updateSettingsConfidenceLabel(elements.confidenceThreshold, elements.confidenceValue);
    }

    function collectSettingsFromForm() {
      const elements = getSettingsElements();
      return {
        minBidderThreshold: Number(elements.minBidderThreshold.value) || defaultSettings.minBidderThreshold,
        confidenceThreshold: Number(elements.confidenceThreshold.value) || defaultSettings.confidenceThreshold,
        collusionAutoFlag: elements.collusionAutoFlag.checked,
        crossDocAutoFlag: elements.crossDocAutoFlag.checked,
        gfrRuleVersion: elements.gfrRuleVersion.value,
        reportHeader: elements.reportHeader.value.trim() || defaultSettings.reportHeader,
        defaultIssuingAuthority: elements.defaultIssuingAuthority.value.trim() || defaultSettings.defaultIssuingAuthority,
        includeCagReference: elements.includeCagReference.checked,
        reportLanguage: elements.reportLanguage.value,
        autoGenerateReport: elements.autoGenerateReport.checked,
        showUncertaintyAlerts: elements.showUncertaintyAlerts.checked,
        showCagWarnings: elements.showCagWarnings.checked,
        showCollusionAlerts: elements.showCollusionAlerts.checked,
        alertSound: elements.alertSound.checked,
        demoMode: elements.demoMode.checked,
        auditTrailRetention: elements.auditTrailRetention.value,
        dataExportFormat: elements.dataExportFormat.value
      };
    }

    function loadSettings() {
      const raw = localStorage.getItem(settingsStorageKey);
      if (!raw) return { ...defaultSettings };
      try {
        const parsed = JSON.parse(raw);
        return { ...defaultSettings, ...parsed };
      } catch (error) {
        console.warn('Failed to parse nyayabid_settings from localStorage. Using defaults.', error);
        return { ...defaultSettings };
      }
    }

    const settingsModal = document.getElementById('settings-modal');
    const settingsLink = document.getElementById('settings-link');
    const settingsCloseButton = document.getElementById('close-settings');
    const settingsFooterClose = document.getElementById('settings-close-footer');
    const settingsSave = document.getElementById('settings-save');
    const settingsReset = document.getElementById('settings-reset');
    const settingsClearData = document.getElementById('settings-clear-data');
    const settingsConfidenceThreshold = document.getElementById('settings-confidence-threshold');

    function openSettingsModal() {
      settingsModal.classList.add('show');
    }

    function closeSettingsModal() {
      settingsModal.classList.remove('show');
    }

    applySettingsToForm(loadSettings());

    if (settingsConfidenceThreshold) {
      settingsConfidenceThreshold.addEventListener('input', function () {
        const elements = getSettingsElements();
        updateSettingsConfidenceLabel(elements.confidenceThreshold, elements.confidenceValue);
      });
    }

    if (settingsLink && settingsModal) {
      settingsLink.addEventListener('click', function (event) {
        event.preventDefault();
        openSettingsModal();
      });
    }

    if (settingsCloseButton) {
      settingsCloseButton.addEventListener('click', closeSettingsModal);
    }

    if (settingsFooterClose) {
      settingsFooterClose.addEventListener('click', closeSettingsModal);
    }

    if (settingsModal) {
      settingsModal.addEventListener('click', function (event) {
        if (event.target === settingsModal) closeSettingsModal();
      });
    }

    if (settingsSave) {
      settingsSave.addEventListener('click', function () {
        const settings = collectSettingsFromForm();
        localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
        showToast('Settings saved successfully.', 'success');
      });
    }

    if (settingsReset) {
      settingsReset.addEventListener('click', function () {
        applySettingsToForm(defaultSettings);
        showToast('Settings reset to defaults.', 'success');
      });
    }

    if (settingsClearData) {
      settingsClearData.addEventListener('click', function () {
        const confirmed = root.confirm('This will clear all evaluation data. Are you sure?');
        if (!confirmed) return;
        localStorage.clear();
        applySettingsToForm(defaultSettings);
        showToast('Session data cleared.', 'success');
      });
    }

    root.NyayaBid.app = root.NyayaBid.app || {};
    root.NyayaBid.app.openSettingsModal = openSettingsModal;

    const data = root.NyayaBid.data;
    const rows = root.NyayaBid.evaluation.runBatchEvaluation(data.vendors);
    const tableBody = document.getElementById('recent-evals-body');
    tableBody.innerHTML = rows.map(function (entry) {
      const statusClass = entry.result.status === 'Eligible' ? 'ok' : 'reject';
      return `
        <tr>
          <td>${data.tender.id}</td>
          <td>${entry.vendor.name}</td>
          <td><span class="status-pill ${statusClass}">${entry.result.status}</span></td>
          <td>${entry.result.confidence}%</td>
          <td><a href="evaluate.html" class="btn btn-secondary tiny-btn">Open</a></td>
        </tr>
      `;
    }).join('');

    const statusDate = document.getElementById('system-sync-date');
    if (statusDate) statusDate.textContent = formatDateNow();

    const modal = document.getElementById('audit-trail-modal');
    const openBtn = document.getElementById('open-audit-trail');
    const closeBtn = document.getElementById('close-audit-trail');
    if (openBtn && closeBtn && modal) {
      openBtn.addEventListener('click', function () { modal.classList.add('show'); });
      closeBtn.addEventListener('click', function () { modal.classList.remove('show'); });
      modal.addEventListener('click', function (event) {
        if (event.target === modal) modal.classList.remove('show');
      });
    }
  }

  function renderVendorCards() {
    const holder = document.getElementById('vendor-cards');
    if (!holder) return;
    const data = root.NyayaBid.data;
    const utils = root.NyayaBid.utils;
    holder.innerHTML = data.vendors.map(function (vendor) {
      const docs = vendor.documents.map(function (doc) {
        return `<span class="doc-pill">✓ ${doc}</span>`;
      }).join(' ');
      return `
        <article class="vendor-card vendor-neutral" data-vendor-card="${vendor.id}">
          <div class="vendor-card-head">
            <div>
              <h4>Vendor: ${vendor.name}</h4>
              <p>CIN: ${vendor.cin}</p>
              <p>City: ${vendor.city}</p>
              <p>Annual Turnover: ₹${vendor.turnover} Crore (FY 2022-23)</p>
              <p>Experience: ${vendor.experience} Years</p>
              <p>GST No: ${vendor.gstNo}</p>
              <p>MSME: ${vendor.msme ? 'Yes' : 'No'}</p>
              <p>Bid Value: ${utils.formatINR(vendor.bidValue)}</p>
            </div>
            <span class="badge badge-pass">Loaded</span>
          </div>
          <div class="doc-row">Documents: ${docs}</div>
        </article>
      `;
    }).join('');
  }

  function confidenceClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'mid';
    return 'low';
  }

  function animateEvaluationRows(rows) {
    rows.forEach(function (row, index) {
      row.style.opacity = '0';
      row.style.transform = 'translateY(12px)';
      setTimeout(function () {
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      }, index * 80);
    });
  }

  function renderEvaluationRows(rows, overrides) {
    const body = document.getElementById('evaluation-results-body');
    if (!body) return;

    body.innerHTML = rows.map(function (entry) {
      const override = overrides.find(function (item) { return item.vendorId === entry.vendor.id; });
      const finalStatus = override ? override.newStatus : entry.result.status;
      let statusClass = 'badge-fail';
      if (override) statusClass = 'badge-override';
      else if (finalStatus === 'Eligible') statusClass = 'badge-pass';
      const barClass = confidenceClass(entry.result.confidence);
      const reasonHtml = entry.result.reasons.join('<br>');
      return `
        <tr data-vendor-row="${entry.vendor.id}">
          <td>${entry.vendor.name}</td>
          <td><span class="badge ${entry.result.turnoverPass ? 'badge-pass' : 'badge-fail'}">${entry.result.turnoverPass ? 'Pass' : 'Fail'}</span></td>
          <td><span class="badge ${entry.result.expPass ? 'badge-pass' : 'badge-fail'}">${entry.result.expPass ? 'Pass' : 'Fail'}</span></td>
          <td><span class="badge ${entry.result.gstPass ? 'badge-pass' : 'badge-fail'}">${entry.result.gstPass ? 'Pass' : 'Fail'}</span></td>
          <td><span class="badge ${entry.vendor.crossDocFlag ? 'badge-flag' : 'badge-pass'}">${entry.vendor.crossDocFlag ? 'Flag' : 'Pass'}</span></td>
          <td><span class="badge ${entry.vendor.collusionRisk ? 'badge-risk' : 'badge-safe'}">${entry.vendor.collusionRisk ? 'Risk' : 'Safe'}</span></td>
          <td>
            <div class="confidence-meter"><div class="confidence-fill ${barClass}" style="width:${entry.result.confidence}%;"></div></div>
            <div class="confidence-text">${entry.result.confidence}%</div>
          </td>
          <td>
            <span class="badge ${statusClass}">${override ? 'Overridden' : finalStatus}</span>
            <button type="button" class="read-aloud-btn" data-vendor="${entry.vendor.id}">Read Aloud</button>
          </td>
          <td class="reason-cell"><details><summary>View</summary><div>${reasonHtml}</div></details></td>
        </tr>
      `;
    }).join('');

    animateEvaluationRows(Array.from(body.querySelectorAll('tr')));

    body.querySelectorAll('.read-aloud-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        const id = button.dataset.vendor;
        const entry = findEvaluationEntry(rows, id);
        speakDecision(entry);
      });
    });
  }

  function renderFlags(overrides) {
    const holder = document.getElementById('flags-container');
    if (!holder) return;
    const flags = root.NyayaBid.collusion.getFlagCards(root.NyayaBid.data.vendors, overrides);

    holder.innerHTML = flags.map(function (flag, index) {
      const danger = flag.level === 'red' ? 'danger' : '';
      const levelBadge = flag.level === 'red' ? 'badge-risk' : 'badge-flag';
      return `
        <article class="flag-card ${danger}" style="animation-delay:${index * 150}ms;">
          <div class="flag-card-head">
            <h4>Vendor: ${flag.vendor}</h4>
            <span class="badge ${levelBadge}">${flag.type}</span>
          </div>
          <p>${flag.detail}</p>
          <p class="flag-reco">Recommended Action: ${flag.recommendedAction}</p>
          <div><button class="btn btn-secondary log-audit" data-flag="${flag.id}">Log to Audit</button></div>
        </article>
      `;
    }).join('');

    holder.querySelectorAll('.log-audit').forEach(function (button) {
      button.addEventListener('click', function () {
        showToast(`Flag ${button.dataset.flag} logged to audit trail.`, 'success');
      });
    });
  }

  function populateOverrideVendors(vendors) {
    const overrideVendor = document.getElementById('override-vendor');
    if (!overrideVendor) return;
    overrideVendor.innerHTML = '<option value="">-- Select Vendor --</option>' + vendors.map(function (v) {
      return `<option value="${v.id}">${v.name}</option>`;
    }).join('');
  }

  function updateOverrideButtonState() {
    const vendor = document.getElementById('override-vendor').value;
    const status = document.getElementById('override-status').value;
    const justification = document.getElementById('override-justification').value.trim();
    const consent = document.getElementById('override-consent').checked;
    const submit = document.getElementById('submit-override');
    submit.disabled = !(vendor && status && justification.length >= 50 && consent);
  }

  function runEvaluationTimer(onDone) {
    const wrapper = document.getElementById('evaluation-progress');
    const fill = document.getElementById('evaluation-progress-fill');
    const stage = document.getElementById('evaluation-progress-stage');
    const stages = [
      'Extracting documents...',
      'Applying GFR rules...',
      'Running cross-verification...',
      'Detecting patterns...',
      'Generating decisions...'
    ];
    wrapper.classList.remove('hidden');
    fill.style.width = '0%';
    let idx = 0;
    stage.textContent = stages[0];

    const interval = setInterval(function () {
      idx += 1;
      stage.textContent = stages[Math.min(idx, stages.length - 1)];
    }, 300);

    let start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / 1500, 1);
      fill.style.width = `${Math.round(progress * 100)}%`;
      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }
      clearInterval(interval);
      setTimeout(function () {
        wrapper.classList.add('hidden');
        onDone();
      }, 120);
    }
    requestAnimationFrame(frame);
  }

  function initEvaluatePage() {
    const page = document.querySelector('[data-page="evaluate"]');
    if (!page) return;

    const data = root.NyayaBid.data;
    const utils = root.NyayaBid.utils;
    const overrides = [];
    let rows = [];

    renderVendorCards();

    const choosePdf = document.getElementById('choose-pdf');
    const fileInput = document.getElementById('tender-file-input');
    const fileNameEl = document.getElementById('uploaded-file-name');
    const demoButton = document.getElementById('load-demo-tender');
    const tenderCard = document.getElementById('tender-info-card');
    const runButton = document.getElementById('run-evaluation');
    const resultBlock = document.getElementById('evaluation-results-block');

    choosePdf.addEventListener('click', function () {
      fileInput.click();
    });
    fileInput.addEventListener('change', function () {
      const file = fileInput.files?.[0];
      if (!file) return;
      fileNameEl.textContent = `Selected: ${file.name}`;
      showToast('Tender PDF selected.', 'success');
    });

    demoButton.addEventListener('click', function () {
      tenderCard.innerHTML = `
        <div class="gov-doc-card">
          <pre>
GOVERNMENT OF INDIA
Delhi Public Works Department

NOTICE INVITING TENDER
Tender ID: ${data.tender.id}
Title: ${data.tender.title}

Estimated Cost: ${utils.formatINR(data.tender.estimatedCost)}
EMD Required: ${utils.formatINR(data.tender.emdRequired)}
Bid Submission Deadline: ${utils.formatDate(data.tender.bidSubmissionDeadline)}
Opening Date: ${utils.formatDate(data.tender.openingDate)}

ELIGIBILITY CRITERIA (as per GFR Rule 160):
✓ Minimum Annual Turnover: ₹10 Crore (last 3 FYs)
✓ Minimum Experience: 7 Years in similar works
✓ GST Registration: Mandatory
✓ MSME: Relaxed criteria applicable (−25% turnover)

Reference: ${data.tender.reference}
Contact: ${data.tender.contact}
          </pre>
        </div>
      `;
      tenderCard.classList.remove('hidden');
      showToast('Demo tender loaded successfully.', 'success');
    });

    runButton.addEventListener('click', function () {
      runEvaluationTimer(function () {
        rows = root.NyayaBid.evaluation.runBatchEvaluation(data.vendors);
        renderEvaluationRows(rows, overrides);
        renderFlags(overrides);
        populateOverrideVendors(rows.map(function (entry) { return entry.vendor; }));
        resultBlock.classList.remove('hidden');
        document.getElementById('uncertainty-banner').classList.remove('hidden');
        document.getElementById('uncertainty-text').textContent = 'Vendor: Sunrise Tech Solutions — Confidence Score: 61% System is uncertain about this evaluation. Manual review by procurement officer recommended before finalizing decision.';
        document.getElementById('evaluation-time-banner').classList.remove('hidden');
        localStorage.setItem('nyayabid-evaluation-data', JSON.stringify({ rows, overrides }));
      });
    });

    const gfrToggle = document.getElementById('gfr-toggle');
    const gfrPanel = document.getElementById('gfr-reference-panel');
    gfrToggle.addEventListener('click', function () {
      gfrPanel.classList.toggle('hidden');
    });

    const overrideToggle = document.getElementById('override-toggle');
    const overrideContent = document.getElementById('override-content');
    overrideToggle.addEventListener('click', function () {
      const open = !overrideContent.classList.contains('hidden');
      overrideContent.classList.toggle('hidden', open);
      overrideToggle.querySelector('span').textContent = open ? '+' : '−';
    });

    populateOverrideVendors([]);

    ['override-vendor', 'override-status', 'override-justification', 'override-consent'].forEach(function (id) {
      const node = document.getElementById(id);
      node.addEventListener('input', updateOverrideButtonState);
      node.addEventListener('change', updateOverrideButtonState);
    });

    document.getElementById('submit-override').addEventListener('click', function () {
      const vendorId = document.getElementById('override-vendor').value;
      const newStatus = document.getElementById('override-status').value;
      const justification = document.getElementById('override-justification').value.trim();
      const consent = document.getElementById('override-consent').checked;
      if (!vendorId || !newStatus || justification.length < 50 || !consent) {
        showToast('Override form incomplete. Please satisfy all requirements.', 'warn');
        return;
      }

      const vendor = data.vendors.find(function (v) { return v.id === vendorId; });
      overrides.push({
        vendorId,
        vendorName: vendor.name,
        newStatus,
        justification,
        timestamp: new Date().toISOString()
      });

      renderEvaluationRows(rows, overrides);
      renderFlags(overrides);
      localStorage.setItem('nyayabid-evaluation-data', JSON.stringify({ rows, overrides }));
      document.getElementById('override-success').classList.remove('hidden');
      showToast('Override logged. Justification recorded in audit trail.', 'success');
    });
  }

  function initReportPage() {
    if (root.NyayaBid.report && document.body.dataset.page === 'report') {
      root.NyayaBid.report.renderReport();
    }
  }

  function initSimulationPage() {
    if (root.NyayaBid.simulation && document.body.dataset.page === 'simulation') {
      root.NyayaBid.simulation.initSimulationPage();
    }
  }

  function boot() {
    root.NyayaBid.app = { showToast };
    enablePageTransitions();
    bindKeyboardShortcuts();
    addGlobalFooterHint();
    addDemoModeBadge();
    addJudgeDemoHelper();
    injectSidebarIcons();
    setActiveNav();
    animateMetricCards();
    initLandingPage();
    initDashboardPage();
    initEvaluatePage();
    initSimulationPage();
    initReportPage();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
