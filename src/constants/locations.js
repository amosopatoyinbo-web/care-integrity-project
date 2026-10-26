/* ============================================================
   LOCATION CONSTANTS
   Kentucky counties and travel distance options
   Added: Oct 26, 2026 - Travel Preferences Feature
   ============================================================ */

export const TRAVEL_DISTANCES = [
  { value: 'up-to-10', label: 'Up to 10 miles' },
  { value: 'up-to-20', label: 'Up to 20 miles' },
  { value: 'up-to-30', label: 'Up to 30 miles' },
  { value: 'up-to-50', label: 'Up to 50 miles' },
  { value: 'more-than-50', label: 'More than 50 miles' },
]

export const KENTUCKY_COUNTIES = [
  'Adair County',
  'Allen County',
  'Anderson County',
  'Ballard County',
  'Barren County',
  'Bath County',
  'Bell County',
  'Boone County',
  'Bourbon County',
  'Boyd County',
  'Boyle County',
  'Bracken County',
  'Breathitt County',
  'Breckinridge County',
  'Bullitt County',
  'Butler County',
  'Caldwell County',
  'Calloway County',
  'Campbell County',
  'Carlisle County',
  'Carroll County',
  'Carter County',
  'Casey County',
  'Christian County',
  'Clark County',
  'Clay County',
  'Clinton County',
  'Crittenden County',
  'Cumberland County',
  'Daviess County',
  'Edmonson County',
  'Elliott County',
  'Estill County',
  'Fayette County',
  'Fleming County',
  'Floyd County',
  'Franklin County',
  'Fulton County',
  'Gallatin County',
  'Garrard County',
  'Grant County',
  'Graves County',
  'Grayson County',
  'Green County',
  'Greenup County',
  'Hancock County',
  'Hardin County',
  'Harlan County',
  'Harrison County',
  'Hart County',
  'Henderson County',
  'Henry County',
  'Hickman County',
  'Hopkins County',
  'Jackson County',
  'Jefferson County',
  'Jessamine County',
  'Johnson County',
  'Kenton County',
  'Knott County',
  'Knox County',
  'Larue County',
  'Laurel County',
  'Lawrence County',
  'Lee County',
  'Leslie County',
  'Letcher County',
  'Lewis County',
  'Lincoln County',
  'Livingston County',
  'Logan County',
  'Lyon County',
  'Madison County',
  'Magoffin County',
  'Marion County',
  'Marshall County',
  'Martin County',
  'Mason County',
  'McCracken County',
  'McCreary County',
  'McLean County',
  'Meade County',
  'Menifee County',
  'Mercer County',
  'Metcalfe County',
  'Monroe County',
  'Montgomery County',
  'Morgan County',
  'Muhlenberg County',
  'Nelson County',
  'Nicholas County',
  'Ohio County',
  'Oldham County',
  'Owen County',
  'Owsley County',
  'Pendleton County',
  'Perry County',
  'Pike County',
  'Powell County',
  'Pulaski County',
  'Robertson County',
  'Rockcastle County',
  'Rowan County',
  'Russell County',
  'Scott County',
  'Shelby County',
  'Simpson County',
  'Spencer County',
  'Taylor County',
  'Todd County',
  'Trigg County',
  'Trimble County',
  'Union County',
  'Warren County',
  'Washington County',
  'Wayne County',
  'Webster County',
  'Whitley County',
  'Wolfe County',
  'Woodford County',
  'Other (specify in notes)'
]

/**
 * Format travel distance value for display
 * @param {string} value - The travel distance enum value
 * @returns {string} - Formatted display string
 */
export function formatTravelDistance(value) {
  if (!value || value === null || value === undefined) return 'Not specified'
  const option = TRAVEL_DISTANCES.find(d => d.value === value)
  return option ? option.label : 'Not specified'
}

/**
 * Get short form of county name (without "County" suffix)
 * Used for compact displays like browse cards
 * @param {string} county - Full county name (e.g., "Scott County")
 * @returns {string} - Short form (e.g., "Scott")
 */
export function getCountyShortName(county) {
  if (!county) return ''
  return county.replace(' County', '')
}

/**
 * Format array of counties for display (full profile view)
 * Returns full county names, comma-separated
 * @param {string[]} counties - Array of county names
 * @returns {string} - Formatted string (e.g., "Scott County, Fayette County, Boone County")
 */
export function formatWorkAreas(counties) {
  if (!counties || counties.length === 0) return 'Not specified'
  return counties.join(', ')
}
