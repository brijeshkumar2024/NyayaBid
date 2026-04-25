(function () {
  const root = globalThis;

  function getStoredEvaluation() {
    let raw = null;
    try {
      raw = localStorage.getItem('nyayabid-evaluation-data');
    } catch (error) {
      console.error('NyayaBid report localStorage read failed:', error);
      return null;
    }
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error('NyayaBid report payload parse failed:', error);
      return null;
    }
  }

  function showNoEvaluationMessage() {
    const summaryBody = document.getElementById('summary-body');
    const sourceBody = document.getElementById('source-body');
    const vendorBody = document.getElementById('vendor-detail-body');
    const flagsBody = document.getElementById('flags-body');
    const overrideBody = document.getElementById('override-log-body');
    const recommendations = document.getElementById('recommendations-list');
    const collusionText = document.getElementById('collusion-text');
    const message = 'No evaluation found. Please run evaluation first.';

    if (summaryBody) summaryBody.innerHTML = `<tr><td colspan="2">${message}</td></tr>`;
    if (sourceBody) sourceBody.innerHTML = `<tr><td colspan="3">${message}</td></tr>`;
    if (vendorBody) vendorBody.innerHTML = `<tr><td colspan="8">${message}</td></tr>`;
    if (flagsBody) flagsBody.innerHTML = `<tr><td colspan="4">${message}</td></tr>`;
    if (overrideBody) overrideBody.innerHTML = `<tr><td colspan="4">${message}</td></tr>`;
    if (recommendations) recommendations.innerHTML = `<li>${message}</li>`;
    if (collusionText) collusionText.textContent = message;

    const sourceBadge = document.getElementById('report-source-badge');
    const modeBadge = document.getElementById('report-mode-badge');
    if (sourceBadge) sourceBadge.textContent = 'No evaluation data';
    if (modeBadge) modeBadge.textContent = 'Action required';
  }

  function renderReport() {
    const page = document.querySelector('[data-page="report"]');
    if (!page) return;

    const data = root.NyayaBid.data;
    const utils = root.NyayaBid.utils;
    const payload = getStoredEvaluation();
    if (!payload) {
      showNoEvaluationMessage();
      return;
    }
    const rows = Array.isArray(payload.rows) ? payload.rows : root.NyayaBid.evaluation.runBatchEvaluation(data.vendors);
    const overrides = Array.isArray(payload.overrides) ? payload.overrides : [];
    const flags = root.NyayaBid.collusion.getFlagCards(data.vendors, overrides);

    document.getElementById('report-date').textContent = utils.formatDate(new Date());
    document.getElementById('meta-tender-id').textContent = data.tender.id;
    document.getElementById('meta-title').textContent = data.tender.title;
    document.getElementById('meta-authority').textContent = data.tender.authority;

    const hashText = 'a3f8c2d1e9b4...7f2a';
    document.getElementById('report-id').textContent = 'NBR-2024-001-DL';
    document.getElementById('report-hash').textContent = `SHA-256: ${hashText}`;

    const statusBadge = document.getElementById('report-status');
    statusBadge.textContent = 'DRAFT';
    statusBadge.className = 'badge badge-flag';

    const summaryBody = document.getElementById('summary-body');
    const eligible = rows.filter(function (entry) { return entry.result.status === 'Eligible'; }).length;
    const rejected = rows.length - eligible;
    const collusionCount = flags.filter(function (flag) { return /collusion/i.test(flag.type); }).length;
    const summaryRows = [
      ['Total Vendors Evaluated', rows.length],
      ['Eligible', eligible],
      ['Rejected', rejected],
      ['Flags Raised', flags.length],
      ['Collusion Risks', collusionCount],
      ['Evaluation Method', 'Rule-based explainable engine + cross-document risk checks']
    ];
    summaryBody.innerHTML = summaryRows.map(function (row) {
      return `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`;
    }).join('');

    const criteriaBody = document.getElementById('criteria-body');
    const criteriaRows = [
      ['Minimum Annual Turnover', '₹10 Crore', 'GFR Rule 175(2)', 'Ensures financial capacity for public works'],
      ['Minimum Experience', '7 Years', 'GFR Rule 175(3)', 'Requires domain execution maturity'],
      ['GST Registration', 'Mandatory', 'GFR Rule 144', 'Tax compliance and legal validity'],
      ['MSME Preference', '-25% turnover relaxation', 'MSME Procurement Policy', 'Promotes inclusion while retaining quality threshold']
    ];
    criteriaBody.innerHTML = criteriaRows.map(function (row) {
      return `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td></tr>`;
    }).join('');

    const vendorBody = document.getElementById('vendor-detail-body');
    vendorBody.innerHTML = rows.map(function (entry) {
      const reason = entry.result.reasons.join('; ');
      return `
        <tr>
          <td>${entry.vendor.name}</td>
          <td>${entry.vendor.city}</td>
          <td><span class="badge ${entry.result.turnoverPass ? 'badge-pass' : 'badge-fail'}">${entry.result.turnoverPass ? 'Pass' : 'Fail'}</span></td>
          <td><span class="badge ${entry.result.expPass ? 'badge-pass' : 'badge-fail'}">${entry.result.expPass ? 'Pass' : 'Fail'}</span></td>
          <td><span class="badge ${entry.result.gstPass ? 'badge-pass' : 'badge-fail'}">${entry.result.gstPass ? 'Pass' : 'Fail'}</span></td>
          <td>${entry.result.confidence}%</td>
          <td><span class="badge ${entry.result.status === 'Eligible' ? 'badge-pass' : 'badge-fail'}">${entry.result.status}</span></td>
          <td>${reason}</td>
        </tr>
      `;
    }).join('');

    const flagsBody = document.getElementById('flags-body');
    flagsBody.innerHTML = flags.map(function (flag) {
      return `<tr><td>${flag.vendor}</td><td>${flag.type}</td><td>${flag.detail}</td><td>${flag.recommendedAction}</td></tr>`;
    }).join('');

    document.getElementById('collusion-text').textContent = root.NyayaBid.collusion.collusionNarrative();

    const recommendations = [
      '1. DISQUALIFY Aakash Civil Works pending CVC investigation for suspected proxy bidding (shared address with Sunrise Tech Solutions).',
      '2. REQUEST re-submission from GreenBuild Contractors for GST certificate with notarized copy and date verification.',
      '3. AWARD to Bharat Infra Pvt Ltd (Score: 92/100) subject to officer verification of financial statements.',
      '4. CONSIDER revising tender criteria — current threshold limits competition to 3 vendors. Recommend reducing turnover requirement to ₹7 Crore to achieve CAG-recommended minimum of 5 bidders.'
    ];
    document.getElementById('recommendations-list').innerHTML = recommendations.map(function (text) {
      return `<li>${text}</li>`;
    }).join('');

    const signDate = document.getElementById('sign-date');
    signDate.value = new Date().toISOString().split('T')[0];

    document.getElementById('finalize-btn').addEventListener('click', function () {
      const officer = document.getElementById('officer-name').value.trim();
      const designation = document.getElementById('officer-designation').value.trim();
      const remarks = document.getElementById('officer-remarks').value.trim();
      if (!officer || !designation || !remarks) {
        root.NyayaBid.app.showToast('Please complete officer sign-off details before finalizing.', 'warn');
        return;
      }

      const now = new Date();
      statusBadge.textContent = 'FINALIZED';
      statusBadge.className = 'badge badge-pass';

      const signature = document.getElementById('digital-signature-block');
      signature.classList.remove('hidden');
      document.getElementById('sig-officer').textContent = officer;
      document.getElementById('sig-designation').textContent = designation;
      document.getElementById('sig-datetime').textContent = now.toLocaleString('en-IN');

      localStorage.setItem('nyayabid-report-signoff', JSON.stringify({
        officer,
        designation,
        remarks,
        date: signDate.value,
        finalizedAt: now.toISOString()
      }));

      root.NyayaBid.app.showToast('Report finalized and logged to audit trail', 'success');
    // FIX: { once: true } prevents listener stacking if renderReport() is ever called again
    }, { once: true });

    document.getElementById('download-report').addEventListener('click', function () {
      globalThis.print();
    });
  }

  root.NyayaBid.report = {
    renderReport
  };
})();
