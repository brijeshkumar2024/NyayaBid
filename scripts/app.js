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
      setTimeout(function () { toast.remove(); }, 240); // FIX: was root.setTimeout (inconsistent)
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

    const refs = {
      turnoverInput: document.getElementById('criteria-min-turnover'),
      experienceInput: document.getElementById('criteria-min-experience'),
      gstInput: document.getElementById('criteria-gst-mandatory'),
      msmeInput: document.getElementById('criteria-msme-applicable'),
      turnoverSource: document.getElementById('criteria-min-turnover-source'),
      experienceSource: document.getElementById('criteria-min-experience-source'),
      gstSource: document.getElementById('criteria-gst-mandatory-source'),
      msmeSource: document.getElementById('criteria-msme-applicable-source'),
      rawTextOutput: document.getElementById('raw-text-output')
    };

    function persistEvaluation(criteriaOverride) {
      localStorage.setItem('nyayabid-evaluation-data', JSON.stringify({
        rows,
        overrides,
        criteria: criteriaOverride,
        document: extractedDocument
      }));
    }

    function buildCriteriaOverrideFromFields() {
      const missing = [];
      const turnoverValue = refs.turnoverInput ? Number(refs.turnoverInput.value) : Number.NaN;
      const experienceValue = refs.experienceInput ? Number(refs.experienceInput.value) : Number.NaN;
      const gstValue = refs.gstInput ? refs.gstInput.value : '';
      const msmeValue = refs.msmeInput ? refs.msmeInput.value : '';

      if (!Number.isFinite(turnoverValue)) missing.push('Minimum annual turnover');
      if (!Number.isFinite(experienceValue)) missing.push('Minimum experience');
      if (!gstValue) missing.push('GST requirement');
      if (!msmeValue) missing.push('MSME applicability');

      if (missing.length) {
        return { ok: false, missing: missing.join(', ') };
      }

      return {
        ok: true,
        criteriaOverride: {
          minTurnover: turnoverValue,
          minExperience: experienceValue,
          gstMandatory: gstValue === 'yes',
          msmeRelaxation: msmeValue === 'yes' ? 0.75 : 1
        }
      };
    }
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

    // FIX: augment the existing app object — do NOT replace it (showToast lives there)
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

  function normalizeWhitespace(text) {
    return String(text || '').replaceAll(/\s+/g, ' ').trim();
  }

  function compareTextItems(a, b) {
    if (Math.abs(b.y - a.y) > 2) return b.y - a.y;
    return a.x - b.x;
  }

  function compareLineItems(a, b) {
    return a.x - b.x;
  }

  function formatSourceLabel(source) {
    if (!source) return 'Not found — please enter manually';
    return `Source: Page ${source.page}, Line ${source.line}`;
  }

  function formatCroreValue(amount) {
    if (!Number.isFinite(amount)) return '';
    const rounded = Math.abs(amount - Math.round(amount)) < 0.01 ? String(Math.round(amount)) : amount.toFixed(2).replaceAll('.00', '');
    return `₹${rounded} Crore`;
  }

  function convertTurnoverToCrore(amount, unit) {
    if (!Number.isFinite(amount)) return null;
    const normalizedUnit = String(unit || 'crore').toLowerCase();
    if (normalizedUnit.startsWith('lakh') || normalizedUnit.startsWith('lac')) return amount / 100;
    if (normalizedUnit === 'cr') return amount;
    return amount;
  }

  function setSourceElement(element, source) {
    if (!element) return;
    element.textContent = formatSourceLabel(source);
    element.classList.toggle('missing', !source);
  }

  function buildRawTextOutput(pages) {
    const output = [];
    for (const page of pages) {
      output.push(`Page ${page.pageNumber}`);
      for (const line of page.lines) {
        output.push(`Line ${line.lineNumber}: ${line.text}`);
      }
      output.push('');
    }
    return output.join('\n').trim();
  }

  function groupItemsIntoLines(items) {
    const pageItems = [];
    for (const item of items) {
      const text = item.str || '';
      if (!normalizeWhitespace(text).length) continue;
      pageItems.push({
        text,
        x: item.transform && Number.isFinite(item.transform[4]) ? item.transform[4] : 0,
        y: item.transform && Number.isFinite(item.transform[5]) ? item.transform[5] : 0
      });
    }

    pageItems.sort(compareTextItems);

    const lines = [];
    const yTolerance = 2.5;
    for (const item of pageItems) {
      const current = lines.at(-1);
      if (!current || Math.abs(current.y - item.y) > yTolerance) {
        lines.push({ y: item.y, items: [item] });
        continue;
      }
      current.items.push(item);
    }

    return lines.map(function (line, index) {
      line.items.sort(compareLineItems);
      const text = line.items.map(function (item) { return item.text; }).join(' ').replaceAll(/\s+/g, ' ').trim();
      return {
        lineNumber: index + 1,
        text
      };
    });
  }

  function extractTurnoverCriteria(pages) {
    const keywordRegex = /turnover|annual|financial|minimum/i;
    const numberRegex = /(\d+(?:\.\d+)?)(?:\s*(crore|cr|lakhs?|lakh|lacs?|lac))?/i;

    for (const page of pages) {
      for (let index = 0; index < page.lines.length; index += 1) {
        const current = page.lines[index];
        const next = page.lines[index + 1];
        const windowText = normalizeWhitespace([current.text, next ? next.text : ''].join(' '));
        if (!keywordRegex.test(windowText)) continue;

        const keywordIndex = windowText.toLowerCase().indexOf('turnover');
        const tail = keywordIndex >= 0 ? windowText.slice(keywordIndex) : windowText;
        const match = numberRegex.exec(tail);
        if (!match) continue;

        const amount = Number.parseFloat(match[1].replaceAll(',', ''));
        const croreValue = convertTurnoverToCrore(amount, match[2] || 'crore');
        if (!Number.isFinite(croreValue)) continue;

        return {
          minTurnover: Math.round(croreValue * 100) / 100,
          turnoverSource: { page: page.pageNumber, line: current.lineNumber }
        };
      }
    }

    return { minTurnover: null, turnoverSource: null };
  }

  function extractExperienceCriteria(pages) {
    const keywordRegex = /experience|prior work|completed projects|similar works/i;
    const numberRegex = /(\d+(?:\.\d+)?)(?:\s*(years?|yrs?))/i;

    for (const page of pages) {
      for (let index = 0; index < page.lines.length; index += 1) {
        const current = page.lines[index];
        const next = page.lines[index + 1];
        const windowText = normalizeWhitespace([current.text, next ? next.text : ''].join(' '));
        if (!keywordRegex.test(windowText)) continue;

        const keywordIndex = windowText.toLowerCase().search(/experience|prior work|completed projects|similar works/);
        const tail = keywordIndex >= 0 ? windowText.slice(keywordIndex) : windowText;
        const match = numberRegex.exec(tail);
        if (!match) continue;

        const years = Number.parseFloat(match[1].replaceAll(',', ''));
        if (!Number.isFinite(years)) continue;

        return {
          minExperience: Math.round(years * 100) / 100,
          experienceSource: { page: page.pageNumber, line: current.lineNumber }
        };
      }
    }

    return { minExperience: null, experienceSource: null };
  }

  function extractGstCriteria(pages) {
    const keywordRegex = /gst|gstin|gst registration|registered under gst/i;
    const negativeRegex = /not\s+required|not\s+mandatory|no\s+gst|without\s+gst/i;

    for (const page of pages) {
      for (let index = 0; index < page.lines.length; index += 1) {
        const current = page.lines[index];
        const next = page.lines[index + 1];
        const windowText = normalizeWhitespace([current.text, next ? next.text : ''].join(' '));
        if (!keywordRegex.test(windowText)) continue;

        return {
          gstMandatory: !negativeRegex.test(windowText),
          gstSource: { page: page.pageNumber, line: current.lineNumber }
        };
      }
    }

    return { gstMandatory: null, gstSource: null };
  }

  function extractMsmeCriteria(pages) {
    const keywordRegex = /msme|udyam|micro|small enterprise/i;
    const negativeRegex = /not\s+applicable|does\s+not\s+apply|no\s+msme/i;

    for (const page of pages) {
      for (let index = 0; index < page.lines.length; index += 1) {
        const current = page.lines[index];
        const next = page.lines[index + 1];
        const windowText = normalizeWhitespace([current.text, next ? next.text : ''].join(' '));
        if (!keywordRegex.test(windowText)) continue;

        return {
          msmeApplicable: !negativeRegex.test(windowText),
          msmeSource: { page: page.pageNumber, line: current.lineNumber }
        };
      }
    }

    return { msmeApplicable: null, msmeSource: null };
  }

  function parseTenderCriteriaFromPages(pages) {
    return {
      ...extractTurnoverCriteria(pages),
      ...extractExperienceCriteria(pages),
      ...extractGstCriteria(pages),
      ...extractMsmeCriteria(pages)
    };
  }

  function applyCriteriaToInputs(criteria, refs, rawText) {
    if (refs.turnoverInput) {
      refs.turnoverInput.value = Number.isFinite(criteria.minTurnover) ? String(criteria.minTurnover) : '';
      refs.turnoverInput.placeholder = Number.isFinite(criteria.minTurnover) ? formatCroreValue(criteria.minTurnover) : 'Not found — please enter manually';
    }

    if (refs.experienceInput) {
      refs.experienceInput.value = Number.isFinite(criteria.minExperience) ? String(criteria.minExperience) : '';
      refs.experienceInput.placeholder = Number.isFinite(criteria.minExperience) ? `${criteria.minExperience} Years` : 'Not found — please enter manually';
    }

    if (refs.gstInput) {
      if (criteria.gstMandatory === true) refs.gstInput.value = 'yes';
      else if (criteria.gstMandatory === false) refs.gstInput.value = 'no';
      else refs.gstInput.value = '';
    }

    if (refs.msmeInput) {
      if (criteria.msmeApplicable === true) refs.msmeInput.value = 'yes';
      else if (criteria.msmeApplicable === false) refs.msmeInput.value = 'no';
      else refs.msmeInput.value = '';
    }

    setSourceElement(refs.turnoverSource, criteria.turnoverSource);
    setSourceElement(refs.experienceSource, criteria.experienceSource);
    setSourceElement(refs.gstSource, criteria.gstSource);
    setSourceElement(refs.msmeSource, criteria.msmeSource);

    if (refs.rawTextOutput) {
      refs.rawTextOutput.textContent = rawText || 'Upload a tender PDF to see extracted text here.';
    }
  }

  async function extractTextFromPdfFile(file) {
    if (typeof pdfjsLib === 'undefined') {
      throw new TypeError('PDF library not loaded. Check the CDN connection and reload the page.');
    }

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push({
        pageNumber,
        lines: groupItemsIntoLines(content.items)
      });
    }

    return {
      pages,
      rawText: buildRawTextOutput(pages)
    };
  }
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

  /* eslint-disable no-inner-declarations, complexity, max-depth, max-nested-callbacks, no-var, prefer-const, no-nested-ternary, unicorn/prefer-string-replace-all, sonarjs/cognitive-complexity, unicorn/prefer-optional-chain */
  function initEvaluatePage() {
    const page = document.querySelector('[data-page="evaluate"]');
    if (!page) return;

    const data = root.NyayaBid.data;
    const utils = root.NyayaBid.utils;
    const overrides = [];
    let rows = [];
    let extractedDocument = {
      fileName: '',
      rawText: '',
      pages: []
    };

    renderVendorCards();

    const choosePdf   = document.getElementById('choose-pdf');
    const fileInput   = document.getElementById('tender-file-input');
    const fileNameEl  = document.getElementById('uploaded-file-name');
    const demoButton  = document.getElementById('load-demo-tender');
    const tenderCard  = document.getElementById('tender-info-card');
    const runButton   = document.getElementById('run-evaluation');
    const resultBlock = document.getElementById('evaluation-results-block');
    const turnoverInput = document.getElementById('criteria-min-turnover');
    const experienceInput = document.getElementById('criteria-min-experience');
    const gstInput = document.getElementById('criteria-gst-mandatory');
    const msmeInput = document.getElementById('criteria-msme-applicable');
    const turnoverSource = document.getElementById('criteria-min-turnover-source');
    const experienceSource = document.getElementById('criteria-min-experience-source');
    const gstSource = document.getElementById('criteria-gst-mandatory-source');
    const msmeSource = document.getElementById('criteria-msme-applicable-source');
    const rawTextOutput = document.getElementById('raw-text-output');

    function normalizeWhitespace(text) {
      return String(text || '').replace(/\s+/g, ' ').trim();
    }

    function formatSource(source) {
      if (!source) return 'Not found — please enter manually';
      return `Source: Page ${source.page}, Line ${source.line}`;
    }

    function formatCroreValue(amount) {
      if (!Number.isFinite(amount)) return '';
      const rounded = Math.abs(amount - Math.round(amount)) < 0.01 ? String(Math.round(amount)) : amount.toFixed(2).replace(/\.00$/, '');
      return `₹${rounded} Crore`;
    }

    function convertTurnoverToCrore(amount, unit) {
      if (!Number.isFinite(amount)) return null;
      const normalizedUnit = String(unit || 'crore').toLowerCase();
      if (normalizedUnit.startsWith('lakh') || normalizedUnit.startsWith('lac')) return amount / 100;
      if (normalizedUnit === 'cr') return amount;
      return amount;
    }

    function setSourceElement(element, source) {
      if (!element) return;
      element.textContent = formatSource(source);
      element.classList.toggle('missing', !source);
    }

    function buildRawTextOutput(pages) {
      return pages.map(function (page) {
        const header = `Page ${page.pageNumber}`;
        const lines = page.lines.map(function (line) {
          return `Line ${line.lineNumber}: ${line.text}`;
        });
        return [header].concat(lines).join('\n');
      }).join('\n\n');
    }

    function groupItemsIntoLines(items) {
      const pageItems = items
        .map(function (item) {
          return {
            text: item.str || '',
            x: item.transform && Number.isFinite(item.transform[4]) ? item.transform[4] : 0,
            y: item.transform && Number.isFinite(item.transform[5]) ? item.transform[5] : 0
          };
        })
        .filter(function (item) {
          return normalizeWhitespace(item.text).length > 0;
        })
        .sort(function (a, b) {
          if (Math.abs(b.y - a.y) > 2) return b.y - a.y;
          return a.x - b.x;
        });

      const lines = [];
      const yTolerance = 2.5;

      pageItems.forEach(function (item) {
        const current = lines[lines.length - 1];
        if (!current || Math.abs(current.y - item.y) > yTolerance) {
          lines.push({ y: item.y, items: [item] });
          return;
        }
        current.items.push(item);
      });

      return lines.map(function (line, index) {
        return {
          lineNumber: index + 1,
          text: line.items
            .sort(function (a, b) { return a.x - b.x; })
            .map(function (item) { return item.text; })
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim()
        };
      });
    }

    function findFirstWindow(pages, matcher) {
      for (const page of pages) {
        for (let index = 0; index < page.lines.length; index += 1) {
          const current = page.lines[index];
          const next = page.lines[index + 1];
          const windowText = normalizeWhitespace([current.text, next ? next.text : ''].join(' '));
          if (matcher(windowText)) {
            return {
              page: page.pageNumber,
              line: current.lineNumber,
              text: windowText
            };
          }
        }
      }
      return null;
    }

    function parseTurnover(pages) {
      const patterns = [
        /(?:minimum|min(?:imum)?|annual|financial)?[^\n]{0,60}?turnover[^\d]{0,40}?(?:₹|rs\.?|inr)?\s*([\d,.]+)\s*(crore|cr|lakhs?|lakh|lacs?|lac)?/i,
        /(?:₹|rs\.?|inr)\s*([\d,.]+)\s*(crore|cr|lakhs?|lakh|lacs?|lac)?[^\n]{0,50}?turnover/i,
        /turnover[^\n]{0,60}?([\d,.]+)\s*(crore|cr|lakhs?|lakh|lacs?|lac)?/i
      ];

      const match = findFirstWindow(pages, function (text) {
        return /turnover|annual|financial|minimum/i.test(text) && patterns.some(function (pattern) {
          pattern.lastIndex = 0;
          return pattern.test(text);
        });
      });

      if (!match) return { minTurnover: null, turnoverSource: null };

      let amount = null;
      let unit = 'crore';
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        const found = pattern.exec(match.text);
        if (found) {
          amount = parseFloat(found[1].replace(/,/g, ''));
          unit = found[2] || 'crore';
          break;
        }
      }

      const croreValue = convertTurnoverToCrore(amount, unit);
      if (!Number.isFinite(croreValue)) return { minTurnover: null, turnoverSource: null };

      return {
        minTurnover: Math.round(croreValue * 100) / 100,
        turnoverSource: { page: match.page, line: match.line }
      };
    }

    function parseExperience(pages) {
      const patterns = [
        /(?:minimum|min(?:imum)?)?[^\n]{0,60}?(?:experience|prior work|completed projects|similar works)[^\d]{0,40}?([\d,.]+)\s*(years?|yrs?)/i,
        /([\d,.]+)\s*(years?|yrs?)[^\n]{0,50}?(?:experience|prior work|completed projects|similar works)/i,
        /(?:experience|prior work|completed projects|similar works)[^\d]{0,40}?([\d,.]+)\s*(years?|yrs?)/i
      ];

      const match = findFirstWindow(pages, function (text) {
        return /experience|prior work|completed projects|similar works/i.test(text) && patterns.some(function (pattern) {
          pattern.lastIndex = 0;
          return pattern.test(text);
        });
      });

      if (!match) return { minExperience: null, experienceSource: null };

      let years = null;
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        const found = pattern.exec(match.text);
        if (found) {
          years = parseFloat(found[1].replace(/,/g, ''));
          break;
        }
      }

      if (!Number.isFinite(years)) return { minExperience: null, experienceSource: null };

      return {
        minExperience: Math.round(years * 100) / 100,
        experienceSource: { page: match.page, line: match.line }
      };
    }

    function parseGstRequirement(pages) {
      const match = findFirstWindow(pages, function (text) {
        return /gst|gstin|gst registration|registered under gst/i.test(text);
      });

      if (!match) return { gstMandatory: null, gstSource: null };

      const isNegative = /not\s+required|not\s+mandatory|no\s+gst|without\s+gst/i.test(match.text);
      return {
        gstMandatory: !isNegative,
        gstSource: { page: match.page, line: match.line }
      };
    }

    function parseMsmeApplicability(pages) {
      const match = findFirstWindow(pages, function (text) {
        return /msme|udyam|micro|small enterprise/i.test(text);
      });

      if (!match) return { msmeApplicable: null, msmeSource: null };

      const isNegative = /not\s+applicable|does\s+not\s+apply|no\s+msme/i.test(match.text);
      return {
        msmeApplicable: !isNegative,
        msmeSource: { page: match.page, line: match.line }
      };
    }

    function parseTenderCriteria(pages) {
      return {
        ...parseTurnover(pages),
        ...parseExperience(pages),
        ...parseGstRequirement(pages),
        ...parseMsmeApplicability(pages)
      };
    }

    function buildCriteriaOverrideFromFields() {
      const missing = [];

      const turnoverValue = turnoverInput ? Number(turnoverInput.value) : Number.NaN;
      const experienceValue = experienceInput ? Number(experienceInput.value) : Number.NaN;
      const gstValue = gstInput ? gstInput.value : '';
      const msmeValue = msmeInput ? msmeInput.value : '';

      if (!Number.isFinite(turnoverValue)) missing.push('Minimum annual turnover');
      if (!Number.isFinite(experienceValue)) missing.push('Minimum experience');
      if (!gstValue) missing.push('GST requirement');
      if (!msmeValue) missing.push('MSME applicability');

      if (missing.length) {
        return { ok: false, missing: missing.join(', ') };
      }

      return {
        ok: true,
        criteriaOverride: {
          minTurnover: turnoverValue,
          minExperience: experienceValue,
          gstMandatory: gstValue === 'yes',
          msmeRelaxation: msmeValue === 'yes' ? 0.75 : 1
        }
      };
    }

    function setCriteriaState(parsedCriteria, rawText) {
      if (!parsedCriteria) return;

      if (refs.turnoverInput) {
        refs.turnoverInput.value = Number.isFinite(parsedCriteria.minTurnover) ? String(parsedCriteria.minTurnover) : '';
        refs.turnoverInput.placeholder = Number.isFinite(parsedCriteria.minTurnover) ? `₹${parsedCriteria.minTurnover} Crore` : 'Not found — please enter manually';
      }

      if (refs.experienceInput) {
        refs.experienceInput.value = Number.isFinite(parsedCriteria.minExperience) ? String(parsedCriteria.minExperience) : '';
        refs.experienceInput.placeholder = Number.isFinite(parsedCriteria.minExperience) ? `${parsedCriteria.minExperience} Years` : 'Not found — please enter manually';
      }

      if (refs.gstInput) {
        if (parsedCriteria.gstMandatory === true) refs.gstInput.value = 'yes';
        else if (parsedCriteria.gstMandatory === false) refs.gstInput.value = 'no';
        else refs.gstInput.value = '';
      }

      if (refs.msmeInput) {
        if (parsedCriteria.msmeApplicable === true) refs.msmeInput.value = 'yes';
        else if (parsedCriteria.msmeApplicable === false) refs.msmeInput.value = 'no';
        else refs.msmeInput.value = '';
      }

      if (refs.turnoverSource) {
        refs.turnoverSource.textContent = parsedCriteria.turnoverSource ? `Source: Page ${parsedCriteria.turnoverSource.page}, Line ${parsedCriteria.turnoverSource.line}` : 'Not found — please enter manually';
        refs.turnoverSource.classList.toggle('missing', !parsedCriteria.turnoverSource);
      }

      if (refs.experienceSource) {
        refs.experienceSource.textContent = parsedCriteria.experienceSource ? `Source: Page ${parsedCriteria.experienceSource.page}, Line ${parsedCriteria.experienceSource.line}` : 'Not found — please enter manually';
        refs.experienceSource.classList.toggle('missing', !parsedCriteria.experienceSource);
      }

      if (refs.gstSource) {
        refs.gstSource.textContent = parsedCriteria.gstSource ? `Source: Page ${parsedCriteria.gstSource.page}, Line ${parsedCriteria.gstSource.line}` : 'Not found — please enter manually';
        refs.gstSource.classList.toggle('missing', !parsedCriteria.gstSource);
      }

      if (refs.msmeSource) {
        refs.msmeSource.textContent = parsedCriteria.msmeSource ? `Source: Page ${parsedCriteria.msmeSource.page}, Line ${parsedCriteria.msmeSource.line}` : 'Not found — please enter manually';
        refs.msmeSource.classList.toggle('missing', !parsedCriteria.msmeSource);
      }

      if (refs.rawTextOutput) {
        refs.rawTextOutput.textContent = rawText || 'Upload a tender PDF to see extracted text here.';
      }
    }

    async function extractTextFromPdfFile(file) {
      if (typeof pdfjsLib === 'undefined') {
        throw new TypeError('PDF library not loaded. Check the CDN connection and reload the page.');
      }

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const pages = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push({
          pageNumber,
          lines: groupItemsIntoLines(content.items)
        });
      }

      return {
        pages,
        rawText: buildRawTextOutput(pages)
      };
    }

    function persistEvaluation(criteriaOverride) {
      localStorage.setItem('nyayabid-evaluation-data', JSON.stringify({
        rows,
        overrides,
        criteria: criteriaOverride,
        document: extractedDocument
      }));
    }

    // ── File input wiring ──────────────────────────────────────────────────
    choosePdf.addEventListener('click', function () { fileInput.click(); });

    fileInput.addEventListener('change', async function () {
      const file = fileInput.files?.[0];
      if (!file) return;

      fileNameEl.textContent = 'Reading… ' + file.name;
      document.getElementById('tender-criteria-card').classList.add('hidden');
      tenderCard.classList.add('hidden');
      extractedDocument = {
        fileName: file.name,
        rawText: '',
        pages: []
      };

      if (refs.rawTextOutput) {
        refs.rawTextOutput.textContent = 'Reading PDF pages...';
      }

      try {
        const extracted = await extractTextFromPdfFile(file);
        extractedDocument.rawText = extracted.rawText;
        extractedDocument.pages = extracted.pages;

        const criteria = parseTenderCriteria(extracted.pages);
        fileNameEl.textContent = 'Loaded: ' + file.name;
        setCriteriaState(criteria, extracted.rawText);
        persistEvaluation(buildCriteriaOverrideFromFields().criteriaOverride || null);
        showToast('Criteria extracted from document.', 'success');
      } catch (err) {
        fileNameEl.textContent = '';
        showToast('Could not read PDF: ' + err.message, 'warn');
        if (refs.rawTextOutput) {
          refs.rawTextOutput.textContent = 'PDF extraction failed.';
        }
      }
    });

    // ── Demo tender (unchanged behaviour) ─────────────────────────────────
    demoButton.addEventListener('click', function () {
      // Hide extracted criteria card if visible
      document.getElementById('tender-criteria-card').classList.add('hidden');
      extractedDocument = {
        fileName: 'Demo Tender',
        rawText: data.tender.criteriaText.join('\n'),
        pages: []
      };

      if (refs.turnoverInput) refs.turnoverInput.value = '10';
      if (refs.experienceInput) refs.experienceInput.value = '7';
      if (refs.gstInput) refs.gstInput.value = 'yes';
      if (refs.msmeInput) refs.msmeInput.value = 'yes';
      if (refs.turnoverSource) refs.turnoverSource.textContent = 'Source: Demo tender';
      if (refs.experienceSource) refs.experienceSource.textContent = 'Source: Demo tender';
      if (refs.gstSource) refs.gstSource.textContent = 'Source: Demo tender';
      if (refs.msmeSource) refs.msmeSource.textContent = 'Source: Demo tender';
      if (refs.rawTextOutput) refs.rawTextOutput.textContent = data.tender.criteriaText.join('\n');

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

    // ── Run Evaluation ─────────────────────────────────────────────────────
    // If the user uploaded a real PDF and criteria were extracted, pass them
    // to runBatchEvaluation so the engine uses the document's own thresholds.
    runButton.addEventListener('click', function () {
      const builtCriteria = buildCriteriaOverrideFromFields();
      if (!builtCriteria.ok) {
        showToast(`Please enter missing criteria manually before running evaluation: ${builtCriteria.missing}.`, 'warn');
        return;
      }

      runEvaluationTimer(function () {
        rows = root.NyayaBid.evaluation.runBatchEvaluation(data.vendors, builtCriteria.criteriaOverride);
        renderEvaluationRows(rows, overrides);
        renderFlags(overrides);
        populateOverrideVendors(rows.map(function (entry) { return entry.vendor; }));
        resultBlock.classList.remove('hidden');

        var uncertainVendor = rows.find(function (entry) {
          return entry.result.confidence < 70;
        });
        var uncertaintyBanner = document.getElementById('uncertainty-banner');
        var uncertaintyText   = document.getElementById('uncertainty-text');
        if (uncertainVendor) {
          uncertaintyText.textContent = 'Vendor: ' + uncertainVendor.vendor.name +
            ' — Confidence Score: ' + uncertainVendor.result.confidence +
            '% — System is uncertain about this evaluation. Manual review by procurement officer recommended before finalizing decision.';
          uncertaintyBanner.classList.remove('hidden');
        } else {
          uncertaintyBanner.classList.add('hidden');
        }

        document.getElementById('evaluation-time-banner').classList.remove('hidden');
        persistEvaluation(builtCriteria.criteriaOverride);
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
      persistEvaluation(buildCriteriaOverrideFromFields().criteriaOverride || null);
      document.getElementById('override-success').classList.remove('hidden');
      showToast('Override logged. Justification recorded in audit trail.', 'success');
    });
  }
  /* eslint-enable no-inner-declarations, complexity, max-depth, max-nested-callbacks, no-var, prefer-const, no-nested-ternary, unicorn/prefer-string-replace-all, sonarjs/cognitive-complexity, unicorn/prefer-optional-chain */

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
    // FIX: assign app object once here and never overwrite it.
    // initDashboardPage previously did `root.NyayaBid.app = root.NyayaBid.app || {}`
    // then assigned openSettingsModal — that pattern was safe but fragile.
    // Now we set the full object here and only augment it below.
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
    // Document Intelligence — initialised last so app.showToast is guaranteed available
    if (root.NyayaBid.docIntelligence) root.NyayaBid.docIntelligence.init();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
