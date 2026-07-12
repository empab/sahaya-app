import React, { useState } from 'react';
import Landing     from './portals/Landing.jsx';
import UserApp     from './portals/UserApp.jsx';
import ProviderApp from './portals/ProviderApp.jsx';
import AdminApp    from './portals/AdminApp.jsx';
import { INITIAL_PROVIDERS, INITIAL_BOOKINGS, INITIAL_USERS } from './data/mock.js';

export default function App() {
  const [portal,    setPortal]    = useState('landing');
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [bookings,  setBookings]  = useState(INITIAL_BOOKINGS);
  const [users]                   = useState(INITIAL_USERS);
  const [idCounter, setIdCounter] = useState(2001);

  function addBooking(b) {
    setBookings(prev => [{ ...b, id: idCounter }, ...prev]);
    setIdCounter(c => c + 1);
  }
  function updateBooking(id, patch) {
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
  }
  function updateProvider(id, patch) {
    setProviders(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  }

  const sharedProps = { bookings, updateBooking, providers, updateProvider, users };

  return (
    <div className="sh-app">
      {portal === 'landing' && (
        <Landing onSelect={setPortal} />
      )}
      {portal === 'user' && (
        <UserApp
          {...sharedProps}
          addBooking={addBooking}
          onExit={() => setPortal('landing')}
        />
      )}
      {portal === 'provider' && (
        <ProviderApp
          {...sharedProps}
          onExit={() => setPortal('landing')}
        />
      )}
      {portal === 'admin' && (
        <AdminApp
          {...sharedProps}
          onExit={() => setPortal('landing')}
        />
      )}
    </div>
  );
}
