/* ============================================================
   PHASE 2 INTEGRATION TEST
   Test travel preferences display with sample data
   ============================================================ */

import { formatTravelDistance, formatWorkAreas, getCountyShortName, TRAVEL_DISTANCES, KENTUCKY_COUNTIES } from './src/constants/locations.js'

console.log('\n🧪 PHASE 2 INTEGRATION TEST\n')
console.log('='.repeat(60))

let testsPassed = 0
let testsFailed = 0

function test(name, condition, actual, expected) {
  if (condition) {
    console.log(`✓ ${name}`)
    testsPassed++
  } else {
    console.log(`✗ ${name}`)
    console.log(`  Expected: ${expected}`)
    console.log(`  Actual:   ${actual}`)
    testsFailed++
  }
}

// Test 1: formatTravelDistance with all valid values
console.log('\n1. Testing formatTravelDistance()...')
test(
  'Format "up-to-10"',
  formatTravelDistance('up-to-10') === 'Up to 10 miles',
  formatTravelDistance('up-to-10'),
  'Up to 10 miles'
)
test(
  'Format "up-to-20" (default)',
  formatTravelDistance('up-to-20') === 'Up to 20 miles',
  formatTravelDistance('up-to-20'),
  'Up to 20 miles'
)
test(
  'Format "up-to-30"',
  formatTravelDistance('up-to-30') === 'Up to 30 miles',
  formatTravelDistance('up-to-30'),
  'Up to 30 miles'
)
test(
  'Format "up-to-50"',
  formatTravelDistance('up-to-50') === 'Up to 50 miles',
  formatTravelDistance('up-to-50'),
  'Up to 50 miles'
)
test(
  'Format "more-than-50"',
  formatTravelDistance('more-than-50') === 'More than 50 miles',
  formatTravelDistance('more-than-50'),
  'More than 50 miles'
)
test(
  'Handle invalid value',
  formatTravelDistance('invalid') === 'Not specified',
  formatTravelDistance('invalid'),
  'Not specified'
)
test(
  'Handle null value',
  formatTravelDistance(null) === 'Not specified',
  formatTravelDistance(null),
  'Not specified'
)
test(
  'Handle undefined value',
  formatTravelDistance(undefined) === 'Not specified',
  formatTravelDistance(undefined),
  'Not specified'
)

// Test 2: formatWorkAreas with various inputs
console.log('\n2. Testing formatWorkAreas()...')
test(
  'Format single county',
  formatWorkAreas(['Jefferson County']) === 'Jefferson County',
  formatWorkAreas(['Jefferson County']),
  'Jefferson County'
)
test(
  'Format multiple counties',
  formatWorkAreas(['Jefferson County', 'Fayette County', 'Boone County']) === 'Jefferson County, Fayette County, Boone County',
  formatWorkAreas(['Jefferson County', 'Fayette County', 'Boone County']),
  'Jefferson County, Fayette County, Boone County'
)
test(
  'Handle empty array',
  formatWorkAreas([]) === 'Not specified',
  formatWorkAreas([]),
  'Not specified'
)
test(
  'Handle null value',
  formatWorkAreas(null) === 'Not specified',
  formatWorkAreas(null),
  'Not specified'
)
test(
  'Handle undefined value',
  formatWorkAreas(undefined) === 'Not specified',
  formatWorkAreas(undefined),
  'Not specified'
)

// Test 3: getCountyShortName
console.log('\n3. Testing getCountyShortName()...')
test(
  'Remove "County" from name',
  getCountyShortName('Jefferson County') === 'Jefferson',
  getCountyShortName('Jefferson County'),
  'Jefferson'
)
test(
  'Handle name without "County"',
  getCountyShortName('Jefferson') === 'Jefferson',
  getCountyShortName('Jefferson'),
  'Jefferson'
)
test(
  'Handle empty string',
  getCountyShortName('') === '',
  getCountyShortName(''),
  ''
)

// Test 4: Card display simulation (compact format)
console.log('\n4. Testing card display format (Browse page)...')
const sampleCaregiver1 = {
  travelDistance: 'up-to-20',
  workAreas: ['Jefferson County', 'Fayette County', 'Boone County', 'Warren County', 'Hardin County']
}

const cardDisplay1 = {
  travel: formatTravelDistance(sampleCaregiver1.travelDistance),
  areas: sampleCaregiver1.workAreas.slice(0, 2).map(getCountyShortName).join(', ') +
         (sampleCaregiver1.workAreas.length > 2 ? ` +${sampleCaregiver1.workAreas.length - 2}` : '')
}

test(
  'Card shows travel distance',
  cardDisplay1.travel === 'Up to 20 miles',
  cardDisplay1.travel,
  'Up to 20 miles'
)
test(
  'Card shows 2 counties + count',
  cardDisplay1.areas === 'Jefferson, Fayette +3',
  cardDisplay1.areas,
  'Jefferson, Fayette +3'
)

// Test 5: Full profile display simulation
console.log('\n5. Testing full profile display...')
const sampleProfile = {
  travelDistance: 'up-to-30',
  workAreas: ['Jefferson County', 'Fayette County', 'Boone County']
}

const profileDisplay = {
  travelDistance: formatTravelDistance(sampleProfile.travelDistance),
  workAreas: formatWorkAreas(sampleProfile.workAreas)
}

test(
  'Profile shows travel distance',
  profileDisplay.travelDistance === 'Up to 30 miles',
  profileDisplay.travelDistance,
  'Up to 30 miles'
)
test(
  'Profile shows all work areas',
  profileDisplay.workAreas === 'Jefferson County, Fayette County, Boone County',
  profileDisplay.workAreas,
  'Jefferson County, Fayette County, Boone County'
)

// Test 6: Edge cases
console.log('\n6. Testing edge cases...')

// Caregiver with no travel preferences
const emptyCaregiver = {
  travelDistance: null,
  workAreas: []
}
test(
  'Empty caregiver: travel distance returns "Not specified"',
  formatTravelDistance(emptyCaregiver.travelDistance) === 'Not specified',
  formatTravelDistance(emptyCaregiver.travelDistance),
  'Not specified'
)
test(
  'Empty caregiver: work areas returns "Not specified"',
  formatWorkAreas(emptyCaregiver.workAreas) === 'Not specified',
  formatWorkAreas(emptyCaregiver.workAreas),
  'Not specified'
)

// Caregiver with maximum counties (25)
const maxCounties = KENTUCKY_COUNTIES.slice(0, 25)
const maxCountiesDisplay = formatWorkAreas(maxCounties)
test(
  'Max counties (25) formats without error',
  maxCountiesDisplay.split(', ').length === 25,
  maxCountiesDisplay.split(', ').length,
  25
)

// Caregiver with only travel distance
const onlyTravel = {
  travelDistance: 'more-than-50',
  workAreas: null
}
test(
  'Only travel distance (no work areas)',
  formatTravelDistance(onlyTravel.travelDistance) === 'More than 50 miles' &&
  formatWorkAreas(onlyTravel.workAreas) === 'Not specified',
  `${formatTravelDistance(onlyTravel.travelDistance)} / ${formatWorkAreas(onlyTravel.workAreas)}`,
  'More than 50 miles / Not specified'
)

// Caregiver with only work areas
const onlyAreas = {
  travelDistance: null,
  workAreas: ['Boone County', 'Kenton County']
}
test(
  'Only work areas (no travel distance)',
  formatTravelDistance(onlyAreas.travelDistance) === 'Not specified' &&
  formatWorkAreas(onlyAreas.workAreas) === 'Boone County, Kenton County',
  `${formatTravelDistance(onlyAreas.travelDistance)} / ${formatWorkAreas(onlyAreas.workAreas)}`,
  'Not specified / Boone County, Kenton County'
)

// Test 7: Constants validation
console.log('\n7. Testing constants data...')
test(
  'TRAVEL_DISTANCES has 5 options',
  TRAVEL_DISTANCES.length === 5,
  TRAVEL_DISTANCES.length,
  5
)
test(
  'KENTUCKY_COUNTIES has 121 counties',
  KENTUCKY_COUNTIES.length === 121,
  KENTUCKY_COUNTIES.length,
  121
)
test(
  'All travel distances have value and label',
  TRAVEL_DISTANCES.every(d => d.value && d.label),
  TRAVEL_DISTANCES.filter(d => !d.value || !d.label).length,
  0
)
test(
  'All counties end with "County" or are "Other"',
  KENTUCKY_COUNTIES.every(c => c.endsWith('County') || c.startsWith('Other')),
  KENTUCKY_COUNTIES.filter(c => !c.endsWith('County') && !c.startsWith('Other')).length,
  0
)

// Test 8: Real-world scenario simulation
console.log('\n8. Testing real-world scenario...')
const realisticCaregivers = [
  {
    name: 'Sarah Johnson',
    travelDistance: 'up-to-20',
    workAreas: ['Jefferson County', 'Oldham County', 'Shelby County']
  },
  {
    name: 'Michael Chen',
    travelDistance: 'up-to-50',
    workAreas: ['Fayette County', 'Jessamine County', 'Woodford County', 'Scott County', 'Bourbon County']
  },
  {
    name: 'Lisa Rodriguez',
    travelDistance: 'up-to-10',
    workAreas: ['Boone County']
  },
  {
    name: 'David Kim',
    travelDistance: null,
    workAreas: null
  }
]

let scenarioTests = 0
realisticCaregivers.forEach(cg => {
  const travel = formatTravelDistance(cg.travelDistance)
  const areas = formatWorkAreas(cg.workAreas)
  
  if (travel !== undefined && areas !== undefined) {
    scenarioTests++
  }
})

test(
  'All realistic caregivers process without errors',
  scenarioTests === 4,
  scenarioTests,
  4
)

// Summary
console.log('\n' + '='.repeat(60))
console.log('\n📊 TEST SUMMARY\n')
console.log(`✓ Passed: ${testsPassed}`)
console.log(`✗ Failed: ${testsFailed}`)

if (testsFailed === 0) {
  console.log('\n✅ ALL INTEGRATION TESTS PASSED!')
  console.log('\n📋 Test Coverage:')
  console.log('  ✓ formatTravelDistance() - 8 tests')
  console.log('  ✓ formatWorkAreas() - 5 tests')
  console.log('  ✓ getCountyShortName() - 3 tests')
  console.log('  ✓ Card display format - 2 tests')
  console.log('  ✓ Profile display format - 2 tests')
  console.log('  ✓ Edge cases - 4 tests')
  console.log('  ✓ Constants validation - 4 tests')
  console.log('  ✓ Real-world scenarios - 1 test')
  console.log('\n✨ Integration test complete. Ready for commit!')
  process.exit(0)
} else {
  console.log('\n❌ INTEGRATION TESTS FAILED')
  console.log('Fix issues before committing.')
  process.exit(1)
}
