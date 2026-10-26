/* ============================================================
   PHASE 3 IMPLEMENTATION VERIFICATION
   Verify travel preferences edit form integration
   ============================================================ */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const results = {
  passed: [],
  failed: [],
  warnings: []
}

function pass(test) {
  results.passed.push(test)
  console.log('✓', test)
}

function fail(test, reason) {
  results.failed.push({ test, reason })
  console.log('✗', test, '-', reason)
}

function warn(message) {
  results.warnings.push(message)
  console.log('⚠', message)
}

console.log('\n🔍 PHASE 3 IMPLEMENTATION VERIFICATION\n')
console.log('=' .repeat(60))

// Test 1: Verify imports in CaregiverProfileEdit.jsx
console.log('\n1. Checking CaregiverProfileEdit.jsx imports...')
try {
  const editFilePath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfileEdit.jsx')
  const editContent = fs.readFileSync(editFilePath, 'utf-8')
  
  if (editContent.includes("import { TRAVEL_DISTANCES, KENTUCKY_COUNTIES } from '../../constants/locations'")) {
    pass('Edit form imports TRAVEL_DISTANCES and KENTUCKY_COUNTIES')
  } else {
    fail('Edit form imports', 'missing constants import')
  }
  
  if (editContent.includes('travelDistance:') && editContent.includes('workAreas:')) {
    pass('State initialization includes travelDistance and workAreas')
  } else {
    fail('State initialization', 'missing travel preferences fields')
  }
} catch (err) {
  fail('CaregiverProfileEdit.jsx', err.message)
}

// Test 2: Verify travel distance dropdown
console.log('\n2. Checking travel distance dropdown...')
try {
  const editFilePath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfileEdit.jsx')
  const editContent = fs.readFileSync(editFilePath, 'utf-8')
  
  if (editContent.includes('Travel Distance')) {
    pass('Travel distance label found')
  } else {
    fail('Travel distance label', 'not found in form')
  }
  
  if (editContent.includes('<select') && editContent.includes('travelDistance')) {
    pass('Travel distance dropdown element found')
  } else {
    fail('Travel distance dropdown', 'select element not found')
  }
  
  if (editContent.includes('TRAVEL_DISTANCES.map')) {
    pass('Travel distance options mapped from constants')
  } else {
    fail('Travel distance mapping', 'not using TRAVEL_DISTANCES constant')
  }
  
  if (editContent.includes('How far are you willing to travel')) {
    pass('Travel distance hint text found')
  } else {
    warn('Travel distance hint text missing')
  }
} catch (err) {
  fail('Travel distance dropdown', err.message)
}

// Test 3: Verify work areas checkboxes
console.log('\n3. Checking work areas checkboxes...')
try {
  const editFilePath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfileEdit.jsx')
  const editContent = fs.readFileSync(editFilePath, 'utf-8')
  
  if (editContent.includes('Work Areas')) {
    pass('Work areas label found')
  } else {
    fail('Work areas label', 'not found in form')
  }
  
  if (editContent.includes('KENTUCKY_COUNTIES.map')) {
    pass('Work areas checkboxes mapped from constants')
  } else {
    fail('Work areas mapping', 'not using KENTUCKY_COUNTIES constant')
  }
  
  if (editContent.includes('maximum 25')) {
    pass('Max 25 counties limit mentioned in hint')
  } else {
    fail('Max limit hint', 'not mentioning 25 county limit')
  }
  
  if (editContent.includes('workAreas.length >= 25')) {
    pass('Max 25 validation logic found')
  } else {
    fail('Max 25 validation', 'validation logic not found')
  }
  
  if (editContent.includes('cp-field-warning')) {
    pass('Warning message component found')
  } else {
    fail('Warning message', 'not found in code')
  }
  
  if (editContent.includes('disabled={')) {
    pass('Checkbox disabled state logic found')
  } else {
    fail('Checkbox disabled state', 'not found')
  }
} catch (err) {
  fail('Work areas checkboxes', err.message)
}

// Test 4: Verify submit payload includes new fields
console.log('\n4. Checking submit payload...')
try {
  const editFilePath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfileEdit.jsx')
  const editContent = fs.readFileSync(editFilePath, 'utf-8')
  
  // Find updateMe call
  const updateMeIndex = editContent.indexOf('caregiverApi.updateMe')
  if (updateMeIndex === -1) {
    fail('Submit payload', 'updateMe call not found')
  } else {
    // Check within the updateMe object
    const updateMeSection = editContent.substring(updateMeIndex, updateMeIndex + 1000)
    
    if (updateMeSection.includes('travelDistance:')) {
      pass('Submit payload includes travelDistance')
    } else {
      fail('Submit payload', 'missing travelDistance field')
    }
    
    if (updateMeSection.includes('workAreas:')) {
      pass('Submit payload includes workAreas')
    } else {
      fail('Submit payload', 'missing workAreas field')
    }
  }
} catch (err) {
  fail('Submit payload', err.message)
}

// Test 5: Verify CSS styles added
console.log('\n5. Checking CaregiverProfile.css styles...')
try {
  const cssPath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfile.css')
  const cssContent = fs.readFileSync(cssPath, 'utf-8')
  
  if (cssContent.includes('.cp-field-hint')) {
    pass('Field hint styles found')
  } else {
    fail('Field hint styles', 'not found in CSS')
  }
  
  if (cssContent.includes('.cp-field-warning')) {
    pass('Field warning styles found')
  } else {
    fail('Field warning styles', 'not found in CSS')
  }
  
  if (cssContent.includes('.cp-work-areas-grid')) {
    pass('Work areas grid styles found')
  } else {
    fail('Work areas grid styles', 'not found in CSS')
  }
  
  if (cssContent.includes('max-height:') && cssContent.includes('overflow-y:')) {
    pass('Scrollable grid styles found')
  } else {
    fail('Scrollable grid', 'overflow styles not found')
  }
  
  if (cssContent.includes('@media (max-width: 600px)') && cssContent.includes('cp-work-areas-grid')) {
    pass('Mobile responsive styles for grid found')
  } else {
    warn('Mobile responsive styles for work areas grid not found')
  }
  
  if (cssContent.includes('input[type="checkbox"]:disabled')) {
    pass('Disabled checkbox styles found')
  } else {
    fail('Disabled checkbox styles', 'not found in CSS')
  }
  
  if (cssContent.includes('select.cp-input') || cssContent.includes('appearance: none')) {
    pass('Select dropdown styles found')
  } else {
    warn('Custom select dropdown styles not found')
  }
} catch (err) {
  fail('CaregiverProfile.css', err.message)
}

// Test 6: Check for potential issues
console.log('\n6. Checking for potential issues...')
try {
  const editFilePath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfileEdit.jsx')
  const editContent = fs.readFileSync(editFilePath, 'utf-8')
  
  // Check for null safety
  if (editContent.includes('profile.workAreas &&') || editContent.includes('workAreas || []')) {
    pass('Null safety checks found for workAreas')
  } else {
    fail('Null safety', 'missing null checks for workAreas array')
  }
  
  // Check for default value in dropdown
  if (editContent.includes("|| 'up-to-20'")) {
    pass('Default value fallback for dropdown found')
  } else {
    warn('No fallback default for travelDistance dropdown')
  }
  
  // Check that form follows existing patterns
  if (editContent.includes('cp-field') && editContent.includes('cp-label') && editContent.includes('cp-chips')) {
    pass('Form follows existing CSS class patterns')
  } else {
    fail('CSS patterns', 'not following existing form structure')
  }
} catch (err) {
  fail('Potential issues check', err.message)
}

// Test 7: Verify Phase 1 and Phase 2 files still intact
console.log('\n7. Checking Phase 1 & 2 files...')
try {
  const constantsPath = path.join(__dirname, 'src/constants/locations.js')
  const profilePath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfile.jsx')
  const browsePath = path.join(__dirname, 'src/pages/onboarding/CaregiverBrowse.jsx')
  
  if (fs.existsSync(constantsPath)) {
    pass('Phase 1 locations.js still exists')
  } else {
    fail('Phase 1 file', 'locations.js missing')
  }
  
  if (fs.existsSync(profilePath)) {
    const profileContent = fs.readFileSync(profilePath, 'utf-8')
    if (profileContent.includes('Service Area & Travel')) {
      pass('Phase 2 profile display still intact')
    } else {
      fail('Phase 2 profile', 'display section missing')
    }
  } else {
    fail('Phase 2 file', 'CaregiverProfile.jsx missing')
  }
  
  if (fs.existsSync(browsePath)) {
    const browseContent = fs.readFileSync(browsePath, 'utf-8')
    if (browseContent.includes('cbr-card__travel')) {
      pass('Phase 2 browse cards still intact')
    } else {
      fail('Phase 2 browse', 'card display missing')
    }
  } else {
    fail('Phase 2 file', 'CaregiverBrowse.jsx missing')
  }
} catch (err) {
  fail('Phase 1 & 2 integrity check', err.message)
}

// Summary
console.log('\n' + '='.repeat(60))
console.log('\n📊 VERIFICATION SUMMARY\n')
console.log(`✓ Passed: ${results.passed.length}`)
console.log(`✗ Failed: ${results.failed.length}`)
console.log(`⚠ Warnings: ${results.warnings.length}`)

if (results.failed.length > 0) {
  console.log('\n❌ FAILED TESTS:')
  results.failed.forEach(({ test, reason }) => {
    console.log(`  - ${test}: ${reason}`)
  })
}

if (results.warnings.length > 0) {
  console.log('\n⚠ WARNINGS:')
  results.warnings.forEach(warning => {
    console.log(`  - ${warning}`)
  })
}

console.log('\n' + '='.repeat(60))

if (results.failed.length === 0) {
  console.log('\n✅ ALL TESTS PASSED! Phase 3 implementation is complete.')
  console.log('\n📋 Implementation checklist:')
  console.log('  ✓ Travel distance dropdown added to edit form')
  console.log('  ✓ Work areas checkboxes (121 counties) added')
  console.log('  ✓ Max 25 counties validation implemented')
  console.log('  ✓ Warning message displays at limit')
  console.log('  ✓ Submit payload includes new fields')
  console.log('  ✓ CSS styles added (hint, warning, grid, mobile)')
  console.log('  ✓ Phase 1 & 2 files intact')
  console.log('\n✨ Ready for testing and commit!')
  process.exit(0)
} else {
  console.log('\n❌ VERIFICATION FAILED - Fix issues before deployment')
  process.exit(1)
}
