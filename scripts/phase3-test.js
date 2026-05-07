// Test script for Phase 3: Human-in-the-Loop Enforcement
// This script validates the override functionality

// Run tests when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== Phase 3 Validation: Human-in-the-Loop Enforcement ===');

  // Test 1: Check if logOverride function exists
  if (typeof logOverride === 'function') {
    console.log('✓ logOverride function exists');
  } else {
    console.log('✗ logOverride function missing');
  }

  // Test 2: Check if showOverrideModal function exists
  if (typeof showOverrideModal === 'function') {
    console.log('✓ showOverrideModal function exists');
  } else {
    console.log('✗ showOverrideModal function missing');
  }

  // Test 3: Check if submitOverride function exists
  if (typeof submitOverride === 'function') {
    console.log('✓ submitOverride function exists');
  } else {
    console.log('✗ submitOverride function missing');
  }

  // Test 4: Check if closeOverrideModal function exists
  if (typeof closeOverrideModal === 'function') {
    console.log('✓ closeOverrideModal function exists');
  } else {
    console.log('✗ closeOverrideModal function missing');
  }

  // Test 5: Check if updateResultsTable function exists
  if (typeof updateResultsTable === 'function') {
    console.log('✓ updateResultsTable function exists');
  } else {
    console.log('✗ updateResultsTable function missing');
  }

  // Test 6: Validate override modal HTML exists
  const modal = document.getElementById('override-modal');
  if (modal) {
    console.log('✓ Override modal HTML exists');

    // Check required fields
    const officerName = document.getElementById('officer-name');
    const decision = document.getElementById('override-decision');
    const reason = document.getElementById('override-reason');

    if (officerName) console.log('✓ Officer name field exists');
    else console.log('✗ Officer name field missing');

    if (decision) console.log('✓ Decision field exists');
    else console.log('✗ Decision field missing');

    if (reason) console.log('✓ Reason field exists');
    else console.log('✗ Reason field missing');

  } else {
    console.log('✗ Override modal HTML missing');
  }

  // Test 7: Check for Actions column in results table
  const table = document.querySelector('#results-table');
  if (table) {
    const headers = table.querySelectorAll('th');
    let hasActions = false;
    headers.forEach(header => {
      if (header.textContent.includes('Actions')) {
        hasActions = true;
      }
    });
    if (hasActions) {
      console.log('✓ Actions column exists in results table');
    } else {
      console.log('✗ Actions column missing from results table');
    }
  } else {
    console.log('✗ Results table not found');
  }

  console.log('=== Phase 3 Validation Complete ===');
  console.log('Open browser to http://localhost:8000/pages/evaluate.html to test manually');
});