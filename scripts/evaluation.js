(function () {
  const root = globalThis;
  const criteria = root.NyayaBid.data.criteria;

  // Tender criteria
  const defaultCriteria = {
    minTurnover: 10, // crore
    minExperience: 7, // years
    gstMandatory: true,
    msmeRelaxation: 0.75 // MSME vendors get 25% relaxation
  };

  // Evaluation function
  function evaluateVendor(vendor, currentCriteria) {
    const effectiveTurnover = vendor.msme
      ? vendor.turnover / currentCriteria.msmeRelaxation
      : vendor.turnover;

    const turnoverPass = effectiveTurnover >= currentCriteria.minTurnover;
    const expPass = vendor.experience >= currentCriteria.minExperience;
    const gstPass = currentCriteria.gstMandatory ? vendor.gst : true;

    const allPass = turnoverPass && expPass && gstPass;

    // Confidence scoring
    let confidence = 100;
    if (!turnoverPass) confidence -= 40;
    if (!expPass) confidence -= 30;
    if (!gstPass) confidence -= 30;
    if (vendor.crossDocFlag) confidence -= 15;
    confidence = Math.max(confidence, 0);

    // Reason generation
    const reasons = [];
    if (!turnoverPass) reasons.push(`Turnover ₹${vendor.turnover}Cr below minimum ₹${currentCriteria.minTurnover}Cr`);
    if (!expPass) reasons.push(`Experience ${vendor.experience}yr below minimum ${currentCriteria.minExperience}yr`);
    if (!gstPass) reasons.push('GST registration not found');
    if (vendor.crossDocFlag) reasons.push(vendor.crossDocReason);

    return {
      turnoverPass,
      expPass,
      gstPass,
      eligible: allPass,
      confidence,
      reasons: reasons.length ? reasons : ['All criteria satisfied'],
      status: allPass ? 'Eligible' : 'Rejected'
    };
  }

  function runBatchEvaluation(vendors, overrideCriteria) {
    let activeCriteria = { ...criteria, ...defaultCriteria };
    if (overrideCriteria) {
      activeCriteria = { ...activeCriteria, ...overrideCriteria };
    }
    return vendors.map(function (vendor) {
      return {
        vendor,
        result: evaluateVendor(vendor, activeCriteria)
      };
    });
  }

  root.NyayaBid.evaluation = {
    defaultCriteria,
    evaluateVendor,
    runBatchEvaluation
  };
})();
