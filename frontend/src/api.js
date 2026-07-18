const BASE = '/api';

function getToken() {
  return localStorage.getItem('crm_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),

  getLeads: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/leads${qs ? `?${qs}` : ''}`);
  },
  getLead: (id) => request(`/leads/${id}`),
  createLead: (payload) => request('/leads', { method: 'POST', body: JSON.stringify(payload) }),
  updateLead: (id, payload) =>
    request(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updateStatus: (id, status) =>
    request(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteLead: (id) => request(`/leads/${id}`, { method: 'DELETE' }),

  addNote: (id, payload) =>
    request(`/leads/${id}/notes`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteNote: (id, noteId) => request(`/leads/${id}/notes/${noteId}`, { method: 'DELETE' })
};

export { getToken };
