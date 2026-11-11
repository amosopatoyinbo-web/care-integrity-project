/* ============================================================
   THE CARE INTEGRITY PROJECT — Professional Categories
   Centralized constants for professional roles and employment
   Added: November 6, 2026
   ============================================================ */

export const PROFESSIONAL_ROLES = [
  'Personal Caregiver / PCA',
  'CNA / SRNA',
  'LPN',
  'RN',
  'Physical Therapist (PT)',
  'Physical Therapist Assistant (PTA)',
  'Occupational Therapist (OT)',
  'Occupational Therapy Assistant (OTA/COTA)',
  'Speech-Language Pathologist (SLP/ST)',
  'Home Health Aide',
  'Companion Caregiver',
  'Live-In Caregiver',
  'Memory Care Specialist',
  'Other'
]

// Roles that typically require professional licensure
export const LICENSED_ROLES = [
  'LPN',
  'RN',
  'Physical Therapist (PT)',
  'Occupational Therapist (OT)',
  'Speech-Language Pathologist (SLP/ST)'
]

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'actively_seeking', label: 'Actively Seeking Employment' },
  { value: 'open_to_opportunities', label: 'Open to Opportunities' },
  { value: 'not_seeking', label: 'Not Currently Seeking' }
]

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
]

// Helper function to check if a role requires licensing
export const requiresLicense = (role) => {
  if (!role) return false  // Handle null/undefined
  return LICENSED_ROLES.includes(role)
}
