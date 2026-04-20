(function () {
  const root = globalThis;

  function getFlagCards(vendors, overrides) {
    const baseFlags = root.NyayaBid.data.seedFlags.slice();
    const manual = (overrides || []).map(function (entry, idx) {
      return {
        id: `F-OVERRIDE-${idx + 1}`,
        vendor: entry.vendorName,
        type: 'Manual Override',
        level: 'amber',
        detail: `Manual Override — ${entry.vendorName} — by Officer`,
        recommendedAction: `Override status changed to ${entry.newStatus}. Justification recorded in audit trail.`
      };
    });
    return baseFlags.concat(manual);
  }

  function collusionNarrative() {
    return 'Aakash Civil Works was flagged by the collusion detector because its registered office address matched exactly with Sunrise Tech Solutions. In procurement risk analytics, exact address overlap among active bidders is treated as a strong indicator of potential proxy participation. The system recommends temporary disqualification and referral for CVC review before commercial bid opening.';
  }

  root.NyayaBid.collusion = {
    getFlagCards,
    collusionNarrative
  };
})();
