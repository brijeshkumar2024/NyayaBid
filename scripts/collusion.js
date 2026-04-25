(function () {
  const root = globalThis;

  function getFlagCards(vendors, overrides) {
    try {
      const baseSeedFlags = root.NyayaBid?.data?.seedFlags || [];
      const baseFlags = Array.isArray(baseSeedFlags) ? baseSeedFlags.slice() : [];
      const manualOverrides = Array.isArray(overrides) ? overrides : [];
      const manual = manualOverrides.map(function (entry, idx) {
        const vendorName = entry?.vendorName || 'Unknown Vendor';
        const newStatus = entry?.newStatus || 'Unknown';
        return {
          id: `F-OVERRIDE-${idx + 1}`,
          vendor: vendorName,
          type: 'Manual Override',
          level: 'amber',
          detail: `Manual Override — ${vendorName} — by Officer`,
          recommendedAction: `Override status changed to ${newStatus}. Justification recorded in audit trail.`
        };
      });
      return baseFlags.concat(manual);
    } catch (error) {
      console.error('NyayaBid collusion flag generation error:', error);
      return [];
    }
  }

  function collusionNarrative() {
    return 'Mohanty Civil Works was flagged by the collusion detector because its registered office address matched exactly with Sunrise Tech Solutions. In procurement risk analytics, exact address overlap among active bidders is treated as a strong indicator of potential proxy participation. The system recommends temporary disqualification and referral for CVC review before commercial bid opening.';
  }

  root.NyayaBid.collusion = {
    getFlagCards,
    collusionNarrative
  };
})();
