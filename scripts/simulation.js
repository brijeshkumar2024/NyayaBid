(function () {
  const root = globalThis;

  function countEligibleVendors(vendors, evaluator, state) {
    let count = 0;
    for (const vendor of vendors) {
      if (evaluator(vendor, state).eligible) count += 1;
    }
    return count;
  }

  function getMsmeRelaxation(mode) {
    if (mode === 'none') return 1;
    if (mode === '-25') return 0.75;
    return 0.75;
  }

  function competitionLabel(ratio) {
    if (ratio >= 0.7) return 'High';
    if (ratio >= 0.5) return 'Moderate';
    if (ratio >= 0.3) return 'Low';
    return 'Critical';
  }

  function riskLabel(eligible) {
    if (eligible < 3) return { text: 'High', badge: 'badge-risk' };
    if (eligible < 6) return { text: 'Medium', badge: 'badge-flag' };
    return { text: 'Low', badge: 'badge-pass' };
  }

  function colorForRatio(ratio) {
    if (ratio < 0.3) return 'var(--red)';
    if (ratio < 0.5) return 'var(--amber)';
    return 'var(--green)';
  }

  function initSimulationPage() {
    const rootEl = document.querySelector('[data-page="simulation"]');
    if (!rootEl) return;

    const data = root.NyayaBid.data;
    const utils = root.NyayaBid.utils;
    const evaluateVendor = root.NyayaBid.evaluation.evaluateVendor;

    const controls = {
      turnover: document.getElementById('sim-turnover'),
      experience: document.getElementById('sim-experience'),
      gst: document.getElementById('sim-gst'),
      msme: document.getElementById('sim-msme'),
      cap: document.getElementById('sim-cap')
    };

    const values = {
      turnover: document.getElementById('sim-turnover-value'),
      experience: document.getElementById('sim-experience-value'),
      cap: document.getElementById('sim-cap-value')
    };

    const metricEls = {
      eligible: document.getElementById('metric-eligible'),
      ineligible: document.getElementById('metric-ineligible'),
      msmeEligible: document.getElementById('metric-msme-eligible'),
      competition: document.getElementById('metric-competition')
    };

    const policyEls = {
      change: document.getElementById('policy-change'),
      gain: document.getElementById('policy-gain'),
      competition: document.getElementById('policy-competition'),
      risk: document.getElementById('policy-risk')
    };

    const competitionFill = document.getElementById('competition-fill');
    const tableBody = document.getElementById('simulation-table-body');
    const insightWrap = document.getElementById('simulation-insight');
    const historyBody = document.getElementById('simulation-history-body');
    const exportBtn = document.getElementById('export-simulation');
    const chartSvg = document.getElementById('competition-chart-svg');

    const defaults = {
      turnover: 10,
      experience: 7,
      gst: true,
      msme: 'none',
      cap: 100
    };

    let simulationHistory = [];
    let lastInsight = '';
    let lastCompetition = 'Moderate';
    let lastRisk = 'Medium';

    function setRangeLabels(state) {
      values.turnover.textContent = `₹${state.turnover} Crore`;
      values.experience.textContent = `${state.experience} years`;
      values.cap.textContent = `₹${state.cap} Crore`;
    }

    function evaluate(vendor, state) {
      const normalized = {
        turnover: vendor.turnover,
        experience: vendor.exp,
        gst: vendor.gst,
        msme: vendor.msme,
        crossDocFlag: false
      };

      const base = evaluateVendor(normalized, {
        minTurnover: state.turnover,
        minExperience: state.experience,
        gstMandatory: state.gst,
        msmeRelaxation: getMsmeRelaxation(state.msme)
      });

      let eligible = base.eligible;
      if (state.msme === 'priority' && vendor.msme && base.gstPass) {
        eligible = true;
      }

      const underCap = vendor.turnover <= state.cap;
      eligible = eligible && underCap;

      return {
        eligible,
        base,
        underCap
      };
    }

    function renderChart(evaluated) {
      const width = chartSvg.clientWidth || 780;
      const height = 180;
      const maxTurnover = Math.max.apply(null, evaluated.map(function (row) { return row.vendor.turnover; }));
      const barWidth = Math.floor(width / evaluated.length) - 6;
      const bars = evaluated.map(function (row, index) {
        const x = index * (barWidth + 6) + 6;
        const barHeight = Math.round((row.vendor.turnover / maxTurnover) * 130);
        const y = height - barHeight - 24;
        const fill = row.result.eligible ? '#16A34A' : '#DC2626';
        const shortName = row.vendor.name.split(' ')[0].slice(0, 4);
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" fill="${fill}"></rect>
          <text x="${x + Math.floor(barWidth / 2)}" y="${height - 10}" text-anchor="middle" fill="#475569" font-size="10">${shortName}</text>
        `;
      }).join('');
      chartSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      chartSvg.innerHTML = bars;
    }

    function updateHistory(state, eligibleCount, presetName) {
      const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
      const base = presetName
        ? `[${time}] ${presetName} preset → ${eligibleCount} eligible`
        : `[${time}] Turnover: ₹${state.turnover}Cr, Exp: ${state.experience}yr → ${eligibleCount} eligible`;
      const delta = simulationHistory.length > 0
        ? eligibleCount - simulationHistory[0].eligible
        : 0;
      const suffix = delta > 0 ? `  ← +${delta} vendors` : '';
      simulationHistory.unshift({ text: base + suffix, eligible: eligibleCount });
      simulationHistory = simulationHistory.slice(0, 5);
      historyBody.innerHTML = simulationHistory.map(function (item) {
        return `<li>${item.text}</li>`;
      }).join('');
    }

    function render(state) {
      setRangeLabels(state);

      const evaluated = data.allVendors.map(function (vendor) {
        return { vendor, result: evaluate(vendor, state) };
      });

      const eligible = evaluated.filter(function (row) { return row.result.eligible; }).length;
      const ineligible = evaluated.length - eligible;
      const msmeEligible = evaluated.filter(function (row) {
        return row.vendor.msme && row.result.eligible;
      }).length;
      const ratio = eligible / evaluated.length;
      const competition = competitionLabel(ratio);
      const width = Math.round(ratio * 100);

      metricEls.eligible.textContent = `${eligible} / ${evaluated.length}`;
      metricEls.ineligible.textContent = `${ineligible} / ${evaluated.length}`;
      metricEls.msmeEligible.textContent = String(msmeEligible);
      metricEls.competition.textContent = competition;

      competitionFill.style.width = `${width}%`;
      competitionFill.style.backgroundColor = colorForRatio(ratio);

      tableBody.innerHTML = '';
      evaluated.forEach(function (row) {
        const tr = document.createElement('tr');
        tr.className = row.result.eligible ? '' : 'ineligible';
        tr.innerHTML = `
          <td>${row.vendor.name}</td>
          <td>${row.vendor.city}</td>
          <td>₹${row.vendor.turnover}Cr</td>
          <td>${row.vendor.exp}yr</td>
          <td>${row.vendor.gst ? 'Yes' : 'No'}</td>
          <td>${row.vendor.msme ? 'Yes' : 'No'}</td>
          <td><span class="badge ${row.result.eligible ? 'badge-pass' : 'badge-fail'} ${row.result.eligible ? '' : 'status-strike'}">${row.result.eligible ? 'Eligible' : 'Ineligible'}</span></td>
        `;
        tableBody.appendChild(tr);
      });

      renderChart(evaluated);

      const baselineEligible = 3;
      const addedVendors = eligible - baselineEligible;
      const competitionDelta = Math.round((addedVendors / 5) * 100);
      const risk = riskLabel(eligible);

      const changeText = state.turnover < defaults.turnover
        ? `Turnover reduced by ₹${defaults.turnover - state.turnover}Cr`
        : `Turnover increased by ₹${state.turnover - defaults.turnover}Cr`;

      policyEls.change.textContent = changeText;
      policyEls.gain.textContent = `${addedVendors >= 0 ? '+' : ''}${addedVendors} vendors now eligible`;
      policyEls.competition.textContent = `${competitionDelta >= 0 ? '+' : ''}${competitionDelta}% increase`;
      policyEls.risk.innerHTML = `<span class="badge ${risk.badge}">${risk.text}</span>`;

      const insight = `Reducing the turnover threshold from ₹10Cr to ₹${state.turnover}Cr opens eligibility to ${Math.max(addedVendors, 0)} additional vendors, increasing competition by ${Math.max(competitionDelta, 0)}%.`;
      const cards = [`<div class="insight-card"><strong>Simulation Insight:</strong> ${insight}</div>`];

      if (eligible < 3) {
        cards.push(`<div class="insight-card warn"><strong>CRITICAL:</strong> Only ${eligible} vendors eligible. CAG audit guidelines flag tenders with fewer than 3 bidders as high-risk for collusion and price manipulation.</div>`);
      }

      if (eligible >= 7) {
        cards.push('<div class="insight-card good"><strong>Healthy competition expected.</strong> This tender meets CAG benchmarks for fair procurement.</div>');
      }

      insightWrap.innerHTML = cards.join('');
      lastInsight = insight;
      lastCompetition = competition;
      lastRisk = risk.text;
    }

    function readState() {
      return {
        turnover: Number(controls.turnover.value),
        experience: Number(controls.experience.value),
        gst: controls.gst.checked,
        msme: controls.msme.value,
        cap: Number(controls.cap.value)
      };
    }

    function onControlInput() {
      render(readState());
    }

    function onControlChange() {
      const state = readState();
      render(state);
      const eligibleCount = countEligibleVendors(data.allVendors, evaluate, state);
      updateHistory(state, eligibleCount);
    }

    function bindControlListeners() {
      Object.keys(controls).forEach(function (key) {
        controls[key].addEventListener('input', onControlInput);
        controls[key].addEventListener('change', onControlChange);
      });
    }

    function applyPreset(presetName, preset) {
      controls.turnover.value = String(preset.turnover);
      controls.experience.value = String(preset.experience);
      controls.gst.checked = preset.gst;
      controls.msme.value = preset.msme;
      controls.cap.value = String(preset.cap);
      const state = readState();
      render(state);
      const eligibleCount = countEligibleVendors(data.allVendors, evaluate, state);
      updateHistory(state, eligibleCount, presetName);
    }

    function bindPresets() {
      const presets = {
        default: { turnover: 10, experience: 7, gst: true, msme: 'none', cap: 100 },
        msme: { turnover: 4, experience: 4, gst: false, msme: '-25', cap: 100 },
        restrictive: { turnover: 15, experience: 10, gst: true, msme: 'none', cap: 100 },
        competition: { turnover: 2, experience: 2, gst: false, msme: '-25', cap: 120 }
      };

      document.getElementById('preset-default').addEventListener('click', function () {
        applyPreset('Current', presets.default);
      });
      document.getElementById('preset-msme').addEventListener('click', function () {
        applyPreset('MSME Friendly', presets.msme);
      });
      document.getElementById('preset-restrictive').addEventListener('click', function () {
        applyPreset('Highly Restrictive', presets.restrictive);
      });
      document.getElementById('preset-competition').addEventListener('click', function () {
        applyPreset('Maximum Competition', presets.competition);
      });
    }

    exportBtn.addEventListener('click', function () {
      const state = readState();
      const eligible = countEligibleVendors(data.allVendors, evaluate, state);
      const exportText = [
        'NyayaBid AI — Simulation Export',
        `Date: ${utils.formatDate(new Date())}`,
        `Tender: ${data.tender.id}`,
        '',
        'Criteria Simulated:',
        `- Min Turnover: ₹${state.turnover} Crore`,
        `- Min Experience: ${state.experience} Years`,
        `- GST Required: ${state.gst ? 'Yes' : 'No'}`,
        `- MSME Relaxation: ${state.msme}`,
        '',
        'Result:',
        `- Eligible Vendors: ${eligible}/10`,
        `- Competition Level: ${lastCompetition}`,
        `- CAG Risk: ${lastRisk}`,
        '',
        'Insight:',
        lastInsight,
        '',
        'Generated by NyayaBid AI v1.0'
      ].join('\n');

      const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nyayabid-simulation-export.txt';
      a.click();
      URL.revokeObjectURL(url);
    });

    bindControlListeners();
    bindPresets();
    render(readState());
    historyBody.innerHTML = '<li>No simulation history yet. Move controls or use a preset.</li>';
  }

  root.NyayaBid.simulation = {
    initSimulationPage
  };
})();
