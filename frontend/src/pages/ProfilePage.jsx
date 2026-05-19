import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ROLE_LABEL = { user: 'Χρήστης', shelter: 'Καταφύγιο', admin: 'Διαχειριστής' };
const STATUS_LABEL = { pending: '⏳ Εκκρεμεί', approved: '✅ Εγκρίθηκε', rejected: '❌ Απορρίφθηκε' };

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }

    axios.get(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => setProfile(r.data))
      .catch(() => setError('Αδυναμία φόρτωσης προφίλ.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  }

  if (loading) return <div className="profile-page"><p className="profile-loading">Φόρτωση...</p></div>;
  if (error)   return <div className="profile-page"><p className="profile-error">{error}</p></div>;

  const requests = profile.adoption_requests ?? [];
  const total    = requests.length;
  const pending  = requests.filter(r => r.status === 'pending').length;
  const approved = requests.filter(r => r.status === 'approved').length;

  return (
    <div className="profile-page">

      {/* ── Hero card ─────────────────────────────────────────── */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials(profile.name)}</div>
        <div className="profile-hero-info">
          <h1 className="profile-name">{profile.name}</h1>
          <span className={`profile-role-badge role-${profile.role}`}>
            {ROLE_LABEL[profile.role] ?? profile.role}
          </span>
          <p className="profile-email">✉️ {profile.email}</p>
          <p className="profile-since">
            Μέλος από {new Date(profile.created_at).toLocaleDateString('el-GR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Αποσύνδεση</button>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-number">{total}</span>
          <span className="stat-label">Συνολικές αιτήσεις</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-number">{pending}</span>
          <span className="stat-label">Εκκρεμείς</span>
        </div>
        <div className="stat-card stat-approved">
          <span className="stat-number">{approved}</span>
          <span className="stat-label">Εγκεκριμένες</span>
        </div>
      </div>

      {/* ── Adoption history ───────────────────────────────────── */}
      <div className="profile-history">
        <h2 className="history-title">Ιστορικό αιτήσεων υιοθεσίας</h2>

        {requests.length === 0 ? (
          <p className="history-empty">Δεν έχεις υποβάλει ακόμα καμία αίτηση. <a href="/pets">Βρες ένα ζώο →</a></p>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Ζώο</th>
                  <th>Καταφύγιο</th>
                  <th>Ημερομηνία</th>
                  <th>Κατάσταση</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    <td><a href={`/pets/${r.pet_id}`} className="pet-link">{r.pet_name}</a></td>
                    <td>{r.shelter_name}</td>
                    <td>{new Date(r.created_at).toLocaleDateString('el-GR')}</td>
                    <td><span className={`status-badge status-${r.status}`}>{STATUS_LABEL[r.status] ?? r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
