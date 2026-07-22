import React, { useState, useMemo } from 'react';
import {
  BarChart3, ClipboardList, LayoutGrid, Users, LogOut,
  Shield, Wallet, Briefcase, MapPin, Check, X,
  ShieldCheck, Star, Search, ChevronRight, ArrowLeft,
  ShoppingBag, Pencil, Trash2, Plus, Tag
} from 'lucide-react';

import LoginScreen from '../components/LoginScreen.jsx';
import StatusPill  from '../components/StatusPill.jsx';
import { SERVICES, STATUS_META, serviceFor, providerFor } from '../data/mock.js';

function getProviderCoordinates(provider) {
  if (!provider) return null;
  if (provider.lat !== undefined && provider.lat !== null && provider.lng !== undefined && provider.lng !== null) {
    return { lat: provider.lat, lng: provider.lng };
  }
  const addr = (provider.address || '').toLowerCase();
  if (addr.includes('pattambi')) {
    return { lat: 10.8123, lng: 76.1983 };
  }
  if (addr.includes('kondotty')) {
    return { lat: 11.1495, lng: 75.9723 };
  }
  if (addr.includes('kozhikode') || addr.includes('calicut')) {
    return { lat: 11.2588, lng: 75.7804 };
  }
  if (addr.includes('malappuram')) {
    return { lat: 11.0736, lng: 76.0740 };
  }
  // Deterministic mock based on name or phone
  let hash = 0;
  const str = provider.name || provider.phone || '';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latDelta = (hash % 100) / 1000;
  const lngDelta = ((hash >> 8) % 100) / 1000;
  return { lat: 11.1495 + latDelta, lng: 75.9723 + lngDelta };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return '—';
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) return '—';
  
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d.toFixed(2) + ' km';
}

const SIDEBAR_ITEMS = [
  { key: 'dashboard',   label: 'Dashboard',        icon: BarChart3 },
  { key: 'bookings',    label: 'Bookings',          icon: ClipboardList },
  { key: 'marketplace', label: 'Community Market', icon: ShoppingBag },
  { key: 'providers',   label: 'Service Providers', icon: Briefcase },
  { key: 'services',    label: 'Services',          icon: LayoutGrid },
  { key: 'users',       label: 'Users',             icon: Users },
];



export default function AdminApp({
  providers = [], bookings = [], users = [], services = [], updateBooking, updateProvider, addProvider, addService, updateService,
  marketplacePostings = [], addMarketplacePosting, updateMarketplacePosting, deleteMarketplacePosting, onExit
}) {
  const [authed,         setAuthed]         = useState(() => localStorage.getItem('sh_admin_auth') === 'true');
  const [section,        setSection]        = useState('dashboard');
  const [bookingFilter,  setBookingFilter]  = useState('all');
  const [bookingSearch,  setBookingSearch]  = useState('');
  const [providerDetail, setProviderDetail] = useState(null);
  const [showCreateProvider, setShowCreateProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', phone: '', email: '', address: '', aadhaar_number: '', skill: 'House Help', price: '', username: '', password: '' });
  const [showCreateService, setShowCreateService] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', skill: '' });
  const [editingService, setEditingService] = useState(null);

  // Marketplace Management State
  const [showCreateMarketPost, setShowCreateMarketPost] = useState(false);
  const [editingMarketPost, setEditingMarketPost]       = useState(null);
  const [marketSearch, setMarketSearch]                 = useState('');
  const [marketTypeFilter, setMarketTypeFilter]         = useState('all');
  const [newMarketPost, setNewMarketPost]               = useState({
    title: '', category: 'Local Sales', type: 'sale', price: '', description: '', contact_phone: '+91 ', location_name: 'Calicut', image_url: ''
  });

  function handleCreateMarketPost(e) {
    e.preventDefault();
    if (!newMarketPost.title.trim()) return;
    addMarketplacePosting?.(newMarketPost);
    setShowCreateMarketPost(false);
    setNewMarketPost({ title: '', category: 'Local Sales', type: 'sale', price: '', description: '', contact_phone: '+91 ', location_name: 'Calicut', image_url: '' });
  }

  function handleUpdateMarketPost(e) {
    e.preventDefault();
    if (!editingMarketPost || !editingMarketPost.id) return;
    updateMarketplacePosting?.(editingMarketPost.id, editingMarketPost);
    setEditingMarketPost(null);
  }

  function handleDeleteMarketPost(id) {
    if (window.confirm('Are you sure you want to delete this marketplace posting?')) {
      deleteMarketplacePosting?.(id);
    }
  }

  function handleCreateProvider(e) {
    e.preventDefault();
    if (providers.some(p => p.username === newProvider.username)) {
      alert('Username is already taken');
      return;
    }
    addProvider(newProvider);
    setShowCreateProvider(false);
    setNewProvider({ name: '', phone: '', email: '', address: '', aadhaar_number: '', skill: 'House Help', price: '', username: '', password: '' });
  }

  function handleCreateService(e) {
    e.preventDefault();
    addService({
      name: newService.name,
      price: parseInt(newService.price) || 0,
      skill: newService.skill,
      desc: '',
      icon: 'home_repair_service'
    });
    setShowCreateService(false);
    setNewService({ name: '', price: '', skill: '' });
  }

  function handleUpdateService(e) {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService.id, {
      name: editingService.name,
      price: parseInt(editingService.price) || 0,
      skill: editingService.skill
    });
    setEditingService(null);
  }

  /* ---- All derived values & hooks must come BEFORE any early returns ---- */
  const revenue          = (bookings || []).filter(b => b && b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0);
  const pendingCount     = (bookings || []).filter(b => b && b.status === 'pending').length;
  const activeProviders  = (providers || []).filter(p => p && p.status === 'approved').length;
  const pendingProviders = (providers || []).filter(p => p && p.status === 'pending');

  const filteredBookings = useMemo(() => {
    let list = bookingFilter === 'all' ? (bookings || []) : (bookings || []).filter(b => b && b.status === bookingFilter);
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      list = list.filter(b =>
        (b?.serviceName || '').toLowerCase().includes(q) ||
        (b?.customerName || '').toLowerCase().includes(q) ||
        String(b?.id || '').includes(q)
      );
    }
    return list;
  }, [bookings, bookingFilter, bookingSearch]);

  const revData = [120, 340, 280, 450, 390, 520, revenue / 100];
  const bkgData = [1, 2, 2, 3, 2, 3, bookings.length];

  function assignProvider(booking) {
    const svc   = serviceFor(booking);
    const match = providers.find(p => p.skill === svc?.skill && p.status === 'approved');
    if (match) updateBooking(booking.id, { status: 'assigned', providerId: match.id });
  }

  /* ---- Early return for unauthenticated ---- */
  if (!authed) {
    return (
      <div style={{ maxWidth: 380, margin: '0 auto' }}>
        <LoginScreen
          roleLabel="Admin panel"
          icon={Shield}
          hint="Oversee bookings, providers and platform performance."
          isEmail={true}
          onLogin={(id, pwd) => {
            if (id === 'empabgroup@gmail.com' && pwd === 'Sahaya@2027') {
              setAuthed(true);
              localStorage.setItem('sh_admin_auth', 'true');
              return true;
            }
            return false;
          }}
          onExit={onExit}
        />
      </div>
    );
  }



  /* Provider detail view */
  if (providerDetail !== null) {
    const p    = providers.find(x => x.id === providerDetail);
    const jobs = bookings.filter(b => b.providerId === p.id);
    return (
      <div className="sh-admin-shell">
        <Sidebar section={section} setSection={s => { setSection(s); setProviderDetail(null); }} onExit={onExit} />
        <div className="sh-admin-main">
          <div className="sh-admin-header">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="sh-btn sh-btn-ghost sh-btn-sm" style={{ width: 'auto' }}
                onClick={() => setProviderDetail(null)}>
                <ArrowLeft size={14} /> Back
              </button>
              <div>
                <h2 className="sh-section-title">{p.name}</h2>
                <p className="sh-section-sub" style={{ margin: 0 }}>{p.skill} specialist</p>
              </div>
            </div>
          </div>

          {/* Provider Details (Sign-up) */}
          <div className="sh-card" style={{ marginBottom: 20 }}>
            <h3 style={{ marginTop: 0, fontSize: 16 }}>Sign-up Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: 14 }}>
              <div><strong>Username:</strong> {p.username || '—'}</div>
              <div><strong>Password:</strong> {p.password || '—'}</div>
              <div><strong>Email:</strong> {p.email || '—'}</div>
              <div><strong>Phone:</strong> {p.phone || '—'}</div>
              <div><strong>Aadhaar Number:</strong> {p.aadhaar_number || '—'}</div>
              <div><strong>Base Price:</strong> ₹{p.price || p.charge || 0}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Address:</strong> {p.address || '—'}</div>
            </div>
          </div>

          {/* Provider KPIs */}
          <div className="sh-kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <div className="sh-kpi-card">
              <div className="sh-kpi-label"><Star size={13} /> Rating</div>
              <div className="sh-kpi-value">{p.rating || '—'}</div>
            </div>
            <div className="sh-kpi-card">
              <div className="sh-kpi-label"><ClipboardList size={13} /> Jobs</div>
              <div className="sh-kpi-value">{p.jobs}</div>
            </div>
            <div className="sh-kpi-card">
              <div className="sh-kpi-label"><Wallet size={13} /> Earnings</div>
              <div className="sh-kpi-value">₹{(p.earnings || 0).toLocaleString('en-IN')}</div>
            </div>
            <div className="sh-kpi-card" style={{ background: 'rgba(0,102,136,0.06)', border: '1px solid rgba(0,102,136,0.15)' }}>
              <div className="sh-kpi-label" style={{ color: 'var(--secondary)' }}><Wallet size={13} /> Wallet Balance</div>
              <div className="sh-kpi-value" style={{ color: 'var(--secondary)' }}>₹{(p.charge || 0).toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Wallet Management Section */}
          <div className="sh-card" style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Wallet & Balance Management (Uber-style)</h3>
              <span className="sh-pill" style={{ background: 'var(--teal-tint)', color: 'var(--teal)', fontWeight: 600 }}>
                Active Wallet
              </span>
            </div>
            <p className="sh-card-meta" style={{ marginBottom: 16 }}>
              Directly adjust the service partner's wallet balance. Adjustments will reflect instantly on the partner's app.
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 150 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>Adjustment Type</label>
                <select 
                  id="wallet-adjust-type"
                  className="sh-input" 
                  style={{ height: 38, padding: '0 10px' }}
                >
                  <option value="add">Add Money (Credit / Bonus / Adjustment)</option>
                  <option value="deduct">Deduct Money (Debit / Commission / Adjustment)</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 120 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>Amount (₹)</label>
                <input 
                  id="wallet-adjust-amount"
                  type="number" 
                  placeholder="e.g. 500" 
                  className="sh-input" 
                  style={{ height: 38, padding: '0 10px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 2, minWidth: 200 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>Description / Reason</label>
                <input 
                  id="wallet-adjust-reason"
                  type="text" 
                  placeholder="e.g. Incentive bonus, Weekly cash commission deduction" 
                  className="sh-input" 
                  style={{ height: 38, padding: '0 10px' }}
                />
              </div>
              <button 
                className="sh-btn sh-btn-primary" 
                style={{ height: 38, padding: '0 18px', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => {
                  const type = document.getElementById('wallet-adjust-type').value;
                  const amtVal = document.getElementById('wallet-adjust-amount').value;
                  const reason = document.getElementById('wallet-adjust-reason').value;
                  const amount = parseFloat(amtVal);
                  if (isNaN(amount) || amount <= 0) {
                    alert('Please enter a valid amount');
                    return;
                  }
                  if (!reason.trim()) {
                    alert('Please enter a description/reason for the adjustment');
                    return;
                  }
                  
                  const currentBalance = parseFloat(p.charge || 0);
                  const newBalance = type === 'add' ? currentBalance + amount : currentBalance - amount;
                  
                  // Save transaction to local state history
                  const txId = Date.now();
                  const newTx = {
                    id: txId,
                    providerId: p.id,
                    type: type,
                    amount: amount,
                    reason: reason.trim(),
                    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    balanceAfter: newBalance
                  };
                  
                  // Read existing
                  const saved = JSON.parse(localStorage.getItem(`sh_wallet_adjust_${p.id}`) || '[]');
                  saved.unshift(newTx);
                  localStorage.setItem(`sh_wallet_adjust_${p.id}`, JSON.stringify(saved));
                  
                  // Update database charge
                  updateProvider(p.id, { charge: newBalance });
                  
                  // Clear form
                  document.getElementById('wallet-adjust-amount').value = '';
                  document.getElementById('wallet-adjust-reason').value = '';
                  alert(`Wallet balance successfully updated! New balance: ₹${newBalance}`);
                }}
              >
                Apply Adjustment
              </button>
            </div>

            {/* Adjustment Logs */}
            <div style={{ marginTop: 20 }}>
              <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700 }}>Platform Adjustment History</p>
              {(() => {
                const logs = JSON.parse(localStorage.getItem(`sh_wallet_adjust_${p.id}`) || '[]');
                if (logs.length === 0) {
                  return <div className="sh-card-meta" style={{ fontStyle: 'italic' }}>No platform adjustments applied yet.</div>;
                }
                return (
                  <div style={{ maxHeight: 150, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
                    <table className="sh-table" style={{ margin: 0, fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Reason</th>
                          <th>Balance After</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map(log => (
                          <tr key={log.id}>
                            <td>{log.date}</td>
                            <td>
                              <span style={{ 
                                color: log.type === 'add' ? 'var(--green)' : 'var(--coral)',
                                fontWeight: 700
                              }}>
                                {log.type === 'add' ? 'CREDIT' : 'DEBIT'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>
                              ₹{log.amount}
                            </td>
                            <td>{log.reason}</td>
                            <td>₹{log.balanceAfter}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Job history */}
          <p className="sh-section-title" style={{ fontSize: 15 }}>Job history</p>
          <p className="sh-section-sub">{jobs.length} bookings assigned to this provider</p>
          {jobs.length === 0
            ? <div className="sh-empty">No jobs assigned yet.</div>
            : (
              <table className="sh-table">
                <thead><tr><th>Booking</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {jobs.map(b => (
                    <tr key={b.id}>
                      <td>#{b.id} · {b.serviceName}</td>
                      <td>{b.customerName}</td>
                      <td>{b.date}</td>
                      <td className="sh-price">₹{b.price}</td>
                      <td><StatusPill status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="sh-admin-shell">
      <Sidebar section={section} setSection={setSection} onExit={onExit} />

      <div className="sh-admin-main">

        {/* ---- DASHBOARD ---- */}
        {section === 'dashboard' && (
          <>
            <div className="sh-admin-header">
              <div>
                <h2 className="sh-section-title">Dashboard</h2>
                <p className="sh-section-sub">Live snapshot of the Sahaya marketplace</p>
              </div>
            </div>

            <div className="sh-kpi-grid">
              <KpiCard
                icon={<Wallet size={13} />}
                label="Revenue (completed)"
                value={`₹${revenue.toLocaleString('en-IN')}`}
                delta="↑ from completed jobs"
                sparkData={revData}
                sparkColor="var(--green)"
              />
              <KpiCard
                icon={<ClipboardList size={13} />}
                label="Total bookings"
                value={bookings.length}
                delta={`${pendingCount} awaiting assignment`}
                sparkData={bkgData}
                sparkColor="var(--teal)"
              />
              <KpiCard
                icon={<Briefcase size={13} />}
                label="Active providers"
                value={activeProviders}
                delta={`${pendingProviders.length} pending approval`}
                sparkColor="var(--amber)"
              />
              <KpiCard
                icon={<Users size={13} />}
                label="Customers"
                value={users.length}
                delta="across Kondotty region"
                sparkColor="var(--coral)"
              />
            </div>

            <p className="sh-section-title" style={{ fontSize: 15 }}>Needs attention</p>
            <p className="sh-section-sub">Bookings waiting for a provider to be assigned</p>
            {bookings.filter(b => b.status === 'pending').length === 0
              ? <div className="sh-empty" style={{ padding: '20px 0' }}>Nothing pending — all bookings are assigned.</div>
              : bookings.filter(b => b.status === 'pending').map(b => (
                <div className="sh-card" key={b.id}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="sh-patch">
                      {React.createElement(serviceFor(b)?.icon || 'span', { size: 18, color: 'var(--teal)' })}
                    </div>
                    <div>
                      <p className="sh-card-title">{b.serviceName} for {b.customerName}</p>
                      <div className="sh-card-meta"><MapPin size={12} /> {b.address}</div>
                    </div>
                  </div>
                  <button className="sh-btn sh-btn-primary sh-btn-sm" onClick={() => assignProvider(b)}>
                    Auto-assign provider
                  </button>
                </div>
              ))
            }
          </>
        )}

        {/* ---- BOOKINGS ---- */}
        {section === 'bookings' && (
          <>
            <h2 className="sh-section-title">Bookings</h2>
            <p className="sh-section-sub">Every booking flowing through the platform</p>

            {/* Search */}
            <div className="sh-search-bar" style={{ marginBottom: 14 }}>
              <Search size={16} />
              <input
                placeholder="Search by service, customer or ID…"
                value={bookingSearch}
                onChange={e => setBookingSearch(e.target.value)}
              />
            </div>

            <div className="sh-tab-row">
              {['all', 'pending', 'assigned', 'confirmed', 'in_progress', 'completed'].map(f => (
                <div key={f} className={'sh-tab' + (bookingFilter === f ? ' active' : '')}
                  onClick={() => setBookingFilter(f)}>
                  {f === 'all' ? 'All' : STATUS_META[f].label}
                </div>
              ))}
            </div>

            {filteredBookings.length === 0
              ? <div className="sh-empty">No bookings match your filters.</div>
              : (
                <table className="sh-table">
                  <thead>
                    <tr>
                      <th>Booking</th>
                      <th>Customer</th>
                      <th>Cust Lat/Long</th>
                      <th>Provider</th>
                      <th>Provider Lat/Long</th>
                      <th>Distance</th>
                      <th>Created At</th>
                      <th>Booking Date</th>
                      <th>Booking Time</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => {
                      const p = providerFor(b, providers);
                      const pCoords = getProviderCoordinates(p);
                      const dist = pCoords ? calculateDistance(b.lat, b.lng, pCoords.lat, pCoords.lng) : '—';
                      return (
                        <tr key={b.id}>
                          <td>#{b.id} · {b.serviceName}</td>
                          <td>{b.customerName}</td>
                          <td>{b.lat && b.lng ? `${b.lat.toFixed(4)}, ${b.lng.toFixed(4)}` : '—'}</td>
                          <td>{p ? p.name : '—'}</td>
                          <td>{pCoords ? `${pCoords.lat.toFixed(4)}, ${pCoords.lng.toFixed(4)}` : '—'}</td>
                          <td>{dist}</td>
                          <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '—'}</td>
                          <td>{b.date || '—'}</td>
                          <td>{b.time || '—'}</td>
                          <td className="sh-price">₹{b.price}</td>
                          <td><StatusPill status={b.status} /></td>
                          <td>
                            {b.status === 'pending' && (
                              <button className="sh-btn sh-btn-ghost sh-btn-sm" onClick={() => assignProvider(b)}>
                                Assign
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
          </>
        )}

        {/* ---- PROVIDERS ---- */}
        {section === 'providers' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 className="sh-section-title">Service providers</h2>
                <p className="sh-section-sub">Approve new providers and monitor performance</p>
              </div>
              <button className="sh-btn sh-btn-primary" onClick={() => setShowCreateProvider(true)}>
                + Create Provider
              </button>
            </div>

            {pendingProviders.length > 0 && (
              <>
                <p style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 10 }}>Pending approval</p>
                {pendingProviders.map(p => (
                  <div className="sh-card" key={p.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div className="sh-avatar">{p.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                      <div>
                        <p className="sh-card-title">{p.name}</p>
                        <div className="sh-card-meta">{p.skill} · {p.phone}</div>
                        <div className="sh-card-meta" style={{ marginTop: 4, color: 'var(--ink-soft)' }}>
                          Username: <b>{p.username || '-'}</b> &nbsp;&bull;&nbsp; 
                          Password: <b>{p.password || '-'}</b> &nbsp;&bull;&nbsp; 
                          Price: <b>₹{p.price || p.charge || 0}</b>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="sh-btn sh-btn-primary sh-btn-sm"
                        onClick={() => updateProvider(p.id, { status: 'approved' })}>
                        <Check size={13} /> Approve
                      </button>
                      <button className="sh-btn sh-btn-danger sh-btn-sm"
                        onClick={() => updateProvider(p.id, { status: 'rejected' })}>
                        <X size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            <p style={{ fontSize: 12.5, fontWeight: 700, margin: '18px 0 10px' }}>Active providers</p>
            <table className="sh-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Active Status</th>
                  <th>Wallet Balance</th>
                  <th>Price Added</th>
                  <th>Total Attended Works</th>
                  <th>Skill 1</th>
                  <th>Skill 2</th>
                  <th>Skill 3</th>
                  <th>Skill 4</th>
                  <th>Our Rating</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {providers.filter(p => p.status === 'approved').map(p => {
                  const skills = (p.skill || '').split(',').map(s => s.trim());
                  return (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setProviderDetail(p.id)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="sh-avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
                          {(p?.name || 'P').split(' ').map(n => n ? n[0] : '').filter(Boolean).slice(0, 2).join('') || 'P'}
                        </div>
                        {p.name}
                      </div>
                    </td>
                    <td>{p.username || '-'}</td>
                    <td>{p.password || '-'}</td>
                    <td>
                      {p.is_available ? (
                        <span className="sh-pill" style={{ background: 'var(--green)22', color: 'var(--green)' }}>Active</span>
                      ) : (
                        <span className="sh-pill" style={{ background: '#f1f3f5', color: '#868e96' }}>Inactive</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>₹{(p.charge || 0).toLocaleString('en-IN')}</td>
                    <td className="sh-price">₹{p.price || 0}</td>
                    <td>{p.jobs || 0}</td>
                    <td>{skills[0] || '-'}</td>
                    <td>{skills[1] || '-'}</td>
                    <td>{skills[2] || '-'}</td>
                    <td>{skills[3] || '-'}</td>
                    <td><Star size={12} style={{ verticalAlign: -2, color: 'var(--orange)' }} /> {p.rating || '0.0'}</td>
                    <td>
                      <span className="sh-pill" style={{ background: 'var(--green)22', color: 'var(--green)' }}>
                        <ShieldCheck size={11} /> Verified
                      </span>
                    </td>
                    <td><ChevronRight size={14} color="var(--ink-soft)" /></td>
                  </tr>
                )})}
              </tbody>
            </table>
          </>
        )}

        {/* ---- SERVICES ---- */}
        {section === 'services' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 className="sh-section-title">Services</h2>
                <p className="sh-section-sub">Categories customers can book from the home screen</p>
              </div>
              <button className="sh-btn sh-btn-primary" onClick={() => setShowCreateService(true)}>
                + Create Service
              </button>
            </div>
            
            <table className="sh-table">
              <thead>
                <tr><th>Service</th><th>Category skill</th><th>Starting price</th><th>Bookings</th><th></th></tr>
              </thead>
              <tbody>
                {services.map(s => {
                  const liveCount = bookings.filter(b => b.serviceId === s.id).length;
                  return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="sh-patch" style={{ width: 30, height: 30 }}>
                          <LayoutGrid size={15} color="var(--teal)" />
                        </div>
                        {s.name}
                      </div>
                    </td>
                    <td>{s.skill}</td>
                    <td className="sh-price">₹{s.price}</td>
                    <td>{liveCount}</td>
                    <td>
                      <span className="sh-pill" style={{ background: 'var(--green)22', color: 'var(--green)' }}>Active</span>
                      <button 
                        className="sh-btn sh-btn-sm sh-btn-ghost" 
                        style={{ marginLeft: 10, padding: '4px 8px' }}
                        onClick={() => setEditingService(s)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </>
        )}

        {/* ---- USERS ---- */}
        {section === 'users' && (
          <>
            <h2 className="sh-section-title">Customers</h2>
            <p className="sh-section-sub">People booking services through Sahaya</p>
            <table className="sh-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Mail id</th>
                  <th>Password</th>
                  <th>Joined</th>
                  <th>Last Log in date</th>
                  <th>Bookings made</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="sh-avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
                          {(u?.name || 'U').split(' ').map(n => n ? n[0] : '').filter(Boolean).slice(0, 2).join('') || 'U'}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td>{u.phone}</td>
                    <td>{u.email || '-'}</td>
                    <td>{u.password || '******'}</td>
                    <td>{u.joined}</td>
                    <td>{u.lastLogin || '-'}</td>
                    <td>{u.bookingsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ---- COMMUNITY MARKETPLACE MANAGEMENT ---- */}
        {section === 'marketplace' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 className="sh-section-title">Community Marketplace</h2>
                <p className="sh-section-sub">Manage customer postings, requirements, and local items for sale</p>
              </div>
              <button className="sh-btn sh-btn-primary" onClick={() => setShowCreateMarketPost(true)}>
                + Create Market Post
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-light)' }} />
                <input
                  type="text"
                  className="sh-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search postings by title, category, or description..."
                  value={marketSearch}
                  onChange={e => setMarketSearch(e.target.value)}
                />
              </div>
              <select
                className="sh-input"
                style={{ width: 200 }}
                value={marketTypeFilter}
                onChange={e => setMarketTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="sale">🛍️ For Sale</option>
                <option value="requirement">📢 Requirement Needed</option>
              </select>
            </div>

            <table className="sh-table">
              <thead>
                <tr>
                  <th>Posting Item / Requirement</th>
                  <th>Type & Category</th>
                  <th>Price / Budget</th>
                  <th>Location</th>
                  <th>Contact Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(marketplacePostings || [])
                  .filter(p => {
                    const matchesSearch = (p.title || '').toLowerCase().includes(marketSearch.toLowerCase()) ||
                      (p.description || '').toLowerCase().includes(marketSearch.toLowerCase()) ||
                      (p.category || '').toLowerCase().includes(marketSearch.toLowerCase());
                    const matchesType = marketTypeFilter === 'all' || p.type === marketTypeFilter;
                    return matchesSearch && matchesType;
                  })
                  .map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={p.imageUrl || p.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=120&q=80'}
                            alt=""
                            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=120&q=80'; }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-light)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span
                            className="sh-pill"
                            style={{
                              background: p.type === 'requirement' ? 'rgba(255, 159, 28, 0.15)' : 'rgba(46, 196, 182, 0.15)',
                              color: p.type === 'requirement' ? '#e67e22' : '#0f9384',
                              fontWeight: 700,
                            }}
                          >
                            {p.type === 'requirement' ? '📢 Requirement' : '🛍️ For Sale'}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{p.category}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--teal-dark)' }}>
                        ₹{(p.price || 0).toLocaleString('en-IN')}
                      </td>
                      <td>{p.locationName || p.location_name || 'Calicut'}</td>
                      <td>{p.contactPhone || p.contact_phone || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="sh-btn sh-btn-sm sh-btn-ghost"
                            style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            onClick={() => setEditingMarketPost(p)}
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            className="sh-btn sh-btn-sm"
                            style={{ padding: '6px 10px', background: '#ffe3e3', color: '#e03131', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            onClick={() => handleDeleteMarketPost(p.id)}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      {/* Create Provider Modal */}
      {showCreateProvider && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="sh-card" style={{ width: '100%', maxWidth: 450, padding: 24, animation: 'fadeSlideUp 0.25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Create New Provider</h3>
              <button className="sh-btn sh-btn-ghost sh-btn-sm" style={{ padding: 4 }} onClick={() => setShowCreateProvider(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProvider} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Full Name</label>
                  <input required type="text" className="sh-input" value={newProvider.name} onChange={e => setNewProvider({...newProvider, name: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Username</label>
                  <input required type="text" className="sh-input" value={newProvider.username} onChange={e => setNewProvider({...newProvider, username: e.target.value})} />
                  {newProvider.username && (
                    <span style={{ fontSize: 11, color: providers.some(p => p.username === newProvider.username) ? 'red' : 'green' }}>
                      {providers.some(p => p.username === newProvider.username) ? 'Username unavailable' : 'Username available'}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Password</label>
                  <input required type="text" className="sh-input" value={newProvider.password} onChange={e => setNewProvider({...newProvider, password: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Email Address</label>
                  <input required type="email" className="sh-input" value={newProvider.email} onChange={e => setNewProvider({...newProvider, email: e.target.value})} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Phone Number</label>
                  <input required type="tel" className="sh-input" value={newProvider.phone} onChange={e => setNewProvider({...newProvider, phone: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Aadhaar Number</label>
                  <input required type="text" className="sh-input" placeholder="XXXX XXXX XXXX" value={newProvider.aadhaar_number} onChange={e => setNewProvider({...newProvider, aadhaar_number: e.target.value})} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Primary Skill</label>
                  <select className="sh-input" value={newProvider.skill} onChange={e => setNewProvider({...newProvider, skill: e.target.value})}>
                    {services && services.length > 0 ? [...new Set(services.map(s => s.skill))].map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    )) : <option value="House Help">House Help</option>}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Base Price (₹)</label>
                  <input required type="number" className="sh-input" placeholder="e.g. 500" value={newProvider.price} onChange={e => setNewProvider({...newProvider, price: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Physical Address</label>
                <textarea required className="sh-input" style={{ minHeight: 60, resize: 'vertical' }} value={newProvider.address} onChange={e => setNewProvider({...newProvider, address: e.target.value})} />
              </div>

              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="sh-btn sh-btn-ghost" onClick={() => setShowCreateProvider(false)}>Cancel</button>
                <button type="submit" className="sh-btn sh-btn-primary">Save Provider</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateService && (
        <div className="sh-modal-backdrop">
          <div className="sh-modal">
            <h2 className="sh-section-title">Create New Service</h2>
            <form onSubmit={handleCreateService} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              <input className="sh-input" placeholder="Service Name (e.g. Sofa Cleaning)" required value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
              <input className="sh-input" placeholder="Price (₹)" type="number" required value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
              <input className="sh-input" placeholder="Category Skill (e.g. Cleaning)" required value={newService.skill} onChange={e => setNewService({...newService, skill: e.target.value})} />
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="submit" className="sh-btn sh-btn-primary">Add Service</button>
                <button type="button" className="sh-btn" onClick={() => setShowCreateService(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingService && (
        <div className="sh-modal-backdrop">
          <div className="sh-modal">
            <h2 className="sh-section-title">Edit Service</h2>
            <form onSubmit={handleUpdateService} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              <input className="sh-input" placeholder="Service Name (e.g. Sofa Cleaning)" required value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} />
              <input className="sh-input" placeholder="Price (₹)" type="number" required value={editingService.price} onChange={e => setEditingService({...editingService, price: e.target.value})} />
              <input className="sh-input" placeholder="Category Skill (e.g. Cleaning)" required value={editingService.skill} onChange={e => setEditingService({...editingService, skill: e.target.value})} />
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="submit" className="sh-btn sh-btn-primary">Save Changes</button>
                <button type="button" className="sh-btn" onClick={() => setEditingService(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Market Post Modal */}
      {showCreateMarketPost && (
        <div className="sh-modal-backdrop">
          <div className="sh-modal" style={{ maxWidth: 500 }}>
            <h2 className="sh-section-title">Create Marketplace Posting</h2>
            <p className="sh-section-sub" style={{ marginBottom: 16 }}>Publish a local sale, requirement, or official community offer</p>
            <form onSubmit={handleCreateMarketPost} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Posting Type</label>
                  <select
                    className="sh-input"
                    value={newMarketPost.type}
                    onChange={e => setNewMarketPost({ ...newMarketPost, type: e.target.value, category: e.target.value === 'requirement' ? 'Requirements' : 'Local Sales' })}
                  >
                    <option value="sale">🛍️ For Sale</option>
                    <option value="requirement">📢 Requirement Needed</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Category</label>
                  <select
                    className="sh-input"
                    value={newMarketPost.category}
                    onChange={e => setNewMarketPost({ ...newMarketPost, category: e.target.value })}
                  >
                    <option value="Local Sales">Local Sales</option>
                    <option value="Requirements">Requirements</option>
                    <option value="Used Goods">Used Goods</option>
                    <option value="Services Needed">Services Needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Title</label>
                <input
                  className="sh-input"
                  placeholder="Posting Title (e.g. Second Hand Teakwood Sofa)"
                  required
                  value={newMarketPost.title}
                  onChange={e => setNewMarketPost({ ...newMarketPost, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Price / Budget (₹)</label>
                  <input
                    className="sh-input"
                    type="number"
                    placeholder="e.g. 2500"
                    required
                    value={newMarketPost.price}
                    onChange={e => setNewMarketPost({ ...newMarketPost, price: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Contact Phone</label>
                  <input
                    className="sh-input"
                    placeholder="+91 98765 43210"
                    required
                    value={newMarketPost.contact_phone}
                    onChange={e => setNewMarketPost({ ...newMarketPost, contact_phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Location Name</label>
                <input
                  className="sh-input"
                  placeholder="e.g. Mavoor Road, Calicut"
                  required
                  value={newMarketPost.location_name}
                  onChange={e => setNewMarketPost({ ...newMarketPost, location_name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Photo Image URL (Optional)</label>
                <input
                  className="sh-input"
                  placeholder="https://images.unsplash.com/..."
                  value={newMarketPost.image_url}
                  onChange={e => setNewMarketPost({ ...newMarketPost, image_url: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Description</label>
                <textarea
                  className="sh-input"
                  rows={3}
                  placeholder="Provide complete details about this item or service requirement..."
                  value={newMarketPost.description}
                  onChange={e => setNewMarketPost({ ...newMarketPost, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="submit" className="sh-btn sh-btn-primary">Publish Post</button>
                <button type="button" className="sh-btn" onClick={() => setShowCreateMarketPost(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Market Post Modal */}
      {editingMarketPost && (
        <div className="sh-modal-backdrop">
          <div className="sh-modal" style={{ maxWidth: 500 }}>
            <h2 className="sh-section-title">Edit Marketplace Posting</h2>
            <p className="sh-section-sub" style={{ marginBottom: 16 }}>Update posting details, price, location or status</p>
            <form onSubmit={handleUpdateMarketPost} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Posting Type</label>
                  <select
                    className="sh-input"
                    value={editingMarketPost.type || 'sale'}
                    onChange={e => setEditingMarketPost({ ...editingMarketPost, type: e.target.value })}
                  >
                    <option value="sale">🛍️ For Sale</option>
                    <option value="requirement">📢 Requirement Needed</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Category</label>
                  <select
                    className="sh-input"
                    value={editingMarketPost.category || 'Local Sales'}
                    onChange={e => setEditingMarketPost({ ...editingMarketPost, category: e.target.value })}
                  >
                    <option value="Local Sales">Local Sales</option>
                    <option value="Requirements">Requirements</option>
                    <option value="Used Goods">Used Goods</option>
                    <option value="Services Needed">Services Needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Title</label>
                <input
                  className="sh-input"
                  required
                  value={editingMarketPost.title || ''}
                  onChange={e => setEditingMarketPost({ ...editingMarketPost, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Price / Budget (₹)</label>
                  <input
                    className="sh-input"
                    type="number"
                    required
                    value={editingMarketPost.price || ''}
                    onChange={e => setEditingMarketPost({ ...editingMarketPost, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Contact Phone</label>
                  <input
                    className="sh-input"
                    required
                    value={editingMarketPost.contactPhone || editingMarketPost.contact_phone || ''}
                    onChange={e => setEditingMarketPost({ ...editingMarketPost, contact_phone: e.target.value, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Location Name</label>
                <input
                  className="sh-input"
                  required
                  value={editingMarketPost.locationName || editingMarketPost.location_name || ''}
                  onChange={e => setEditingMarketPost({ ...editingMarketPost, location_name: e.target.value, locationName: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Photo Image URL</label>
                <input
                  className="sh-input"
                  value={editingMarketPost.imageUrl || editingMarketPost.image_url || ''}
                  onChange={e => setEditingMarketPost({ ...editingMarketPost, image_url: e.target.value, imageUrl: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Description</label>
                <textarea
                  className="sh-input"
                  rows={3}
                  value={editingMarketPost.description || ''}
                  onChange={e => setEditingMarketPost({ ...editingMarketPost, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="submit" className="sh-btn sh-btn-primary">Save Changes</button>
                <button type="button" className="sh-btn" onClick={() => setEditingMarketPost(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Sidebar({ section, setSection, onExit }) {
  return (
    <div className="sh-sidebar">
      <div className="sh-brand-row">
        <div className="sh-patch" style={{ background: 'var(--amber)', border: 'none', width: 32, height: 32 }}>
          <Shield size={16} color="var(--teal-dark)" />
        </div>
        <b>Sahaya Admin</b>
      </div>
      {SIDEBAR_ITEMS.map(it => (
        <div
          key={it.key}
          className={'sh-side-item' + (section === it.key ? ' active' : '')}
          onClick={() => setSection(it.key)}
        >
          <it.icon size={16} /> {it.label}
        </div>
      ))}
      <div className="sh-side-footer">
        <div className="sh-side-item" onClick={onExit}><LogOut size={16} /> Exit demo</div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, delta, sparkData, sparkColor }) {
  return (
    <div className="sh-kpi-card">
      <div className="sh-kpi-label">{icon} {label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="sh-kpi-value">{value}</div>
          <div className="sh-kpi-delta">{delta}</div>
        </div>
        {sparkData && (
          <Sparkline data={sparkData} color={sparkColor} />
        )}
      </div>
    </div>
  );
}

function Sparkline({ data, color }) {
  const w = 70, h = 32;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', opacity: 0.7 }}>
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" points={pts} />
      <circle cx={pts.split(' ').at(-1).split(',')[0]} cy={pts.split(' ').at(-1).split(',')[1]}
        r="3" fill={color} />
    </svg>
  );
}
