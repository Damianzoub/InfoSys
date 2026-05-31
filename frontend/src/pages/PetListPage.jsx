import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPets } from '../services/petService'
import './PetListPage.css'

const SPECIES_OPTIONS = [
  { value: '', label: 'Όλα τα είδη' },
  { value: 'dog', label: '🐶 Σκύλος' },
  { value: 'cat', label: '🐱 Γάτα' },
  { value: 'rabbit', label: '🐰 Κουνέλι' },
]

const GENDER_OPTIONS = [
  { value: '', label: 'Όλα' },
  { value: 'male', label: 'Αρσενικό' },
  { value: 'female', label: 'Θηλυκό' },
]

const GENDER_LABEL = { male: 'Αρσενικό', female: 'Θηλυκό', unknown: 'Άγνωστο' }
const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', rabbit: '🐰' }

export default function PetListPage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    species: '',
    gender: '',
    age: '',
    location: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  function handleReset() {
    setFilters({ species: '', gender: '', age: '', location: '' })
  }

  useEffect(() => {
    let isCancelled = false

    async function loadPets() {
      try {
        setLoading(true)
        setError('')
        const data = await getPets(filters)
        if (!isCancelled) {
          setPets(data)
        }
      } catch {
        if (!isCancelled) {
          setError('Αποτυχία φόρτωσης αγγελιών. Δοκίμασε ξανά.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadPets()

    return () => {
      isCancelled = true
    }
  }, [filters])

  return (
    <div className="pet-list-page">
      <h1 className="page-title">Υιοθέτησε ένα κατοικίδιο 🐾</h1>

      {/* Filters */}
      <div className="filters-bar">
        <select name="species" value={filters.species} onChange={handleChange}>
          {SPECIES_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select name="gender" value={filters.gender} onChange={handleChange}>
          {GENDER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="age"
          placeholder="Ηλικία έως (χρόνια)"
          min="0"
          step="0.5"
          value={filters.age}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Πόλη / Περιοχή"
          value={filters.location}
          onChange={handleChange}
        />

        <button className="btn-reset" onClick={handleReset}>
          Καθαρισμός
        </button>
      </div>

      {/* Results count */}
      <p className="results-count">
        {loading
          ? 'Φόρτωση...'
          : pets.length === 0
            ? 'Δεν βρέθηκαν αποτελέσματα'
            : pets.length === 1
              ? '1 ζώο διαθέσιμο'
              : `${pets.length} ζώα διαθέσιμα`}
      </p>

      {error && <p className="results-error">{error}</p>}

      {/* Pet cards grid */}
      <div className="pet-grid">
        {pets.map((pet) => (
          <Link to={`/pets/${pet.id}`} key={pet.id} className="pet-card">
            <div className="pet-card-photo">
              {pet.primary_photo ? (
                <img src={pet.primary_photo} alt={pet.name} />
              ) : (
                <span className="pet-emoji">{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>
              )}
            </div>
            <div className="pet-card-info">
              <h2 className="pet-name">{pet.name}</h2>
              <p className="pet-meta">
                {pet.breed && <span>{pet.breed} · </span>}
                <span>
                  {pet.age} {pet.age === 1 ? 'χρόνος' : 'χρόνια'} ·{' '}
                </span>
                <span>{GENDER_LABEL[pet.gender] ?? pet.gender}</span>
              </p>
              <p className="pet-location">📍 {pet.location}</p>
              <p className="pet-shelter">{pet.shelter_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
