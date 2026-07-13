import React, { useState, useEffect } from 'react';
import Landing     from './portals/Landing.jsx';
import UserApp     from './portals/UserApp.jsx';
import ProviderApp from './portals/ProviderApp.jsx';
import AdminApp    from './portals/AdminApp.jsx';
import { INITIAL_USERS } from './data/mock.js';
import { supabase } from './lib/supabase.js';

// Helper to convert DB snake_case to app camelCase
function transformBooking(b) {
  return {
    id: b.id,
    serviceId: b.service_id,
    serviceName: b.service_name,
    customerName: b.customer_name,
    phone: b.phone,
    address: b.address,
    date: b.date,
    time: b.time,
    price: b.price,
    notes: b.notes,
    status: b.status,
    providerId: b.provider_id,
    createdAt: b.created_at,
  };
}

export default function App() {
  const [portal,    setPortal]    = useState('landing');
  const [providers, setProviders] = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [users]                   = useState(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    const [pRes, bRes] = await Promise.all([
      supabase.from('providers').select('*'),
      supabase.from('bookings').select('*').order('created_at', { ascending: false })
    ]);

    if (!pRes.error) setProviders(pRes.data);
    if (!bRes.error) {
      setBookings(bRes.data.map(transformBooking));
    }
    setIsLoading(false);
  }

  async function addBooking(b) {
    const { data, error } = await supabase.from('bookings').insert({
      service_id: b.serviceId,
      service_name: b.serviceName,
      customer_name: b.customerName,
      phone: b.phone,
      address: b.address,
      date: b.date,
      time: b.time,
      price: b.price,
      notes: b.notes || '',
      status: 'pending',
    }).select();

    if (!error && data) {
      setBookings(prev => [transformBooking(data[0]), ...prev]);
    }
  }

  async function updateBooking(id, patch) {
    const updatePayload = {};
    if (patch.status !== undefined) updatePayload.status = patch.status;
    if (patch.providerId !== undefined) updatePayload.provider_id = patch.providerId;

    const { error } = await supabase.from('bookings').update(updatePayload).eq('id', id);
    if (!error) {
      setBookings(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
    }
  }

  async function updateProvider(id, patch) {
    const { error } = await supabase.from('providers').update(patch).eq('id', id);
    if (!error) {
      setProviders(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
    }
  }

  const sharedProps = { bookings, updateBooking, providers, updateProvider, users };

  if (isLoading) return <div style={{padding: 40}}>Loading App Data...</div>;

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
