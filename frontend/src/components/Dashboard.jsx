import { useEffect, useState, useCallback } from 'react';
import { api } from '../api.js';
import LeadTable from './LeadTable.jsx';
import LeadModal from './LeadModal.jsx';

const STAGES = [
  { key: 'all', label: 'All leads', color: '#c7cbd1' },
  { key: 'new', label: 'New', color: 'var(--blue)' },
  { key: 'contacted', label: 'Contacted', color: 'var(--amber)' },
  { key: 'converted', label: 'Converted', color: 'var(--green)' },
  { key: 'lost', label: 'Lost', color: 'var(--gray)' }
];

export default function Dashboard({ admin, onLogout }) {
  const [leads, setLeads] = useState([]);
  const [counts, setCounts] = useState({});
  const [stage, setStage] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const [filtered, all] = await Promise.all([
        api.getLeads({ status: stage, search }),
        api.getLeads({})
      ]);
      setLeads(filtered);
      const tally = { all: all.length, new: 0, contacted: 0, converted: 0, lost: 0 };
      all.forEach((l) => { tally[l.status] = (tally[l.status] || 0) + 1; });
      setCounts(tally);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [stage, search]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  function closeModal() {
    setSelectedLead(null);
    setShowCreate(false);
  }

  function handleSaved() {
    closeModal();
    loadLeads();
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">Mini CRM</div>
          <div className="brand-sub">Lead pipeline</div>
        </div>

        <nav className="pipeline-nav">
          {STAGES.map((s) => (
            <button
              key={s.key}
              className={`pipeline-item ${stage === s.key ? 'active' : ''}`}
              onClick={() => setStage(s.key)}
            >
              <span className="pipeline-dot" style={{ background: s.color }} />
              {s.label}
              <span className="pipeline-count">{counts[s.key] ?? 0}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="admin-email">{admin?.email}</span>
          <button className="logout-btn" onClick={onLogout}>Log out</button>
        </div>
      </aside>

      <main className="main">
        <div className="main-header">
          <div>
            <div className="main-title">
              {STAGES.find((s) => s.key === stage)?.label || 'Leads'}
            </div>
            <div className="main-sub">
              {loading ? 'Loading…' : `${leads.length} lead${leads.length === 1 ? '' : 's'}`}
            </div>
          </div>
          <div className="controls-row">
            <input
              className="search-input"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-amber" onClick={() => setShowCreate(true)}>
              + Add lead
            </button>
          </div>
        </div>

        <LeadTable leads={leads} onSelect={setSelectedLead} />
      </main>

      {(selectedLead || showCreate) && (
        <LeadModal
          lead={selectedLead}
          onClose={closeModal}
          onSaved={handleSaved}
          onDeleted={handleSaved}
        />
      )}
    </div>
  );
}
