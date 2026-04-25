(function () {
  'use strict';
  const root = globalThis;
  root.NyayaBid = root.NyayaBid || {};

  // ── Shared toast utility ───────────────────────────────────────────────
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

  function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;
    console.log('Opening settings modal');
    modal.style.display = 'block';
    modal.classList.add('show');
  }

  function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('show');
  }

  globalThis.openSettingsModal = openSettingsModal;
  globalThis.closeSettingsModal = closeSettingsModal;

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('settings-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        console.log('Settings button clicked');
        openSettingsModal();
      });
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.getElementById('settings-close') || document.getElementById('close-settings');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSettingsModal);
    }
    const closeBtnFooter = document.getElementById('settings-close-footer');
    if (closeBtnFooter) {
      closeBtnFooter.addEventListener('click', closeSettingsModal);
    }
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeSettingsModal();
      });
    }
  });

  // ── Dashboard page ─────────────────────────────────────────────────────
  function initDashboardPage() {
    const page = document.querySelector('[data-page="dashboard"]');
    if (!page) return;

    const data = root.NyayaBid.data;
    const utils = root.NyayaBid.utils;

    // Sync date
    const statusDate = document.getElementById('system-sync-date');
    if (statusDate) statusDate.textContent = utils.formatDate(new Date());

    // Recent evaluations table
    try {
      const rows = root.NyayaBid.evaluation.runBatchEvaluation(data.vendors);
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

    // Count-up animation for metric cards
    document.querySelectorAll('[data-countup]').forEach(function (el) {
      const target = Number.parseInt(el.dataset.countup, 10);
      let current = 0;
      const step = Math.ceil(target / 20);
      const timer = setInterval(function () {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 40);
    });

    // Audit trail modal
    const modal = document.getElementById('audit-trail-modal');
    const openBtn = document.getElementById('open-audit-trail');
    const closeBtn = document.getElementById('close-audit-trail');
    if (modal && openBtn && closeBtn) {
      openBtn.addEventListener('click', function () { modal.classList.add('show'); });
      closeBtn.addEventListener('click', function () { modal.classList.remove('show'); });
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('show');
      });
    }

    // Settings modal
    const settingsClose = document.getElementById('settings-close') || document.getElementById('close-settings');
    const settingsCloseFooter = document.getElementById('settings-close-footer');
    const settingsSave = document.getElementById('settings-save');
    const settingsReset = document.getElementById('settings-reset');
    const settingsClearData = document.getElementById('settings-clear-data');
    const confidenceSlider = document.getElementById('settings-confidence-threshold');
    const confidenceValue = document.getElementById('settings-confidence-value');

    if (settingsClose) settingsClose.addEventListener('click', closeSettingsModal);
    if (settingsCloseFooter) settingsCloseFooter.addEventListener('click', closeSettingsModal);
    if (confidenceSlider && confidenceValue) {
      confidenceSlider.addEventListener('input', function () {
        confidenceValue.textContent = confidenceSlider.value + '%';
      });
    }
    if (settingsSave) {
      settingsSave.addEventListener('click', function () {
        showToast('Settings saved successfully.', 'success');
        closeSettingsModal();
      });
    }
    if (settingsReset) {
      settingsReset.addEventListener('click', function () {
        showToast('Settings reset to defaults.', 'success');
      });
    }
    if (settingsClearData) {
      settingsClearData.addEventListener('click', function () {
        if (!root.confirm('This will clear all evaluation data. Are you sure?')) return;
        try {
          localStorage.clear();
        } catch (e) {
          console.error('NyayaBid settings clear failed:', e);
        }
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
    const btn = document.createElement('button');
    btn.className = 'judge-helper-btn';
    btn.title = 'Judge Helper';
    btn.textContent = '?';
    const popup = document.createElement('div');
    popup.className = 'judge-helper-popup';
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
    requestAnimationFrame(function () {
      document.body.style.opacity = '1';
    });
  }

  function bindKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.show').forEach(function (m) {
          m.classList.remove('show');
        });
      }
    });
  }

  // ── Boot ───────────────────────────────────────────────────────────────
  function boot() {
    root.NyayaBid.app = { showToast: showToast, openSettingsModal: openSettingsModal, closeSettingsModal: closeSettingsModal };
    enablePageFadeIn();
    bindKeyboardShortcuts();
    addGlobalFooterHint();
    addDemoModeBadge();
    addJudgeDemoHelper();
    setActiveNav();
    initDashboardPage();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
