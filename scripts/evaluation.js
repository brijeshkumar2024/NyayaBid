(function () {
  const root = globalThis;
  const criteria = root.NyayaBid?.data?.criteria || {};

  // Tender criteria
  const defaultCriteria = {
    minTurnover: 10, // crore
    minExperience: 7, // years
    gstMandatory: true,
    msmeRelaxation: 0.75 // MSME vendors get 25% relaxation
  };

  function sanitizeCriteria(input) {
    const merged = input ? { ...defaultCriteria, ...input } : { ...defaultCriteria };
    const msmeRelaxation = Number(merged.msmeRelaxation);
    return {
      minTurnover: Number.isFinite(Number(merged.minTurnover)) ? Number(merged.minTurnover) : defaultCriteria.minTurnover,
      minExperience: Number.isFinite(Number(merged.minExperience)) ? Number(merged.minExperience) : defaultCriteria.minExperience,
      gstMandatory: Boolean(merged.gstMandatory),
      // Guard divide-by-zero and negative relaxation values.
      msmeRelaxation: Number.isFinite(msmeRelaxation) && msmeRelaxation > 0 ? msmeRelaxation : defaultCriteria.msmeRelaxation
    };
  }

  function sanitizeVendor(vendor) {
    const v = vendor || {};
    return {
      ...v,
      turnover: Number.isFinite(Number(v.turnover)) ? Number(v.turnover) : 0,
      experience: Number.isFinite(Number(v.experience)) ? Number(v.experience) : 0,
      gst: Boolean(v.gst),
      msme: Boolean(v.msme),
      crossDocFlag: Boolean(v.crossDocFlag),
      crossDocReason: v.crossDocReason || 'Cross-document discrepancy detected.'
    };
  }

  // Evaluation function
  function evaluateVendor(vendor, currentCriteria) {
    try {
      const normalizedVendor = sanitizeVendor(vendor);
      const normalizedCriteria = sanitizeCriteria(currentCriteria);

      const effectiveTurnover = normalizedVendor.msme
        ? normalizedVendor.turnover / normalizedCriteria.msmeRelaxation
        : normalizedVendor.turnover;

      const turnoverPass = effectiveTurnover >= normalizedCriteria.minTurnover;
      const expPass = normalizedVendor.experience >= normalizedCriteria.minExperience;
      const gstPass = normalizedCriteria.gstMandatory ? normalizedVendor.gst : true;

      const allPass = turnoverPass && expPass && gstPass;

      // Confidence scoring
      let confidence = 100;
      if (!turnoverPass) confidence -= 40;
      if (!expPass) confidence -= 30;
      if (!gstPass) confidence -= 30;
      if (normalizedVendor.crossDocFlag) confidence -= 15;
      confidence = Math.max(confidence, 0);

      // Reason generation
      const reasons = [];
      if (!turnoverPass) reasons.push(`Turnover ₹${normalizedVendor.turnover}Cr below minimum ₹${normalizedCriteria.minTurnover}Cr`);
      if (!expPass) reasons.push(`Experience ${normalizedVendor.experience}yr below minimum ${normalizedCriteria.minExperience}yr`);
      if (!gstPass) reasons.push('GST registration not found');
      if (normalizedVendor.crossDocFlag) reasons.push(normalizedVendor.crossDocReason);

      return {
        turnoverPass,
        expPass,
        gstPass,
        eligible: allPass,
        confidence,
        reasons: reasons.length ? reasons : ['All criteria satisfied'],
        status: allPass ? 'Eligible' : 'Rejected'
      };
    } catch (error) {
      console.error('NyayaBid evaluation error:', error);
      return {
        turnoverPass: false,
        expPass: false,
        gstPass: false,
        eligible: false,
        confidence: 0,
        reasons: ['Evaluation failed due to invalid vendor data.'],
        status: 'Rejected'
      };
    }
  }

  function runBatchEvaluation(vendors, overrideCriteria) {
    try {
      let activeCriteria = { ...criteria, ...defaultCriteria };
      if (overrideCriteria) {
        activeCriteria = { ...activeCriteria, ...overrideCriteria };
      }
      const normalizedVendors = Array.isArray(vendors) ? vendors : [];
      return normalizedVendors.map(function (vendor) {
        return {
          vendor: vendor || {},
          result: evaluateVendor(vendor, activeCriteria)
        };
      });
    } catch (error) {
      console.error('NyayaBid batch evaluation error:', error);
      return [];
    }
  }

  root.NyayaBid.evaluation = {
    defaultCriteria,
    evaluateVendor,
    runBatchEvaluation
  };
})();
