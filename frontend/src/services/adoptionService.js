import axios from 'axios';

const DATA_SOURCE = (import.meta.env.VITE_PET_DATA_SOURCE || 'mock').toLowerCase();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ── Mock data ── */

const mockUserAdoptions = [
  {
    id: 1,
    pet_id: 1,
    pet_name: 'Μπάντι',
    pet_photo: null,
    shelter_name: 'Καταφύγιο Αθήνας',
    status: 'pending',
    created_at: '2026-05-10T09:00:00Z',
  },
  {
    id: 2,
    pet_id: 4,
    pet_name: 'Λούνα',
    pet_photo: null,
    shelter_name: 'SOS Animals Θεσσαλονίκη',
    status: 'approved',
    created_at: '2026-05-02T14:30:00Z',
  },
  {
    id: 3,
    pet_id: 7,
    pet_name: 'Σνόουμπολ',
    pet_photo: null,
    shelter_name: 'Φιλοζωική Πάτρας',
    status: 'rejected',
    created_at: '2026-04-28T11:15:00Z',
  },
];

const mockShelterRequests = [
  {
    id: 10,
    pet_id: 2,
    pet_name: 'Ρεξ',
    applicant_name: 'Γιώργος Παπαδόπουλος',
    applicant_email: 'giorgos@example.com',
    message: 'Έχω σπίτι με κήπο και δύο παιδιά που λατρεύουν τα ζώα.',
    status: 'pending',
    created_at: '2026-05-12T08:00:00Z',
  },
  {
    id: 11,
    pet_id: 2,
    pet_name: 'Ρεξ',
    applicant_name: 'Μαρία Ιωάννου',
    applicant_email: 'maria@example.com',
    message: 'Ψάχνω σύντροφο για βόλτες. Μένω κοντά σε πάρκο.',
    status: 'pending',
    created_at: '2026-05-13T10:20:00Z',
  },
  {
    id: 12,
    pet_id: 5,
    pet_name: 'Μίλο',
    applicant_name: 'Νίκος Αλεξίου',
    applicant_email: 'nikos@example.com',
    message: 'Έχω εμπειρία με γάτες και ζω σε διαμέρισμα.',
    status: 'pending',
    created_at: '2026-05-14T16:45:00Z',
  },
];

/* ── API calls ── */

export async function submitAdoption(petId, message) {
  if (DATA_SOURCE === 'mock') {
    return {
      id: Date.now(),
      pet_id: petId,
      status: 'pending',
      message,
      created_at: new Date().toISOString(),
    };
  }

  const { data } = await axios.post(
    `${API_BASE_URL}/api/adoptions`,
    { pet_id: petId, message },
    { headers: authHeaders() },
  );
  return data;
}

export async function getUserAdoptions() {
  if (DATA_SOURCE === 'mock') {
    return mockUserAdoptions;
  }

  const { data } = await axios.get(`${API_BASE_URL}/api/adoptions/user`, {
    headers: authHeaders(),
  });
  return data;
}

export async function getShelterRequests() {
  if (DATA_SOURCE === 'mock') {
    return mockShelterRequests;
  }

  const { data } = await axios.get(`${API_BASE_URL}/api/adoptions/shelter`, {
    headers: authHeaders(),
  });
  return data;
}

export async function updateRequestStatus(requestId, status) {
  if (DATA_SOURCE === 'mock') {
    return { id: requestId, status, updated_at: new Date().toISOString() };
  }

  const { data } = await axios.put(
    `${API_BASE_URL}/api/adoptions/${requestId}`,
    { status },
    { headers: authHeaders() },
  );
  return data;
}
