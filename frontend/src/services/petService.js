import axios from 'axios';
import { mockPets, mockPetDetails } from '../data/mockPets';

const DATA_SOURCE = (import.meta.env.VITE_PET_DATA_SOURCE || 'mock').toLowerCase();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function filterMockPets(filters = {}) {
  return mockPets.filter((pet) => {
    if (filters.species && pet.species !== filters.species) return false;
    if (filters.gender && pet.gender !== filters.gender) return false;

    if (filters.location) {
      const petLocation = normalizeText(pet.location);
      const queryLocation = normalizeText(filters.location);
      if (!petLocation.includes(queryLocation)) return false;
    }

    if (filters.age && pet.age > parseFloat(filters.age)) return false;

    return true;
  });
}

export async function getPets(filters = {}) {
  if (DATA_SOURCE === 'api') {
    const { data } = await axios.get(`${API_BASE_URL}/api/pets`, {
      params: {
        species: filters.species || undefined,
        gender: filters.gender || undefined,
        age: filters.age || undefined,
        location: filters.location || undefined,
      },
      headers: authHeaders(),
    });
    return data;
  }

  return filterMockPets(filters);
}

export async function getPetById(id) {
  if (DATA_SOURCE === 'api') {
    const { data } = await axios.get(`${API_BASE_URL}/api/pets/${id}`, {
      headers: authHeaders(),
    });
    return data;
  }

  return mockPetDetails[Number(id)] || null;
}
