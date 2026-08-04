import React, { useState, useEffect } from 'react';
import Landing     from './portals/Landing.jsx';
import UserApp     from './portals/UserApp.jsx';
import ProviderApp from './portals/ProviderApp.jsx';
import AdminApp    from './portals/AdminApp.jsx';
import { SERVICES } from './data/mock.js';
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
    lat: b.lat,
    lng: b.lng,
    skill: b.skill,
  };
}

export default function App() {
  // Read portal synchronously so reloads never lose the current portal
  const [portal,    setPortal]    = useState(() => {
    const hash = (window.location.hash || '').replace('#', '');
    const adminSections = ['dashboard', 'bookings', 'marketplace', 'providers', 'services', 'users'];
    if (hash && adminSections.includes(hash)) return 'admin';
    const saved = localStorage.getItem('sh_portal');
    return (saved && saved !== 'landing') ? saved : 'landing';
  });
  const [providers, setProviders] = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [services,  setServices]  = useState([]);
  const [session,   setSession]   = useState(null);
  const [users,     setUsers]     = useState([]);
  const [marketplacePostings, setMarketplacePostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // Fetch all data individually with proper error handling
        // Supabase query builders don't support .catch() — must use await + try/catch
        let pData = [], bData = [], sData = [], cData = [], mData = [];
        let sessionData = null;

        try { const r = await supabase.auth.getSession(); sessionData = r?.data?.session || null; } catch(e) { /**/ }
        try { const r = await supabase.from('providers').select('*'); if (!r.error && r.data) pData = r.data; } catch(e) { /**/ }
        try { const r = await supabase.from('bookings').select('*').order('created_at', { ascending: false }); if (!r.error && r.data) bData = r.data; } catch(e) { /**/ }
        try { const r = await supabase.from('services').select('*').order('id', { ascending: true }); if (!r.error && r.data) sData = r.data; } catch(e) { /**/ }
        try { const r = await supabase.from('customers').select('*').order('created_at', { ascending: false }); if (!r.error && r.data) cData = r.data; } catch(e) { /**/ }
        try { const r = await supabase.from('marketplace_postings').select('*').order('created_at', { ascending: false }); if (!r.error && r.data) mData = r.data; } catch(e) { /**/ }

        if (sessionData) setSession(sessionData);

        setProviders(pData);
        setBookings(bData.map(transformBooking));
        setServices(sData.length > 0 ? sData : SERVICES);
        setMarketplacePostings(mData);

        setUsers(cData.map(c => ({
          id: c.id,
          name: c.name || '-',
          email: c.email || '-',
          phone: c.phone || '-',
          avatarUrl: c.avatar_url || c.avatar || c.photo_url || null,
          password: '*****',
          joined: c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
          lastLogin: 'Active',
          bookingsCount: bData.filter(b => b.phone === c.phone || b.customer_name === c.name).length,
        })));
      } catch (err) {
        console.error('App init error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    init();

    // Listen for auth state changes after initial load safely
    const authRes = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_OUT') {
        const curPortal = localStorage.getItem('sh_portal');
        if (curPortal === 'user' || curPortal === 'provider') {
          setPortal('landing');
          localStorage.removeItem('sh_portal');
        }
      }
    });
    const authSub = authRes?.data?.subscription;

    // Real-time DB updates safely wrapped
    let dbSub;
    try {
      dbSub = supabase.channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'providers' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_postings' }, fetchData)
        .subscribe();
    } catch (e) {
      console.log('Realtime subscription fallback', e);
    }

    return () => {
      if (authSub?.unsubscribe) authSub.unsubscribe();
      if (dbSub) supabase.removeChannel(dbSub);
    };
  }, []);

  async function fetchData() {
    try {
      let pData = [], bData = [], sData = [], cData = [], mData = [];
      try { const r = await supabase.from('providers').select('*'); if (!r.error && r.data) pData = r.data; } catch(e) { /**/ }
      try { const r = await supabase.from('bookings').select('*').order('created_at', { ascending: false }); if (!r.error && r.data) bData = r.data; } catch(e) { /**/ }
      try { const r = await supabase.from('services').select('*').order('id', { ascending: true }); if (!r.error && r.data) sData = r.data; } catch(e) { /**/ }
      try { const r = await supabase.from('customers').select('*').order('created_at', { ascending: false }); if (!r.error && r.data) cData = r.data; } catch(e) { /**/ }
      try { const r = await supabase.from('marketplace_postings').select('*').order('created_at', { ascending: false }); if (!r.error && r.data) mData = r.data; } catch(e) { /**/ }

      if (pData.length > 0) setProviders(pData);
      if (bData.length > 0) setBookings(bData.map(transformBooking));
      if (sData.length > 0) setServices(sData);
      if (mData && mData.length >= 0) setMarketplacePostings(mData);
      if (cData.length > 0) {
        setUsers(cData.map(c => ({
          id: c.id,
          name: c.name || '-',
          email: c.email || '-',
          phone: c.phone || '-',
          avatarUrl: c.avatar_url || c.avatar || c.photo_url || null,
          password: '*****',
          joined: c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
          lastLogin: 'Active',
          bookingsCount: bData.filter(b => b.phone === c.phone || b.customer_name === c.name).length,
        })));
      }
    } catch (err) {
      console.log('fetchData background refresh fallback', err);
    }
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
      lat: b.lat,
      lng: b.lng,
      skill: b.skill,
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

  async function addProvider(p) {
    let lat = null;
    let lng = null;
    const addr = (p.address || '').toLowerCase();
    if (addr.includes('pattambi')) {
      lat = 10.8123; lng = 76.1983;
    } else if (addr.includes('kondotty')) {
      lat = 11.1495; lng = 75.9723;
    } else if (addr.includes('kozhikode') || addr.includes('calicut')) {
      lat = 11.2588; lng = 75.7804;
    } else if (addr.includes('malappuram')) {
      lat = 11.0736; lng = 76.0740;
    } else {
      let hash = 0;
      const str = p.name || p.phone || '';
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const latDelta = (hash % 100) / 1000;
      const lngDelta = ((hash >> 8) % 100) / 1000;
      lat = 11.1495 + latDelta;
      lng = 75.9723 + lngDelta;
    }

    const { data, error } = await supabase.from('providers').insert({
      name: p.name,
      skill: p.skill,
      phone: p.phone,
      address: p.address,
      email: p.email,
      aadhaar_number: p.aadhaar_number,
      price: p.price,
      username: p.username,
      password: p.password,
      rating: 0,
      jobs: 0,
      status: 'pending',
      lat: lat,
      lng: lng,
    }).select();

    if (!error && data && data.length > 0) {
      setProviders(prev => [data[0], ...prev]);
    }
  }

  async function addService(s) {
    const { data, error } = await supabase.from('services').insert({
      name: s.name,
      icon: s.icon || s.icon_name || 'home_repair_service',
      bookings: s.bookings || '0+',
      price: s.price,
      skill: s.skill,
      desc: s.desc
    }).select();
    
    if (!error && data && data.length > 0) {
      setServices(prev => [...prev, data[0]]);
    }
  }

  async function updateService(id, patch) {
    try {
      await supabase.from('services').update(patch).eq('id', id);
    } catch (e) {
      console.log('Local update service fallback', e);
    }
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function addMarketplacePosting(posting) {
    try {
      const { data, error } = await supabase.from('marketplace_postings').insert({
        title: posting.title,
        category: posting.category,
        type: posting.type,
        price: parseInt(posting.price) || 0,
        description: posting.description,
        image_url: posting.imageUrl || posting.image_url,
        contact_phone: posting.contactPhone || posting.contact_phone,
        location_name: posting.locationName || posting.location_name,
        lat: posting.lat || 11.1495,
        lng: posting.lng || 75.9723,
      }).select();

      if (!error && data && data.length > 0) {
        setMarketplacePostings(prev => [data[0], ...prev]);
      } else {
        const newPost = { id: Date.now(), ...posting };
        setMarketplacePostings(prev => [newPost, ...prev]);
      }
    } catch (e) {
      const newPost = { id: Date.now(), ...posting };
      setMarketplacePostings(prev => [newPost, ...prev]);
    }
  }

  async function updateMarketplacePosting(id, patch) {
    try {
      await supabase.from('marketplace_postings').update(patch).eq('id', id);
    } catch (e) {
      console.log('Local update fallback', e);
    }
    setMarketplacePostings(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function deleteMarketplacePosting(id) {
    try {
      await supabase.from('marketplace_postings').delete().eq('id', id);
    } catch (e) {
      console.log('Local delete fallback', e);
    }
    setMarketplacePostings(prev => prev.filter(p => p.id !== id));
  }

  async function updateUser(id, patch) {
    try {
      const dbPatch = {};
      if (patch.name !== undefined) dbPatch.name = patch.name;
      if (patch.phone !== undefined) dbPatch.phone = patch.phone;
      if (patch.email !== undefined) dbPatch.email = patch.email;
      const imgVal = patch.avatarUrl || patch.avatar_url || patch.avatar;
      if (imgVal !== undefined) {
        dbPatch.avatar_url = imgVal;
        dbPatch.avatar = imgVal;
      }

      const { error } = await supabase.from('customers').update(dbPatch).eq('id', id);
      if (error) {
        // Fallback retry without avatar_url if schema lacks column
        delete dbPatch.avatar_url;
        await supabase.from('customers').update(dbPatch).eq('id', id);
      }
    } catch (e) {
      console.log('User update error', e);
    }
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
  }

  async function deleteUser(id) {
    try {
      await supabase.from('customers').delete().eq('id', id);
    } catch (e) {
      console.log('User delete error', e);
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  const sharedProps = { 
    bookings, updateBooking, providers, updateProvider, addProvider, users, updateUser, deleteUser, services, addService, updateService, session,
    marketplacePostings, addMarketplacePosting, updateMarketplacePosting, deleteMarketplacePosting
  };

  if (isLoading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg, #f8fafc)', gap: 14
    }}>
      <div style={{
        width: 44, height: 44, border: '3px solid #e2e8f0',
        borderTop: '3px solid var(--teal, #006688)',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500, margin: 0 }}>Loading Sahaya…</p>
    </div>
  );

  function goPortal(name) {
    setPortal(name);
    if (name !== 'landing') {
      localStorage.setItem('sh_portal', name);
    } else {
      localStorage.removeItem('sh_portal');
    }
  }

  return (
    <div className="sh-app">
      {portal === 'landing' && (
        <Landing onSelect={goPortal} />
      )}
      {portal === 'user' && (
        <UserApp
          {...sharedProps}
          addBooking={addBooking}
          onExit={() => { localStorage.removeItem('sh_portal'); setPortal('landing'); }}
        />
      )}
      {portal === 'provider' && (
        <ProviderApp
          {...sharedProps}
          onExit={() => { localStorage.removeItem('sh_portal'); setPortal('landing'); }}
        />
      )}
      {portal === 'admin' && (
        <AdminApp
          {...sharedProps}
          onExit={() => { localStorage.removeItem('sh_portal'); localStorage.removeItem('sh_admin_auth'); setPortal('landing'); }}
        />
      )}
    </div>
  );
}
