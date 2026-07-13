import React, { useState, useMemo } from 'react';
import {
  BarChart3, ClipboardList, LayoutGrid, Users, LogOut,
  Shield, Wallet, Briefcase, MapPin, Check, X,
  ShieldCheck, Star, Search, ChevronRight, ArrowLeft
} from 'lucide-react';

import LoginScreen from '../components/LoginScreen.jsx';
import StatusPill  from '../components/StatusPill.jsx';
import { SERVICES, STATUS_META, serviceFor, providerFor } from '../data/mock.js';

const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Dashboard',       icon: BarChart3 },
  { key: 'bookings',  label: 'Bookings',         icon: ClipboardList },
  { key: 'providers', label: 'Providers',        icon: Briefcase },
  { key: 'services',  label: 'Services',         icon: LayoutGrid },
  { key: 'users',     label: 'Users',            icon: Users },
];



export default function AdminApp({ providers, bookings, users, updateBooking, updateProvider, addProvider, onExit }) {
  const [authed,         setAuthed]         = useState(false);
  const [section,        setSection]        = useState('dashboard');
  const [bookingFilter,  setBookingFilter]  = useState('all');
  const [bookingSearch,  setBookingSearch]  = useState('');
  const [providerDetail, setProviderDetail] = useState(null);
  const [showCreateProvider, setShowCreateProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', phone: '', email: '', address: '', aadhaar_number: '', skill: 'House Help' });

  function handleCreateProvider(e) {
    e.preventDefault();
    addProvider(newProvider);
    setShowCreateProvider(false);
    setNewProvider({ name: '', phone: '', email: '', address: '', aadhaar_number: '', skill: 'House Help' });
  }

  /* ---- All derived values & hooks must come BEFORE any early returns ---- */
  const revenue          = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.price, 0);
  const pendingCount     = bookings.filter(b => b.status === 'pending').length;
  const activeProviders  = providers.filter(p => p.status === 'approved').length;
  const pendingProviders = providers.filter(p => p.status === 'pending');

  const filteredBookings = useMemo(() => {
    let list = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter);
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      list = list.filter(b =>
        b.serviceName.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        String(b.id).includes(q)
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
          RoleIcon={Shield}
          hint="Oversee bookings, providers and platform performance."
          onLogin={() => setAuthed(true)}
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

          {/* Provider KPIs */}
          <div className="sh-kpi-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
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
              <div className="sh-kpi-value">₹{p.earnings.toLocaleString('en-IN')}</div>
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
                      <th>Booking</th><th>Customer</th><th>Provider</th>
                      <th>Date</th><th>Amount</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => {
                      const p = providerFor(b, providers);
                      return (
                        <tr key={b.id}>
                          <td>#{b.id} · {b.serviceName}</td>
                          <td>{b.customerName}</td>
                          <td>{p ? p.name : '—'}</td>
                          <td>{b.date}</td>
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
                  <th>Provider</th><th>Skill</th><th>Rating</th>
                  <th>Jobs done</th><th>Earnings</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {providers.filter(p => p.status === 'approved').map(p => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setProviderDetail(p.id)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="sh-avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
                          {p.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        {p.name}
                      </div>
                    </td>
                    <td>{p.skill}</td>
                    <td><Star size={12} style={{ verticalAlign: -2 }} /> {p.rating}</td>
                    <td>{p.jobs}</td>
                    <td className="sh-price">₹{p.earnings.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="sh-pill" style={{ background: 'var(--green)22', color: 'var(--green)' }}>
                        <ShieldCheck size={11} /> Verified
                      </span>
                    </td>
                    <td><ChevronRight size={14} color="var(--ink-soft)" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ---- SERVICES ---- */}
        {section === 'services' && (
          <>
            <h2 className="sh-section-title">Services</h2>
            <p className="sh-section-sub">Categories customers can book from the home screen</p>
            <table className="sh-table">
              <thead>
                <tr><th>Service</th><th>Category skill</th><th>Starting price</th><th>Bookings</th><th></th></tr>
              </thead>
              <tbody>
                {SERVICES.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="sh-patch" style={{ width: 30, height: 30 }}>
                          <s.icon size={15} color="var(--teal)" />
                        </div>
                        {s.name}
                      </div>
                    </td>
                    <td>{s.skill}</td>
                    <td className="sh-price">₹{s.price}</td>
                    <td>{s.bookings}</td>
                    <td>
                      <span className="sh-pill" style={{ background: 'var(--green)22', color: 'var(--green)' }}>Active</span>
                    </td>
                  </tr>
                ))}
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
                <tr><th>Customer</th><th>Phone</th><th>Joined</th><th>Bookings made</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="sh-avatar" style={{ width: 26, height: 26, fontSize: 10 }}>
                          {u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td>{u.phone}</td>
                    <td>{u.joined}</td>
                    <td>{u.bookingsCount}</td>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Full Name</label>
                <input required type="text" className="sh-input" value={newProvider.name} onChange={e => setNewProvider({...newProvider, name: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Phone Number</label>
                  <input required type="tel" className="sh-input" value={newProvider.phone} onChange={e => setNewProvider({...newProvider, phone: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Primary Skill</label>
                  <select className="sh-input" value={newProvider.skill} onChange={e => setNewProvider({...newProvider, skill: e.target.value})}>
                    {[...new Set(SERVICES.map(s => s.skill))].map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Email Address</label>
                <input required type="email" className="sh-input" value={newProvider.email} onChange={e => setNewProvider({...newProvider, email: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Aadhaar Number</label>
                <input required type="text" className="sh-input" placeholder="XXXX XXXX XXXX" value={newProvider.aadhaar_number} onChange={e => setNewProvider({...newProvider, aadhaar_number: e.target.value})} />
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Full Name</label>
                <input required type="text" className="sh-input" value={newProvider.name} onChange={e => setNewProvider({...newProvider, name: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Phone Number</label>
                  <input required type="tel" className="sh-input" value={newProvider.phone} onChange={e => setNewProvider({...newProvider, phone: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Primary Skill</label>
                  <select className="sh-input" value={newProvider.skill} onChange={e => setNewProvider({...newProvider, skill: e.target.value})}>
                    {[...new Set(SERVICES.map(s => s.skill))].map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Email Address</label>
                <input required type="email" className="sh-input" value={newProvider.email} onChange={e => setNewProvider({...newProvider, email: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-light)' }}>Aadhaar Number</label>
                <input required type="text" className="sh-input" placeholder="XXXX XXXX XXXX" value={newProvider.aadhaar_number} onChange={e => setNewProvider({...newProvider, aadhaar_number: e.target.value})} />
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
