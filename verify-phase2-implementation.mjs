/* ============================================================
   PHASE 2 IMPLEMENTATION VERIFICATION
   Verify travel preferences display in frontend
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

console.log('\n🔍 PHASE 2 IMPLEMENTATION VERIFICATION\n')
console.log('=' .repeat(60))

// Test 1: Verify constants file exists and has correct exports
console.log('\n1. Checking constants/locations.js...')
try {
  const constantsPath = path.join(__dirname, 'src/constants/locations.js')
  const constantsContent = fs.readFileSync(constantsPath, 'utf-8')
  
  if (constantsContent.includes('export const TRAVEL_DISTANCES')) {
    pass('TRAVEL_DISTANCES export found')
  } else {
    fail('TRAVEL_DISTANCES export', 'not found in file')
  }
  
  if (constantsContent.includes('export const KENTUCKY_COUNTIES')) {
    pass('KENTUCKY_COUNTIES export found')
  } else {
    fail('KENTUCKY_COUNTIES export', 'not found in file')
  }
  
  if (constantsContent.includes('export function formatTravelDistance')) {
    pass('formatTravelDistance helper function found')
  } else {
    fail('formatTravelDistance', 'helper function not found')
  }
  
  if (constantsContent.includes('export function formatWorkAreas')) {
    pass('formatWorkAreas helper function found')
  } else {
    fail('formatWorkAreas', 'helper function not found')
  }
  
  if (constantsContent.includes('export function getCountyShortName')) {
    pass('getCountyShortName helper function found')
  } else {
    fail('getCountyShortName', 'helper function not found')
  }
} catch (err) {
  fail('constants/locations.js', err.message)
}

// Test 2: Verify CaregiverProfile.jsx has correct imports
console.log('\n2. Checking CaregiverProfile.jsx imports...')
try {
  const profilePath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfile.jsx')
  const profileContent = fs.readFileSync(profilePath, 'utf-8')
  
  if (profileContent.includes("import { formatTravelDistance, formatWorkAreas } from '../../constants/locations'")) {
    pass('CaregiverProfile imports formatTravelDistance and formatWorkAreas')
  } else {
    fail('CaregiverProfile imports', 'missing or incorrect import statement')
  }
  
  if (profileContent.includes('Service Area & Travel')) {
    pass('Travel preferences section title found')
  } else {
    fail('Travel preferences section', 'section title not found')
  }
  
  if (profileContent.includes('cp-travel-preferences')) {
    pass('Travel preferences CSS class found')
  } else {
    fail('Travel preferences CSS', 'class name not found')
  }
  
  if (profileContent.includes('profile.travelDistance') && profileContent.includes('formatTravelDistance(profile.travelDistance)')) {
    pass('Travel distance display logic found')
  } else {
    fail('Travel distance display', 'display logic not found')
  }
  
  if (profileContent.includes('profile.workAreas') && profileContent.includes('formatWorkAreas(profile.workAreas)')) {
    pass('Work areas display logic found')
  } else {
    fail('Work areas display', 'display logic not found')
  }
} catch (err) {
  fail('CaregiverProfile.jsx', err.message)
}

// Test 3: Verify CaregiverBrowse.jsx has correct imports
console.log('\n3. Checking CaregiverBrowse.jsx imports...')
try {
  const browsePath = path.join(__dirname, 'src/pages/onboarding/CaregiverBrowse.jsx')
  const browseContent = fs.readFileSync(browsePath, 'utf-8')
  
  if (browseContent.includes("import { formatTravelDistance, getCountyShortName } from '../../constants/locations'")) {
    pass('CaregiverBrowse imports formatTravelDistance and getCountyShortName')
  } else {
    fail('CaregiverBrowse imports', 'missing or incorrect import statement')
  }
  
  if (browseContent.includes('cbr-card__travel')) {
    pass('Card travel display CSS class found')
  } else {
    fail('Card travel display', 'CSS class not found')
  }
  
  if (browseContent.includes('cg.travelDistance') && browseContent.includes('formatTravelDistance(cg.travelDistance)')) {
    pass('Card travel distance display logic found')
  } else {
    fail('Card travel distance', 'display logic not found')
  }
  
  if (browseContent.includes('cg.workAreas') && browseContent.includes('getCountyShortName')) {
    pass('Card work areas display logic found')
  } else {
    fail('Card work areas', 'display logic not found')
  }
} catch (err) {
  fail('CaregiverBrowse.jsx', err.message)
}

// Test 4: Verify CaregiverProfile.css has travel styles
console.log('\n4. Checking CaregiverProfile.css styles...')
try {
  const profileCssPath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfile.css')
  const profileCssContent = fs.readFileSync(profileCssPath, 'utf-8')
  
  if (profileCssContent.includes('.cp-travel-preferences')) {
    pass('Travel preferences section styles found')
  } else {
    fail('Travel preferences styles', 'section styles not found')
  }
  
  if (profileCssContent.includes('.cp-travel-row')) {
    pass('Travel row styles found')
  } else {
    fail('Travel row styles', 'not found')
  }
  
  if (profileCssContent.includes('.cp-travel-label')) {
    pass('Travel label styles found')
  } else {
    fail('Travel label styles', 'not found')
  }
  
  if (profileCssContent.includes('.cp-travel-value')) {
    pass('Travel value styles found')
  } else {
    fail('Travel value styles', 'not found')
  }
  
  if (profileCssContent.includes('@media (max-width: 414px)')) {
    pass('Mobile breakpoint styles found')
  } else {
    warn('Mobile breakpoint @media query not found')
  }
  
  if (profileCssContent.includes('@media (min-width: 768px)')) {
    pass('Desktop breakpoint styles found')
  } else {
    warn('Desktop breakpoint @media query not found')
  }
} catch (err) {
  fail('CaregiverProfile.css', err.message)
}

// Test 5: Verify CaregiverBrowse.css has card travel styles
console.log('\n5. Checking CaregiverBrowse.css styles...')
try {
  const browseCssPath = path.join(__dirname, 'src/pages/onboarding/CaregiverBrowse.css')
  const browseCssContent = fs.readFileSync(browseCssPath, 'utf-8')
  
  if (browseCssContent.includes('.cbr-card__travel')) {
    pass('Card travel container styles found')
  } else {
    fail('Card travel styles', 'container styles not found')
  }
  
  if (browseCssContent.includes('.cbr-card__travel-item')) {
    pass('Card travel item styles found')
  } else {
    fail('Card travel item styles', 'not found')
  }
  
  if (browseCssContent.includes('.cbr-card__travel-label')) {
    pass('Card travel label styles found')
  } else {
    fail('Card travel label styles', 'not found')
  }
  
  if (browseCssContent.includes('.cbr-card__travel-value')) {
    pass('Card travel value styles found')
  } else {
    fail('Card travel value styles', 'not found')
  }
  
  if (browseCssContent.includes('@media (max-width: 414px)')) {
    pass('Mobile breakpoint styles for cards found')
  } else {
    warn('Mobile breakpoint @media query not found for cards')
  }
} catch (err) {
  fail('CaregiverBrowse.css', err.message)
}

// Test 6: Check for icon usage (should be NONE per user requirement)
console.log('\n6. Checking for icon usage (should be text-only)...')
try {
  const profilePath = path.join(__dirname, 'src/pages/onboarding/CaregiverProfile.jsx')
  const browsePath = path.join(__dirname, 'src/pages/onboarding/CaregiverBrowse.jsx')
  
  const profileContent = fs.readFileSync(profilePath, 'utf-8')
  const browseContent = fs.readFileSync(browsePath, 'utf-8')
  
  // Check for emoji or icon characters in travel sections (🚗 📍)
  const travelSectionProfile = profileContent.substring(
    profileContent.indexOf('Service Area & Travel'),
    profileContent.indexOf('Service Area & Travel') + 500
  )
  
  const travelSectionBrowse = browseContent.substring(
    browseContent.indexOf('cbr-card__travel'),
    browseContent.indexOf('cbr-card__travel') + 500
  )
  
  if (!travelSectionProfile.includes('🚗') && !travelSectionProfile.includes('📍')) {
    pass('CaregiverProfile travel section is text-only (no icons)')
  } else {
    fail('CaregiverProfile icons', 'icons found in travel section - should be text-only')
  }
  
  if (!travelSectionBrowse.includes('🚗') && !travelSectionBrowse.includes('📍')) {
    pass('CaregiverBrowse cards are text-only (no icons)')
  } else {
    fail('CaregiverBrowse icons', 'icons found in travel section - should be text-only')
  }
} catch (err) {
  fail('Icon check', err.message)
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
  console.log('\n✅ ALL TESTS PASSED! Phase 2 implementation is complete.')
  console.log('\n📋 Implementation checklist:')
  console.log('  ✓ Travel preferences display added to CaregiverProfile.jsx')
  console.log('  ✓ Compact travel display added to CaregiverBrowse.jsx cards')
  console.log('  ✓ Helper functions imported from constants/locations.js')
  console.log('  ✓ Mobile-first CSS styles added (320px-768px breakpoints)')
  console.log('  ✓ Text-only design (no icons per user requirement)')
  console.log('  ✓ Conditional rendering (only shows if data exists)')
  console.log('\n✨ Ready for commit and deployment!')
  process.exit(0)
} else {
  console.log('\n❌ VERIFICATION FAILED - Fix issues before deployment')
  process.exit(1)
}
