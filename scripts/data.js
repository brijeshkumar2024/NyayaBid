(function () {
  const root = globalThis;
  root.NyayaBid = root.NyayaBid || {};

  function formatINR(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const tender = {
    id: 'TND-2024-001',
    title: 'Road Construction and Maintenance Works, NH-48, Segment 4, New Delhi',
    authority: 'Delhi Public Works Department',
    estimatedCost: 475000000,
    emdRequired: 94000,
    bidSubmissionDeadline: '2024-03-15',
    openingDate: '2024-03-16',
    reference: 'GFR 2017, Rule 160 & 175',
    contact: 'procurement@delpwd.gov.in',
    criteriaText: [
      'Minimum Annual Turnover: ₹10 Crore (last 3 FYs)',
      'Minimum Experience: 7 Years in similar works',
      'GST Registration: Mandatory',
      'MSME: Relaxed criteria applicable (−25% turnover)'
    ]
  };

  const criteria = {
    minTurnover: 10,
    minExperience: 7,
    gstMandatory: true,
    msmeRelaxation: 0.75
  };

  const vendors = [
    {
      id: 'V001', name: 'Bharat Infra Pvt Ltd', city: 'Mumbai, Maharashtra',
      cin: 'U45200MH2012PTC123456', turnover: 18, experience: 12, gst: true, msme: false,
      gstNo: '27AABCB1234A1Z5', bidValue: 442000000, crossDocFlag: false, collusionRisk: false
    },
    {
      id: 'V002', name: 'Sunrise Tech Solutions', city: 'Pune, Maharashtra',
      cin: 'U45201PN2017PTC267341', turnover: 7, experience: 5, gst: true, msme: true,
      gstNo: '27AAJCS2098M1Z1', bidValue: 401500000, crossDocFlag: false, collusionRisk: false,
      uncertaintyScore: 61
    },
    {
      id: 'V003', name: 'GreenBuild Contractors', city: 'Delhi, NCR',
      cin: 'U45203DL2015PTC398112', turnover: 12, experience: 9, gst: true, msme: false,
      gstNo: '07AABCG4567P1ZA', bidValue: 438000000, crossDocFlag: true,
      crossDocReason: 'GST certificate date (Mar 2019) predates company registration (Jun 2019)',
      collusionRisk: false
    },
    {
      id: 'V004', name: 'Aakash Civil Works', city: 'Nagpur, Maharashtra',
      cin: 'U45209MH2018PTC990124', turnover: 3, experience: 4, gst: false, msme: true,
      gstNo: 'Not Available', bidValue: 389000000, crossDocFlag: false, collusionRisk: true,
      collusionReason: 'Registered address matches V002 (Sunrise Tech Solutions)'
    },
    {
      id: 'V005', name: 'Pioneer Systems Ltd', city: 'Chennai, Tamil Nadu',
      cin: 'U74999TN2011PLC076543', turnover: 15, experience: 11, gst: true, msme: false,
      gstNo: '33AACCP7654N1ZT', bidValue: 446500000, crossDocFlag: false, collusionRisk: false
    }
  ].map(function (vendor) {
    return {
      ...vendor,
      documents: ['Financial Statement', 'GST Certificate', 'Experience Certificate', 'EMD Receipt']
    };
  });

  const allVendors = [
    { name: 'Bharat Infra Pvt Ltd', city: 'Mumbai', turnover: 18, exp: 12, gst: true, msme: false },
    { name: 'Sunrise Tech Solutions', city: 'Pune', turnover: 7, exp: 5, gst: true, msme: true },
    { name: 'GreenBuild Contractors', city: 'Delhi', turnover: 12, exp: 9, gst: true, msme: false },
    { name: 'Aakash Civil Works', city: 'Nagpur', turnover: 3, exp: 4, gst: false, msme: true },
    { name: 'Pioneer Systems Ltd', city: 'Chennai', turnover: 15, exp: 11, gst: true, msme: false },
    { name: 'Sahyadri Constructions', city: 'Kolhapur', turnover: 5, exp: 6, gst: true, msme: true },
    { name: 'NovaTech Engineering', city: 'Bengaluru', turnover: 9, exp: 8, gst: true, msme: false },
    { name: 'Disha Small Works', city: 'Bhopal', turnover: 2, exp: 3, gst: false, msme: true },
    { name: 'Apex Global Services', city: 'Hyderabad', turnover: 22, exp: 14, gst: true, msme: false },
    { name: 'LocalBuild Associates', city: 'Jaipur', turnover: 4, exp: 5, gst: true, msme: true }
  ];

  const seedFlags = [
    {
      id: 'F-CROSSDOC',
      vendor: 'GreenBuild Contractors',
      type: 'Cross-Document Inconsistency',
      level: 'amber',
      detail: 'GST certificate issue date (March 2019) predates company incorporation date (June 2019). Certificate may be fraudulent.',
      recommendedAction: 'Request re-submission of GST certificate with notarized copy.'
    },
    {
      id: 'F-COLLUSION',
      vendor: 'Aakash Civil Works',
      type: 'Collusion Risk Detected',
      level: 'red',
      detail: 'Registered office address matches exactly with Vendor V002 (Sunrise Tech Solutions, Pune). Possible proxy bidder arrangement.',
      recommendedAction: 'Disqualify pending investigation. Flag to CVC.'
    }
  ];

  root.NyayaBid.utils = {
    formatINR,
    formatDate
  };

  root.NyayaBid.data = {
    tender,
    criteria,
    vendors,
    allVendors,
    seedFlags
  };
})();
