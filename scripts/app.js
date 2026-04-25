(function () {
  'use strict';
  const root = globalThis;
  root.NyayaBid = root.NyayaBid || {};

  // ── Toast ──────────────────────────────────────────────────────────────
  function showToast(message, type) {
    const rootEl = document.getElementById('global-toast-root');
    if (!rootEl) return;
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type || '');
    toast.textContent = message;
    rootEl.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 240);
    }, 3000);
  }

  // ── Settings modal ─────────────────────────────────────────────────────
  function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;
    modal.showModal();
  }

  function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;
    modal.close();
  }

  // Expose globally so any inline handler can also call them
  root.openSettingsModal  = openSettingsModal;
  root.closeSettingsModal = closeSettingsModal;

  // ── Dashboard page init ────────────────────────────────────────────────
  function initDashboardPage() {
    if (!document.querySelector('[data-page="dashboard"]')) return;

    const data  = root.NyayaBid.data;
    const utils = root.NyayaBid.utils;

    const statusDate = document.getElementById('system-sync-date');
    if (statusDate) statusDate.textContent = utils.formatDate(new Date());

    try {
      const rows      = root.NyayaBid.evaluation.runBatchEvaluation(data.vendors);
      const tableBody = document.getElementById('recent-evals-body');
      if (tableBody) {
        tableBody.innerHTML = rows.map(function (entry) {
          const statusClass = entry.result.status === 'Eligible' ? 'ok' : 'reject';
          return '<tr>' +
            '<td>' + data.tender.id + '</td>' +
            '<td>' + entry.vendor.name + '</td>' +
            '<td><span class="status-pill ' + statusClass + '">' + entry.result.status + '</span></td>' +
            '<td>' + entry.result.confidence + '%</td>' +
            '<td><a href="evaluate.html" class="btn btn-secondary tiny-btn">Open</a></td>' +
            '</tr>';
        }).join('');
      }
    } catch (e) {
      console.error('NyayaBid dashboard eval error:', e);
    }

    document.querySelectorAll('[data-countup]').forEach(function (el) {
      const target = Number.parseInt(el.dataset.countup, 10);
      let current  = 0;
      const step   = Math.ceil(target / 20);
      const timer  = setInterval(function () {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 40);
    });

    const auditModal   = document.getElementById('audit-trail-modal');
    const auditOpenBtn = document.getElementById('open-audit-trail');
    const auditCloseBtn = document.getElementById('close-audit-trail');
    if (auditModal && auditOpenBtn && auditCloseBtn) {
      auditOpenBtn.addEventListener('click',  function () { auditModal.classList.add('show'); });
      auditCloseBtn.addEventListener('click', function () { auditModal.classList.remove('show'); });
      auditModal.addEventListener('click', function (e) {
        if (e.target === auditModal) auditModal.classList.remove('show');
      });
    }

    const confidenceSlider = document.getElementById('settings-confidence-threshold');
    const confidenceValue  = document.getElementById('settings-confidence-value');
    if (confidenceSlider && confidenceValue) {
      confidenceSlider.addEventListener('input', function () {
        confidenceValue.textContent = confidenceSlider.value + '%';
      });
    }

    const settingsSave = document.getElementById('settings-save');
    if (settingsSave) {
      settingsSave.addEventListener('click', function () {
        showToast('Settings saved successfully.', 'success');
        closeSettingsModal();
      });
    }

    const settingsReset = document.getElementById('settings-reset');
    if (settingsReset) {
      settingsReset.addEventListener('click', function () {
        showToast('Settings reset to defaults.', 'success');
      });
    }

    const settingsClearData = document.getElementById('settings-clear-data');
    if (settingsClearData) {
      settingsClearData.addEventListener('click', function () {
        if (!root.confirm('This will clear all evaluation data. Are you sure?')) return;
        try { localStorage.clear(); } catch (e) { console.error('NyayaBid clear failed:', e); }
        showToast('Session data cleared.', 'success');
      });
    }
  }

  // ── Shared UI helpers ──────────────────────────────────────────────────
  function addDemoModeBadge() {
    if (document.querySelector('.demo-mode-badge')) return;
    const badge = document.createElement('div');
    badge.className = 'demo-mode-badge';
    badge.textContent = 'PROTOTYPE v1.0 — NyayaBid AI';
    document.body.appendChild(badge);
  }

  function addJudgeDemoHelper() {
    if (document.querySelector('.judge-helper-btn')) return;
    const btn   = document.createElement('button');
    btn.className = 'judge-helper-btn';
    btn.title     = 'Judge Helper';
    btn.textContent = '?';
    const popup = document.createElement('div');
    popup.className    = 'judge-helper-popup';
    popup.style.display = 'none';
    popup.innerHTML = '<strong>Judge Helper</strong><p>Upload a tender PDF or use the demo tender to run an evaluation. Then open the Report page to generate a CAG-ready audit report.</p>';
    btn.addEventListener('click', function () {
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    });
    document.body.appendChild(popup);
    document.body.appendChild(btn);
  }

  function addGlobalFooterHint() {
    const hint = document.querySelector('.global-footer-hint');
    if (hint) hint.textContent = 'NyayaBid AI — GFR-aligned procurement evaluation';
  }

  function setActiveNav() {
    const path = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link, .sidebar-link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href) link.classList.toggle('is-active', href === path);
    });
  }

  function enablePageFadeIn() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(function () { document.body.style.opacity = '1'; });
  }

  function bindKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeSettingsModal();
      }
    });
  }

  // ── Boot ───────────────────────────────────────────────────────────────
  function boot() {
    root.NyayaBid.app = {
      showToast:          showToast,
      openSettingsModal:  openSettingsModal,
      closeSettingsModal: closeSettingsModal
    };

    enablePageFadeIn();
    bindKeyboardShortcuts();
    addGlobalFooterHint();
    addDemoModeBadge();
    addJudgeDemoHelper();
    setActiveNav();

    // Settings button — present on every page via sidebar
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', function () {
        console.log('Settings button clicked');
        openSettingsModal();
      });
    }

    // Settings close buttons — works for both dashboard's rich modal and
    // the lightweight modal on other pages
    ['settings-close', 'close-settings', 'settings-close-footer'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', closeSettingsModal);
    });

    // Click-outside-to-close (dialog backdrop click)
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
      settingsModal.addEventListener('click', function (e) {
        const rect = settingsModal.getBoundingClientRect();
        const clickedBackdrop = e.clientX < rect.left || e.clientX > rect.right ||
          e.clientY < rect.top || e.clientY > rect.bottom;
        if (clickedBackdrop) closeSettingsModal();
      });
    }

    initDashboardPage();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
