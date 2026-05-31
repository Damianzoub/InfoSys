import axios from 'axios'

const DATA_SOURCE = (import.meta.env.VITE_PET_DATA_SOURCE || 'mock').toLowerCase()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/* ── Mock data ── */

const mockStats = {
  users: 42,
  shelters: 5,
  pets: 130,
  adoptions: {
    total: 88,
    pending: 14,
    approved: 60,
    rejected: 14,
  },
}

const mockReport = {
  generated_at: new Date().toISOString(),
  shelters: [
    { id: 1, name: 'Καταφύγιο Αθήνας', city: 'Αθήνα', total_pets: 40, total_adoptions: 22 },
    {
      id: 2,
      name: 'SOS Animals Θεσσαλονίκη',
      city: 'Θεσσαλονίκη',
      total_pets: 35,
      total_adoptions: 18,
    },
    { id: 3, name: 'Φιλοζωική Πάτρας', city: 'Πάτρα', total_pets: 25, total_adoptions: 12 },
    { id: 4, name: 'Stray Care Ηράκλειο', city: 'Ηράκλειο', total_pets: 18, total_adoptions: 5 },
    { id: 5, name: 'Καταφύγιο Λάρισας', city: 'Λάρισα', total_pets: 12, total_adoptions: 3 },
  ],
  recent_adoptions: [
    {
      id: 1,
      pet_name: 'Μπάντι',
      shelter_name: 'Καταφύγιο Αθήνας',
      applicant_name: 'Γιώργος Παπαδόπουλος',
      status: 'approved',
      created_at: '2026-05-15T09:00:00Z',
    },
    {
      id: 2,
      pet_name: 'Λούνα',
      shelter_name: 'SOS Animals Θεσσαλονίκη',
      applicant_name: 'Μαρία Ιωάννου',
      status: 'pending',
      created_at: '2026-05-14T14:30:00Z',
    },
    {
      id: 3,
      pet_name: 'Ρεξ',
      shelter_name: 'Καταφύγιο Αθήνας',
      applicant_name: 'Νίκος Αλεξίου',
      status: 'rejected',
      created_at: '2026-05-13T11:15:00Z',
    },
    {
      id: 4,
      pet_name: 'Μίλο',
      shelter_name: 'Φιλοζωική Πάτρας',
      applicant_name: 'Ελένη Δημητρίου',
      status: 'approved',
      created_at: '2026-05-12T16:45:00Z',
    },
    {
      id: 5,
      pet_name: 'Σνόουμπολ',
      shelter_name: 'Stray Care Ηράκλειο',
      applicant_name: 'Αλέξανδρος Κ.',
      status: 'pending',
      created_at: '2026-05-11T08:20:00Z',
    },
  ],
}

/* ── API calls ── */

export async function getStats() {
  if (DATA_SOURCE === 'mock') {
    return mockStats
  }

  const { data } = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
    headers: authHeaders(),
  })
  return data
}

export async function getReport() {
  if (DATA_SOURCE === 'mock') {
    return mockReport
  }

  const { data } = await axios.get(`${API_BASE_URL}/api/admin/report`, {
    headers: authHeaders(),
  })
  return data
}
