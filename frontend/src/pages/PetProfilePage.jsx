import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPetById } from '../services/petService'
import './PetProfilePage.css'
import AdoptionForm from './AdoptionForm'

const GENDER_LABEL = { male: 'Αρσενικό', female: 'Θηλυκό', unknown: 'Άγνωστο' }
const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', rabbit: '🐰' }
const SPECIES_LABEL = { dog: 'Σκύλος', cat: 'Γάτα', rabbit: 'Κουνέλι' }

export default function PetProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdoptionForm, setShowAdoptionForm] = useState(false)

  const stored = localStorage.getItem('user')
  const user = stored ? JSON.parse(stored) : null
  const role = user?.role

  useEffect(() => {
    let isCancelled = false

    async function loadPet() {
      try {
        setLoading(true)
        setError('')
        const data = await getPetById(id)
        if (!isCancelled) {
          setPet(data)
        }
      } catch {
        if (!isCancelled) {
          setError('Αποτυχία φόρτωσης στοιχείων ζώου. Δοκίμασε ξανά.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadPet()

    return () => {
      isCancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="pet-profile-page not-found">
        <h2>Φόρτωση...</h2>
        <Link to="/pets" className="btn-back">
          ← Πίσω στη λίστα
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pet-profile-page not-found">
        <h2>{error}</h2>
        <Link to="/pets" className="btn-back">
          ← Πίσω στη λίστα
        </Link>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="pet-profile-page not-found">
        <h2>Το ζώο δεν βρέθηκε.</h2>
        <Link to="/pets" className="btn-back">
          ← Πίσω στη λίστα
        </Link>
      </div>
    )
  }

  if (pet.status === 'adopted') {
    return (
      <div className="pet-profile-page not-found">
        <h2>❌ Το ζώο έχει ήδη υιοθετηθεί</h2>
        <p style={{ color: '#888', marginBottom: '16px' }}>
          Ο/Η <strong>{pet.name}</strong> βρήκε οικογένεια. Δες άλλα ζώα που περιμένουν!
        </p>
        <Link to="/pets" className="btn-back">
          ← Πίσω στη λίστα
        </Link>
      </div>
    )
  }

  return (
    <div className="pet-profile-page">
      <Link to="/pets" className="btn-back">
        ← Πίσω στη λίστα
      </Link>

      <div className="profile-card">
        {/* Photo section */}
        <div className="profile-photo">
          {pet.photos.length > 0 ? (
            <img
              src={pet.photos.find((p) => p.is_primary)?.url ?? pet.photos[0].url}
              alt={pet.name}
            />
          ) : (
            <span className="profile-emoji">{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>
          )}
        </div>

        {/* Info section */}
        <div className="profile-info">
          <h1 className="profile-name">{pet.name}</h1>

          <div className="profile-tags">
            <span className="tag">{SPECIES_LABEL[pet.species] ?? pet.species}</span>
            {pet.breed && <span className="tag">{pet.breed}</span>}
            <span className="tag">{GENDER_LABEL[pet.gender] ?? pet.gender}</span>
            <span className="tag">
              {pet.age} {pet.age === 1 ? 'χρόνος' : 'χρόνια'}
            </span>
            <span className={`tag status-${pet.status}`}>
              {pet.status === 'available'
                ? '✅ Διαθέσιμο'
                : pet.status === 'pending'
                  ? '⏳ Εκκρεμεί'
                  : '❌ Υιοθετήθηκε'}
            </span>
          </div>

          <p className="profile-location">📍 {pet.location}</p>

          {pet.description && (
            <div className="profile-description">
              <h3>Σχετικά</h3>
              <p>{pet.description}</p>
            </div>
          )}

          <div className="profile-shelter">
            <h3>Καταφύγιο</h3>
            <p>
              <strong>{pet.shelter.name}</strong>
            </p>
            <p>📍 {pet.shelter.city}</p>
            {pet.shelter.phone && <p>📞 {pet.shelter.phone}</p>}
          </div>

          {pet.status === 'available' && (
            <div className="profile-adopt-cta">
              {!user && (
                <>
                  <p className="cta-note">
                    Θέλεις να υιοθετήσεις τον/την <strong>{pet.name}</strong>; Σύνδεσου για να
                    υποβάλεις αίτηση.
                  </p>
                  <button className="btn-adopt" onClick={() => navigate('/auth')}>
                    Σύνδεση / Εγγραφή
                  </button>
                </>
              )}
              {(role === 'shelter' || role === 'admin') && (
                <p className="cta-note">
                  Μόνο απλοί χρήστες μπορούν να υποβάλουν αίτηση υιοθεσίας.
                </p>
              )}
              {role === 'user' && (
                <>
                  <p className="cta-note">
                    Θέλεις να υιοθετήσεις τον/την <strong>{pet.name}</strong>;
                  </p>
                  <button className="btn-adopt" onClick={() => setShowAdoptionForm(true)}>
                    Υποβολή αίτησης υιοθεσίας
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Adoption form modal CSS pending*/}
      {showAdoptionForm && (
        <div className="adoption-modal-overlay" onClick={() => setShowAdoptionForm(false)}>
          <div className="adoption-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowAdoptionForm(false)}>
              ✕
            </button>
            <AdoptionForm petId={pet.id} />
          </div>
        </div>
      )}

      {/* Extra photos */}
      {pet.photos.length > 1 && (
        <div className="extra-photos">
          {pet.photos
            .filter((p) => !p.is_primary)
            .map((photo) => (
              <img key={photo.id} src={photo.url} alt={`${pet.name} photo`} />
            ))}
        </div>
      )}
    </div>
  )
}
