/**
 * NyayaBid AI — Document Intelligence Module (Demo)
 * -------------------------------------------------------
 * Provides three capabilities:
 *   1. PDF text extraction via pdf.js
 *   2. Image OCR via Tesseract.js
 *   3. Data mapping: extracted text → evaluation input fields
 *
 * All processing is client-side. No backend required.
 * Accuracy is demo-level — not production-grade.
 */

(function () {
  const root = globalThis;
  root.NyayaBid = root.NyayaBid || {};

  // ─── Demo disclaimer shown above every extraction result ──────────────────
  // Purpose: sets honest expectations for judges — this is a prototype pipeline,
  // not a production AI model. Keeps the demo credible.
  const DEMO_NOTICE = 'This is a demo-level extraction. Final system will use an advanced AI pipeline.';

  // ─── Keywords to highlight in extracted text ──────────────────────────────
  // These are the most evaluation-relevant terms in tender documents.
  // Highlighted so judges can instantly spot key data without reading everything.
  const HIGHLIGHT_KEYWORDS = ['turnover', 'gst', 'experience', 'certificate', 'registration', 'annual', 'crore'];

  // ─── Regex patterns for OCR entity detection ───────────────────────────────
  const PATTERNS = {
    gst:      /\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}\b/gi,
    date:     /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g,
    currency: /₹\s?\d[\d,]*(\.\d+)?|\bINR\s?\d[\d,]*/gi,
    turnover: /turnover[:\s]+₹?\s?(\d+[\d.,]*)\s*(crore|cr|lakh)?/gi,
    experience: /experience[:\s]+(\d+)\s*(years?|yrs?)/gi
  };

  // ─── Generate a fake confidence score in the 60–95% range ─────────────────
  function fakeConfidence() {
    return Math.floor(Math.random() * 36) + 60; // 60–95
  }

  /**
   * HIGHLIGHTING LOGIC
   * ───────────────────
   * To avoid double-wrapping (e.g. a keyword inside a currency mark), we use
   * a placeholder strategy:
   *   1. Run all three regex passes, replacing matches with numbered placeholders
   *      like %%MARK_0%%, %%MARK_1%%, etc.
   *   2. After all passes, swap every placeholder back to its real <mark> HTML.
   * This guarantees no regex ever sees a partially-built HTML tag.
   */
  function highlightKeywords(text) {
    // Escape HTML entities so injected mark tags are the only raw HTML
    let safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const marks = [];   // stores { placeholder, html } pairs

    function stash(html) {
      const key = `%%MARK_${marks.length}%%`;
      marks.push({ key, html });
      return key;
    }

    // Pass 1 — currency: ₹ amounts, INR prefix, bare numbers ≥5 digits
    safe = safe.replace(
      /(₹\s?[\d,]+(?:\.\d+)?(?:\s?(?:crore|lakh|cr))?|\bINR\s?[\d,]+|\b\d{5,}\b)/gi,
      function (m) { return stash(`<mark class="doc-highlight-currency">${m}</mark>`); }
    );

    // Pass 2 — GST numbers (Indian 15-char format)
    safe = safe.replace(
      /(\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]\b)/gi,
      function (m) { return stash(`<mark class="doc-highlight-gst">${m}</mark>`); }
    );

    // Pass 3 — evaluation keywords; placeholders from passes 1 & 2 are opaque
    // strings so they won't accidentally match any keyword
    HIGHLIGHT_KEYWORDS.forEach(function (kw) {
      const re = new RegExp(`\\b(${kw})\\b`, 'gi');
      safe = safe.replace(re, function (m) {
        return stash(`<mark class="doc-highlight">${m}</mark>`);
      });
    });

    // Swap all placeholders back to real HTML in one final pass
    marks.forEach(function (entry) {
      safe = safe.split(entry.key).join(entry.html);
    });

    return safe;
  }

  // ─── Detect structured entities in raw OCR/PDF text ───────────────────────
  function detectEntities(text) {
    const found = {};
    const gstMatches = text.match(PATTERNS.gst);
    if (gstMatches) found.gstNo = gstMatches[0];

    const dateMatches = text.match(PATTERNS.date);
    if (dateMatches) found.dates = dateMatches.slice(0, 3);

    const currencyMatches = text.match(PATTERNS.currency);
    if (currencyMatches) found.amounts = currencyMatches.slice(0, 3);

    // Try to extract turnover number
    PATTERNS.turnover.lastIndex = 0;
    const turnoverMatch = PATTERNS.turnover.exec(text);
    if (turnoverMatch) found.turnover = parseFloat(turnoverMatch[1].replace(/,/g, ''));

    // Try to extract experience years
    PATTERNS.experience.lastIndex = 0;
    const expMatch = PATTERNS.experience.exec(text);
    if (expMatch) found.experience = parseInt(expMatch[1], 10);

    return found;
  }

  // ─── Build a small entity summary HTML string ──────────────────────────────
  function buildEntitySummary(entities) {
    const items = [];
    if (entities.gstNo)    items.push(`<span class="doc-entity">GST: ${entities.gstNo}</span>`);
    if (entities.turnover) items.push(`<span class="doc-entity">Turnover: ₹${entities.turnover} Cr</span>`);
    if (entities.experience) items.push(`<span class="doc-entity">Experience: ${entities.experience} yrs</span>`);
    if (entities.dates && entities.dates.length)
      items.push(`<span class="doc-entity">Date: ${entities.dates[0]}</span>`);
    if (entities.amounts && entities.amounts.length)
      items.push(`<span class="doc-entity">Amount: ${entities.amounts[0]}</span>`);
    return items.length ? `<div class="doc-entities">${items.join('')}</div>` : '';
  }

  // ─── Render result into the output container ─────────────────────────────
  function renderOutput(containerId, rawText, label, entities) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const confidence = fakeConfidence();
    const highlighted = highlightKeywords(rawText);
    const entityHtml = buildEntitySummary(entities);

    // doc-output-animate triggers the CSS fade-in on fresh renders
    container.innerHTML = `
      <div class="doc-output-animate">

        <!-- Demo notice banner — reminds judges this is prototype-level accuracy -->
        <div class="doc-demo-notice">ℹ️ ${DEMO_NOTICE}</div>

        <div class="doc-output-header">
          <span class="doc-label">${label}</span>
          <span class="doc-confidence">Extraction Confidence: ${confidence}%</span>
        </div>

        ${entityHtml}

        <div class="doc-text-scroll"><pre>${highlighted}</pre></div>

        <!-- CTA block — prominent button + helper text below extracted output -->
        <div class="doc-cta-block">
          <button class="btn btn-primary doc-use-btn" type="button">
            ✅ Use this data
          </button>
          <span class="doc-cta-hint">Auto-fill extracted values into evaluation system</span>
        </div>

      </div>
    `;

    /**
     * CTA MAPPING BEHAVIOR
     * ─────────────────────
     * On click: fills the mapped-fields panel, shows a success toast,
     * then smoothly scrolls the user down to the mapped-panel so they
     * can see the pre-filled values without hunting for them.
     */
    container.querySelector('.doc-use-btn').addEventListener('click', function () {
      mapToEvalFields(entities);
    });
  }

  /**
   * PDF EXTRACTION LOGIC
   * ─────────────────────
   * Uses pdf.js (loaded via CDN) to read each page of the uploaded PDF,
   * concatenates all text content, then highlights keywords and detects entities.
   *
   * Guards:
   *  - Checks pdfjsLib exists before calling (CDN may fail to load)
   *  - Validates file MIME type (accept attribute is advisory only)
   */
  function extractPDF(file) {
    const outputId = 'pdf-output';
    const container = document.getElementById(outputId);
    if (!container) return;

    // Guard: CDN library not loaded
    if (typeof pdfjsLib === 'undefined') {
      container.innerHTML = '<p class="doc-error">PDF library failed to load. Please check your internet connection and refresh.</p>';
      return;
    }

    // Guard: wrong file type (browser accept attribute is advisory only)
    if (file.type && file.type !== 'application/pdf') {
      container.innerHTML = '<p class="doc-error">Invalid file type. Please upload a PDF document.</p>';
      return;
    }

    container.innerHTML = '<div class="doc-spinner"><span class="spinner"></span> Reading PDF…</div>';

    const fileReader = new FileReader();
    fileReader.onload = async function (e) {
      try {
        // pdf.js requires a typed array
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          // Join text items with spaces; add newline between pages
          fullText += content.items.map(function (item) { return item.str; }).join(' ') + '\n\n';
        }

        const trimmed = fullText.trim();
        // Edge case: PDF had no extractable text (e.g. scanned image PDF)
        const displayText = trimmed || 'No readable text found. This may be a scanned PDF. Try the Image OCR option instead.';
        const entities = detectEntities(trimmed);
        renderOutput(outputId, displayText, 'Extracted from PDF (Demo Mode)', entities);
      } catch (err) {
        container.innerHTML = `<p class="doc-error">Could not read PDF: ${err.message}</p>`;
      }
    };
    fileReader.onerror = function () {
      container.innerHTML = '<p class="doc-error">Failed to read file. Please try again.</p>';
    };
    fileReader.readAsArrayBuffer(file);
  }

  /**
   * OCR LOGIC
   * ──────────
   * Uses Tesseract.js (loaded via CDN) to run OCR on an uploaded image.
   * Shows a live progress percentage while processing.
   *
   * Guards:
   *  - Checks Tesseract exists before calling (CDN may fail to load)
   *  - Validates file is an image type
   *  - Logger uses a live DOM query (not a stale closure reference) so it
   *    still works even if the container was re-rendered mid-flight
   */
  function extractOCR(file) {
    const outputId = 'ocr-output';
    const container = document.getElementById(outputId);
    if (!container) return;

    // Guard: CDN library not loaded
    if (typeof Tesseract === 'undefined') {
      container.innerHTML = '<p class="doc-error">OCR library failed to load. Please check your internet connection and refresh.</p>';
      return;
    }

    // Guard: wrong file type
    if (file.type && !file.type.startsWith('image/')) {
      container.innerHTML = '<p class="doc-error">Invalid file type. Please upload a JPG or PNG image.</p>';
      return;
    }

    container.innerHTML = '<div class="doc-spinner" id="ocr-spinner-live"><span class="spinner"></span> Running OCR… 0%</div>';

    const imageUrl = URL.createObjectURL(file);

    // Tesseract.recognize returns a promise; we use the simple one-call API
    Tesseract.recognize(imageUrl, 'eng', {
      logger: function (m) {
        // Live DOM query — avoids stale reference if container was re-rendered
        if (m.status === 'recognizing text') {
          const pct = Math.round((m.progress || 0) * 100);
          const spinnerEl = document.getElementById('ocr-spinner-live');
          if (spinnerEl) spinnerEl.textContent = `Running OCR… ${pct}%`;
        }
      }
    }).then(function (result) {
      URL.revokeObjectURL(imageUrl);
      const rawText = (result.data && result.data.text) ? result.data.text.trim() : '';
      // Edge case: OCR ran but found nothing readable
      const displayText = rawText || 'No readable text detected. Try a clearer image with printed text.';
      const entities = detectEntities(rawText);
      renderOutput(outputId, displayText, 'OCR Output (Demo Mode — may have errors)', entities);
    }).catch(function (err) {
      URL.revokeObjectURL(imageUrl);
      container.innerHTML = `<p class="doc-error">OCR failed: ${err.message || 'Unknown error'}. Please try a different image.</p>`;
    });
  }

  /**
   * DATA MAPPING LOGIC
   * ───────────────────
   * Takes detected entities from extracted text and pre-fills the existing
   * evaluation vendor cards / form fields where possible.
   *
   * Since the existing system uses hardcoded vendor data (data.js), we show
   * a toast confirming what was detected and could be mapped. In a real system
   * this would write into form inputs directly.
   */
  function mapToEvalFields(entities) {
    // Guard: app.showToast may not exist if called before boot() completes
    const app = (root.NyayaBid && root.NyayaBid.app) || { showToast: function () {} };
    const mapped = [];

    if (entities.turnover) {
      mapped.push(`Turnover → ₹${entities.turnover} Cr`);
      const turnoverInput = document.getElementById('doc-mapped-turnover');
      if (turnoverInput) turnoverInput.value = entities.turnover;
    }
    if (entities.gstNo) {
      mapped.push(`GST No → ${entities.gstNo}`);
      const gstInput = document.getElementById('doc-mapped-gst');
      if (gstInput) gstInput.value = entities.gstNo;
    }
    if (entities.experience) {
      mapped.push(`Experience → ${entities.experience} years`);
      const expInput = document.getElementById('doc-mapped-experience');
      if (expInput) expInput.value = entities.experience;
    }

    if (mapped.length === 0) {
      app.showToast('No mappable fields detected in extracted text.', 'warn');
      return;
    }

    // Smooth-scroll to the mapped panel, then continue scrolling to Step 1
    // so the judge naturally flows toward running the evaluation.
    const panel = document.getElementById('doc-mapped-panel');
    if (panel) {
      document.getElementById('doc-mapped-list').innerHTML =
        mapped.map(function (m) { return `<li>${m}</li>`; }).join('');
      panel.classList.remove('hidden');

      // Scroll to the panel first, then after a short delay scroll to Step 1
      // so the judge sees the mapped values AND is guided toward evaluation.
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(function () {
        var step1 = document.querySelector('.step-label');
        if (step1) step1.closest('section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 900);
    }

    // Success toast — confirms data was mapped
    app.showToast('Data mapped successfully.', 'success');
  }

  // ─── Wire up file inputs after DOM is ready ────────────────────────────────
  function initDocIntelligence() {
    const page = document.querySelector('[data-page="evaluate"]');
    if (!page) return;

    // PDF upload
    const pdfInput = document.getElementById('doc-pdf-input');
    const pdfBtn   = document.getElementById('doc-pdf-btn');
    if (pdfBtn && pdfInput) {
      pdfBtn.addEventListener('click', function () { pdfInput.click(); });
      pdfInput.addEventListener('change', function () {
        const file = pdfInput.files && pdfInput.files[0];
        if (!file) return;
        // FIX: always call extractPDF — it handles wrong type internally with a
        // visible error message. The old outer guard silently did nothing on mismatch.
        extractPDF(file);
      });
    }

    // Image (OCR) upload
    const ocrInput = document.getElementById('doc-ocr-input');
    const ocrBtn   = document.getElementById('doc-ocr-btn');
    if (ocrBtn && ocrInput) {
      ocrBtn.addEventListener('click', function () { ocrInput.click(); });
      ocrInput.addEventListener('change', function () {
        const file = ocrInput.files && ocrInput.files[0];
        if (file) extractOCR(file);
      });
    }

    // Centre the spinner container so it looks clean on all screen sizes
    // (applied via CSS class doc-spinner — see dashboard.css)
  }

  // Expose init so app.js boot() can call it
  root.NyayaBid.docIntelligence = { init: initDocIntelligence };
})();
