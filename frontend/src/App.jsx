import { useEffect, useState } from 'react';
import { api, getToken } from './api.js';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      if (!getToken()) {
        setChecking(false);
        return;
      }
      try {
        const me = await api.me();
        setAdmin(me);
      } catch {
        localStorage.removeItem('crm_token');
      } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, []);

  function handleLogout() {
    localStorage.removeItem('crm_token');
    setAdmin(null);
  }

  if (checking) return null;

  return admin ? (
    <Dashboard admin={admin} onLogout={handleLogout} />
  ) : (
    <Login onLogin={setAdmin} />
  );
}
