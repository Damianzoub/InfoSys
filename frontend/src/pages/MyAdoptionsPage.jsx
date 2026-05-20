import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserAdoptions } from '../services/adoptionService';
import './MyAdoptionsPage.css';

const STATUS_LABEL = {
  pending: 'Εκκρεμεί',
  approved: 'Εγκρίθηκε',
  rejected: 'Απορρίφθηκε',
};

export default function MyAdoptionsPage() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await getUserAdoptions();
        if (!isCancelled) setAdoptions(data);
      } catch {
        if (!isCancelled) setError('Αποτυχία φόρτωσης αιτήσεων.');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    load();
    return () => { isCancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="my-adoptions">
        <h1 className="page-title">Οι αιτήσεις μου</h1>
        <p className="loading-text">Φόρτωση...</p>
      </div>
    );
  }

  return (
    <div className="my-adoptions">
      <h1 className="page-title">Οι αιτήσεις μου</h1>

      {error && <p className="results-error">{error}</p>}

      {adoptions.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">Δεν έχεις υποβάλει αιτήσεις υιοθεσίας ακόμα.</p>
          <Link to="/pets" className="btn-browse">Αναζήτηση ζώων</Link>
        </div>
      ) : (
        <div className="adoptions-list">
          {adoptions.map((a) => (
            <div key={a.id} className={`adoption-card ${a.status}`}>
              <div className="adoption-photo">
                {a.pet_photo ? (
                  <img src={a.pet_photo} alt={a.pet_name} />
                ) : (
                  <span className="adoption-emoji">🐾</span>
                )}
              </div>
              <div className="adoption-info">
                <Link to={`/pets/${a.pet_id}`} className="adoption-pet-name">
                  {a.pet_name}
                </Link>
                <p className="adoption-shelter">{a.shelter_name}</p>
                <p className="adoption-date">
                  {new Date(a.created_at).toLocaleDateString('el-GR')}
                </p>
              </div>
              <span className={`status-badge ${a.status}`}>
                {STATUS_LABEL[a.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
