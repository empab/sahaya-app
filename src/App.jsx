import React, { useState, useEffect } from 'react';
import Landing     from './portals/Landing.jsx';
import UserApp     from './portals/UserApp.jsx';
import ProviderApp from './portals/ProviderApp.jsx';
import AdminApp    from './portals/AdminApp.jsx';
import { INITIAL_USERS, INITIAL_MARKETPLACE_POSTINGS } from './data/mock.js';
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
  const [portal,    setPortal]    = useState('landing');
  const [providers, setProviders] = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [services,  setServices]  = useState([]);
  const [session,   setSession]   = useState(null);
  const [users,     setUsers]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth session AND app data together before showing any UI
    async function init() {
      const savedPortal = localStorage.getItem('sh_portal');

      // Run session check and data fetch simultaneously
      const [{ data: { session } }, pRes, bRes, sRes, cRes] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from('providers').select('*'),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('id', { ascending: true }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
      ]);

      // Set all data at once
      if (!pRes.error) setProviders(pRes.data);
      if (!bRes.error) setBookings(bRes.data.map(transformBooking));
      if (!sRes.error) setServices(sRes.data);
      if (!cRes.error) {
        const derivedUsers = cRes.data.map(c => {
          const userBookings = bRes.data ? bRes.data.filter(b => b.customer_name === c.email || b.phone === c.phone) : [];
          return {
            id: c.id,
            name: c.name || '-',
            email: c.email || '-',
            phone: c.phone || '-',
            password: '*****',
            joined: c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
            lastLogin: 'Active',
            bookingsCount: userBookings.length,
          };
        });
        setUsers(derivedUsers);
      }

      // Restore session and portal BEFORE removing isLoading
      setSession(session);
      if (savedPortal && savedPortal !== 'landing') {
        setPortal(savedPortal);
      }

      setIsLoading(false);
    }

    init();

    // Listen for auth state changes after initial load
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_OUT') {
        setPortal('landing');
        localStorage.removeItem('sh_portal');
      }
    });

    // Real-time DB updates
    const dbSub = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'providers' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, fetchData)
      .subscribe();

    return () => {
      authSub.unsubscribe();
      supabase.removeChannel(dbSub);
    };
  }, []);

  async function fetchData() {
    const [pRes, bRes, sRes, cRes] = await Promise.all([
      supabase.from('providers').select('*'),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('id', { ascending: true }),
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
    ]);
    if (!pRes.error) setProviders(pRes.data);
    if (!bRes.error) setBookings(bRes.data.map(transformBooking));
    if (!sRes.error) setServices(sRes.data);
    if (!cRes.error) {
      const derivedUsers = cRes.data.map(c => {
        const userBookings = bRes.data ? bRes.data.filter(b => b.customer_name === c.email || b.phone === c.phone) : [];
        return {
          id: c.id,
          name: c.name || '-',
          email: c.email || '-',
          phone: c.phone || '-',
          password: '*****',
          joined: c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
          lastLogin: 'Active',
          bookingsCount: userBookings.length,
        };
      });
      setUsers(derivedUsers);
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

  const [marketplacePostings, setMarketplacePostings] = useState(INITIAL_MARKETPLACE_POSTINGS);

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

  const sharedProps = { 
    bookings, updateBooking, providers, updateProvider, addProvider, users, services, addService, updateService, session,
    marketplacePostings, addMarketplacePosting, updateMarketplacePosting, deleteMarketplacePosting
  };

  if (isLoading) return <div style={{padding: 40}}>Loading App Data...</div>;

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
