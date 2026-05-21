import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShelterRequests, updateRequestStatus } from '../services/adoptionService';
import './ShelterDashboardPage.css';

const STATUS_LABEL = {
  pending: 'Εκκρεμεί',
  approved: 'Εγκρίθηκε',
  rejected: 'Απορρίφθηκε',
};

export default function ShelterDashboardPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!user || user.role !== 'shelter') {
      navigate('/auth');
      return;
    }

    let isCancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await getShelterRequests();
        if (!isCancelled) setRequests(data);
      } catch {
        if (!isCancelled) setError('Αποτυχία φόρτωσης αιτήσεων.');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    load();
    return () => { isCancelled = true; };
  }, []);

  async function handleAction(id, status) {
    try {
      setActionLoading(id);
      await updateRequestStatus(id, status);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r,
        ),
      );
    } catch {
      setError('Αποτυχία ενημέρωσης αίτησης.');
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="shelter-dashboard">
        <h1 className="page-title">Πίνακας Καταφυγίου</h1>
        <p className="loading-text">Φόρτωση αιτήσεων...</p>
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === 'pending');
  const resolved = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="shelter-dashboard">
      <h1 className="page-title">Πίνακας Καταφυγίου</h1>

      {error && <p className="results-error">{error}</p>}

      {/* Pending requests */}
      <section className="dashboard-section">
        <h2 className="section-title">
          Εκκρεμείς αιτήσεις
          {pending.length > 0 && <span className="badge">{pending.length}</span>}
        </h2>

        {pending.length === 0 ? (
          <p className="empty-text">Δεν υπάρχουν εκκρεμείς αιτήσεις.</p>
        ) : (
          <div className="request-list">
            {pending.map((r) => (
              <div key={r.id} className="request-card">
                <div className="request-info">
                  <h3 className="request-pet">{r.pet_name}</h3>
                  <p className="request-applicant">{r.applicant_name}</p>
                  <p className="request-email">{r.applicant_email}</p>
                  {r.message && <p className="request-message">"{r.message}"</p>}
                  <p className="request-date">
                    {new Date(r.created_at).toLocaleDateString('el-GR')}
                  </p>
                </div>
                <div className="request-actions">
                  <button
                    className="btn-approve"
                    disabled={actionLoading === r.id}
                    onClick={() => handleAction(r.id, 'approved')}
                  >
                    Έγκριση
                  </button>
                  <button
                    className="btn-reject"
                    disabled={actionLoading === r.id}
                    onClick={() => handleAction(r.id, 'rejected')}
                  >
                    Απόρριψη
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resolved requests */}
      {resolved.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">Ολοκληρωμένες αιτήσεις</h2>
          <div className="request-list">
            {resolved.map((r) => (
              <div key={r.id} className={`request-card resolved ${r.status}`}>
                <div className="request-info">
                  <h3 className="request-pet">{r.pet_name}</h3>
                  <p className="request-applicant">{r.applicant_name}</p>
                  <p className="request-email">{r.applicant_email}</p>
                  <p className="request-date">
                    {new Date(r.created_at).toLocaleDateString('el-GR')}
                  </p>
                </div>
                <span className={`status-badge ${r.status}`}>
                  {STATUS_LABEL[r.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
