import { useEffect, useState } from 'react';
import { getStats, getReport } from '../services/adminService';
import './AdminPanelPage.css';

const STATUS_LABEL = {
  pending: 'Εκκρεμεί',
  approved: 'Εγκρίθηκε',
  rejected: 'Απορρίφθηκε',
};

export default function AdminPanelPage() {
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const [statsData, reportData] = await Promise.all([getStats(), getReport()]);
        if (!isCancelled) {
          setStats(statsData);
          setReport(reportData);
        }
      } catch {
        if (!isCancelled) setError('Αποτυχία φόρτωσης δεδομένων.');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    load();
    return () => { isCancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="admin-panel">
        <h1 className="page-title">Πίνακας Διαχείρισης</h1>
        <p className="loading-text">Φόρτωση...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1 className="page-title">Πίνακας Διαχείρισης</h1>

      {error && <p className="results-error">{error}</p>}

      {/* Stats cards */}
      {stats && (
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.users}</span>
              <span className="stat-label">Χρήστες</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.shelters}</span>
              <span className="stat-label">Καταφύγια</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.pets}</span>
              <span className="stat-label">Ζώα</span>
            </div>
            <div className="stat-card accent">
              <span className="stat-value">{stats.adoptions.total}</span>
              <span className="stat-label">Αιτήσεις</span>
            </div>
          </div>

          <div className="adoption-breakdown">
            <div className="breakdown-item pending">
              <span className="breakdown-value">{stats.adoptions.pending}</span>
              <span className="breakdown-label">Εκκρεμείς</span>
            </div>
            <div className="breakdown-item approved">
              <span className="breakdown-value">{stats.adoptions.approved}</span>
              <span className="breakdown-label">Εγκεκριμένες</span>
            </div>
            <div className="breakdown-item rejected">
              <span className="breakdown-value">{stats.adoptions.rejected}</span>
              <span className="breakdown-label">Απορριφθείσες</span>
            </div>
          </div>
        </section>
      )}

      {/* Shelter summary */}
      {report && (
        <>
          <section className="report-section">
            <h2 className="section-title">Καταφύγια</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Όνομα</th>
                    <th>Πόλη</th>
                    <th>Ζώα</th>
                    <th>Υιοθεσίες</th>
                  </tr>
                </thead>
                <tbody>
                  {report.shelters.map((s) => (
                    <tr key={s.id}>
                      <td className="cell-name">{s.name}</td>
                      <td>{s.city}</td>
                      <td className="cell-num">{s.total_pets}</td>
                      <td className="cell-num">{s.total_adoptions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="report-section">
            <h2 className="section-title">Πρόσφατες αιτήσεις</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ζώο</th>
                    <th>Καταφύγιο</th>
                    <th>Αιτών</th>
                    <th>Κατάσταση</th>
                    <th>Ημ/νία</th>
                  </tr>
                </thead>
                <tbody>
                  {report.recent_adoptions.map((a) => (
                    <tr key={a.id}>
                      <td className="cell-name">{a.pet_name}</td>
                      <td>{a.shelter_name}</td>
                      <td>{a.applicant_name}</td>
                      <td>
                        <span className={`status-pill ${a.status}`}>
                          {STATUS_LABEL[a.status]}
                        </span>
                      </td>
                      <td className="cell-date">
                        {new Date(a.created_at).toLocaleDateString('el-GR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="report-timestamp">
            Αναφορά: {new Date(report.generated_at).toLocaleString('el-GR')}
          </p>
        </>
      )}
    </div>
  );
}
