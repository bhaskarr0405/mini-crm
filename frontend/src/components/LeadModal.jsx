import { useState } from 'react';
import { api } from '../api.js';

const STATUSES = ['new', 'contacted', 'converted', 'lost'];
const SOURCES = ['Website Form', 'Referral', 'Social Media', 'Cold Call', 'Advertisement', 'Other'];

export default function LeadModal({ lead, onClose, onSaved, onDeleted }) {
  const isNew = !lead;
  const [form, setForm] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    source: lead?.source || 'Website Form',
    message: lead?.message || ''
  });
  const [status, setStatus] = useState(lead?.status || 'new');
  const [notes, setNotes] = useState(lead?.notes || []);
  const [noteText, setNoteText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isNew) {
        await api.createLead(form);
      } else {
        await api.updateLead(lead._id, form);
        if (status !== lead.status) {
          await api.updateStatus(lead._id, status);
        }
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusClick(newStatus) {
    setStatus(newStatus);
    if (!isNew) {
      try {
        await api.updateStatus(lead._id, newStatus);
      } catch (err) {
        setError(err.message);
      }
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      const updated = await api.addNote(lead._id, {
        text: noteText,
        followUpDate: followUpDate || undefined
      });
      setNotes(updated.notes);
      setNoteText('');
      setFollowUpDate('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteNote(noteId) {
    try {
      const updated = await api.deleteNote(lead._id, noteId);
      setNotes(updated.notes);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteLead() {
    if (!window.confirm(`Delete ${lead.name}? This cannot be undone.`)) return;
    try {
      await api.deleteLead(lead._id);
      onDeleted();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">{isNew ? 'New lead' : lead.name}</div>
          <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        {!isNew && (
          <div className="status-row">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={`status-btn ${status === s ? `active-${s}` : ''}`}
                onClick={() => handleStatusClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="field-group">
            <label className="field-label">Name</label>
            <input
              className="field-input"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              type="email"
              className="field-input"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">Phone</label>
            <input
              className="field-input"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <div className="field-group">
            <label className="field-label">Source</label>
            <select
              className="field-select"
              value={form.source}
              onChange={(e) => updateField('source', e.target.value)}
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Original message</label>
            <textarea
              className="field-textarea"
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <div className="drawer-actions">
            <button type="submit" className="btn btn-amber" disabled={saving}>
              {saving ? 'Saving…' : isNew ? 'Create lead' : 'Save changes'}
            </button>
            {!isNew && (
              <button type="button" className="btn btn-ghost" onClick={handleDeleteLead}>
                Delete
              </button>
            )}
          </div>
        </form>

        {!isNew && (
          <>
            <hr className="section-divider" />
            <div className="section-label">Notes &amp; follow-ups</div>

            <form className="note-form" onSubmit={handleAddNote}>
              <textarea
                className="field-textarea"
                placeholder="Add a note about this lead…"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="date"
                  className="field-input"
                  style={{ flex: 1 }}
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Add note</button>
              </div>
            </form>

            {notes.length === 0 && (
              <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>No notes yet.</div>
            )}
            {notes.map((n) => (
              <div className="note-item" key={n._id}>
                <button className="note-delete" onClick={() => handleDeleteNote(n._id)} aria-label="Delete note">
                  ×
                </button>
                <div className="note-text">{n.text}</div>
                <div className="note-meta">
                  {new Date(n.createdAt).toLocaleString()}
                  {n.followUpDate && ` · Follow up ${new Date(n.followUpDate).toLocaleDateString()}`}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
