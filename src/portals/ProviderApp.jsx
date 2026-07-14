import React, { useState } from 'react';
import {
  LayoutGrid, Bell, ClipboardList, UserCircle,
  Star, Wallet, CheckCircle, MapPin, Calendar, Phone,
  PlayCircle, LogOut, Check, X, ShieldCheck, ChevronRight,
  Briefcase, TrendingUp
} from 'lucide-react';

import PhoneFrame  from '../components/PhoneFrame.jsx';
import LoginScreen from '../components/LoginScreen.jsx';
import StatusPill  from '../components/StatusPill.jsx';
import { serviceFor } from '../data/mock.js';

/* ---------- Mini bar chart ---------- */
function EarningsChart({ data }) {
  const max = Math.max(...data.map(d => d.v), 1);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60, marginTop: 12 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{
            width: '100%',
            height: Math.max(4, (d.v / max) * 52),
            background: i === data.length - 1 ? 'var(--amber)' : 'var(--teal-tint)',
            borderRadius: 4,
            border: i === data.length - 1 ? 'none' : '1px solid var(--border)',
            transition: 'height .4s ease',
          }} />
          <span style={{ fontSize: 9, color: 'var(--ink-soft)' }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}

const WEEKLY_EARNINGS = [
  { l: 'M', v: 1200 }, { l: 'T', v: 800 },  { l: 'W', v: 2100 },
  { l: 'T', v: 650 },  { l: 'F', v: 1800 }, { l: 'S', v: 3200 }, { l: 'S', v: 450 },
];

export default function ProviderApp({ providers, bookings, updateBooking, updateProvider, addProvider, services, onExit }) {
  const [authedUserId, setAuthedUserId] = useState(() => localStorage.getItem('sh_provider_id') || null);
  const [authMode, setAuthMode] = useState('login');
  
  // Login states
  const [loginUser, setLoginUser] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loginErr, setLoginErr] = useState('');

  // Signup states
  const [newProvider, setNewProvider] = useState({ name: '', phone: '', email: '', address: '', aadhaar_number: '', skill: 'House Help', price: '', username: '', password: '' });

  const [tab,       setTab]       = useState('dashboard');
  const [available, setAvailable] = useState(true);
  const [jobFilter, setJobFilter] = useState('active');

  const me = authedUserId ? providers.find(p => p.id === parseInt(authedUserId)) : null;

  function handleLogin(e) {
    e.preventDefault();
    setLoginErr('');
    const match = providers.find(p => p.username === loginUser && p.password === loginPwd);
    if (match) {
      localStorage.setItem('sh_provider_id', match.id);
      setAuthedUserId(match.id);
    } else {
      setLoginErr('Invalid username or password');
    }
  }

  function handleSignup(e) {
    e.preventDefault();
    setLoginErr('');
    if (providers.some(p => p.username === newProvider.username)) {
      setLoginErr('Username is already taken');
      return;
    }
    addProvider(newProvider);
    // Since addProvider is async and updates state later, we can't instantly log them in. 
    // We'll switch to login mode and ask them to log in.
    setAuthMode('login');
    setLoginUser(newProvider.username);
    setLoginPwd(newProvider.password);
  }

  function handleLogOut() {
    localStorage.removeItem('sh_provider_id');
    setAuthedUserId(null);
  }

  if (!me) {
    return (
      <PhoneFrame>
        <div style={{ padding: '20px 4px' }}>
          <div className="sh-patch lg teal" style={{ marginBottom: 16 }}>
            <Briefcase size={26} color="var(--teal)" />
          </div>
          <h2 className="sh-h1">{authMode === 'login' ? 'Log in to Partner app' : 'Become a Partner'}</h2>
          <p className="sh-sub">
            {authMode === 'login' ? 'Accept jobs, track earnings and manage your schedule.' : 'Register to start accepting jobs on Sahaya.'}
          </p>
          
          {loginErr && <div style={{ color: 'red', fontSize: 13, marginBottom: 10, fontWeight: 600 }}>{loginErr}</div>}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input required type="text" className="sh-input" placeholder="Username" value={loginUser} onChange={e => setLoginUser(e.target.value)} />
              <input required type="password" className="sh-input" placeholder="Password" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} />
              <button type="submit" className="sh-btn sh-btn-primary" style={{ marginTop: 6 }}>Log in</button>
              <div style={{ marginTop: 14, textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Don't have an account? </span>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer', padding: 0 }} onClick={() => setAuthMode('signup')}>Sign up</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input required type="text" className="sh-input" placeholder="Full Name" value={newProvider.name} onChange={e => setNewProvider({...newProvider, name: e.target.value})} style={{ flex: 1 }} />
                <input required type="text" className="sh-input" placeholder="Username" value={newProvider.username} onChange={e => setNewProvider({...newProvider, username: e.target.value})} style={{ flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input required type="tel" className="sh-input" placeholder="Phone Number" value={newProvider.phone} onChange={e => setNewProvider({...newProvider, phone: e.target.value})} style={{ flex: 1 }} />
                <input required type="password" className="sh-input" placeholder="Password" value={newProvider.password} onChange={e => setNewProvider({...newProvider, password: e.target.value})} style={{ flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input required type="email" className="sh-input" placeholder="Email Address" value={newProvider.email} onChange={e => setNewProvider({...newProvider, email: e.target.value})} style={{ flex: 1 }} />
                <input required type="number" className="sh-input" placeholder="Base Price (₹)" value={newProvider.price} onChange={e => setNewProvider({...newProvider, price: e.target.value})} style={{ flex: 1 }} />
              </div>
              <select className="sh-input" value={newProvider.skill} onChange={e => setNewProvider({...newProvider, skill: e.target.value})}>
                {services && services.length > 0 ? [...new Set(services.map(s => s.skill))].map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                )) : <option value="House Help">House Help</option>}
              </select>
              <textarea required className="sh-input" placeholder="Physical Address" style={{ minHeight: 50, resize: 'vertical' }} value={newProvider.address} onChange={e => setNewProvider({...newProvider, address: e.target.value})} />
              <button type="submit" className="sh-btn sh-btn-primary" style={{ marginTop: 6 }}>Sign up</button>
              <div style={{ marginTop: 14, textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Already have an account? </span>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer', padding: 0 }} onClick={() => setAuthMode('login')}>Log in</button>
              </div>
            </form>
          )}

          <div style={{ marginTop: 20 }}>
            <button type="button" className="sh-btn sh-btn-ghost" onClick={onExit}>
              <X size={15} /> Exit
            </button>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  const requests   = bookings.filter(b => b.providerId === me.id && b.status === 'assigned');
  const activeJobs = bookings.filter(b => b.providerId === me.id && (b.status === 'confirmed' || b.status === 'in_progress'));
  const history    = bookings.filter(b => b.providerId === me.id && b.status === 'completed');

  const nav = [
    { key: 'dashboard', label: 'Home',     icon: LayoutGrid },
    { key: 'requests',  label: 'Requests', icon: Bell, badge: requests.length > 0 ? requests.length : null },
    { key: 'jobs',      label: 'Jobs',     icon: ClipboardList },
    { key: 'profile',   label: 'Profile',  icon: UserCircle },
  ];

  const titleMap = {
    dashboard: 'Provider home',
    requests:  'Job requests',
    jobs:      'My jobs',
    profile:   'Profile',
  };

  return (
    <PhoneFrame title={titleMap[tab]} nav={nav} active={tab} onNav={setTab}>

      {/* ---- DASHBOARD ---- */}
      {tab === 'dashboard' && (
        <>
          {/* Availability toggle */}
          <div className="sh-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="sh-avatar">RK</div>
              <div>
                <b style={{ fontSize: 13.5, fontFamily: "'Space Grotesk',sans-serif" }}>{me.name}</b>
                <div className="sh-card-meta"><Star size={11} /> {me.rating} · {me.skill}</div>
              </div>
            </div>
            <div
              className={'sh-toggle' + (available ? ' on' : '')}
              onClick={() => setAvailable(!available)}
            />
          </div>
          <p className="sh-sub" style={{ marginTop: 2 }}>
            {available
              ? "You're online and visible for new job requests."
              : "You're offline — new requests are paused."}
          </p>

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 0' }}>
            <div className="sh-card" style={{ margin: 0 }}>
              <span className="sh-card-meta"><Wallet size={13} /> Earnings</span>
              <div className="sh-price" style={{ fontSize: 19, marginTop: 4 }}>
                ₹{me.earnings.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="sh-card" style={{ margin: 0 }}>
              <span className="sh-card-meta"><CheckCircle size={13} /> Jobs done</span>
              <div className="sh-price" style={{ fontSize: 19, marginTop: 4 }}>{me.jobs}</div>
            </div>
          </div>

          {/* Weekly earnings chart */}
          <div className="sh-card" style={{ margin: '0 0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <TrendingUp size={13} color="var(--ink-soft)" />
              <span style={{ fontSize: 11.5, color: 'var(--ink-soft)', fontWeight: 600 }}>This week's earnings</span>
            </div>
            <EarningsChart data={WEEKLY_EARNINGS} />
          </div>

          {/* New requests preview */}
          <p className="sh-sub" style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>New requests</p>
          {requests.length === 0 && (
            <div className="sh-empty"><Bell size={26} /><p>No new requests right now.</p></div>
          )}
          {requests.slice(0, 2).map(b => (
            <div className="sh-card" key={b.id}>
              <p className="sh-card-title">{b.serviceName} · ₹{b.price}</p>
              <div className="sh-card-meta"><MapPin size={12} /> {b.address}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="sh-btn sh-btn-primary sh-btn-sm" style={{ flex: 1 }}
                  onClick={() => updateBooking(b.id, { status: 'confirmed' })}>
                  <Check size={14} /> Accept
                </button>
                <button className="sh-btn sh-btn-danger sh-btn-sm" style={{ flex: 1 }}
                  onClick={() => updateBooking(b.id, { status: 'pending', providerId: null })}>
                  <X size={14} /> Decline
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ---- REQUESTS ---- */}
      {tab === 'requests' && (
        <>
          {requests.length === 0 && (
            <div className="sh-empty"><Bell size={30} /><p>You're all caught up — no pending requests.</p></div>
          )}
          {requests.map(b => (
            <div className="sh-card" key={b.id}>
              <div className="sh-card-row">
                <div className="sh-patch">
                  {React.createElement(serviceFor(b)?.icon || 'span', { size: 19, color: 'var(--teal)' })}
                </div>
                <div style={{ flex: 1 }}>
                  <p className="sh-card-title">{b.serviceName} · ₹{b.price}</p>
                  <div className="sh-card-meta"><Calendar size={12} /> {b.date}, {b.time}</div>
                  <div className="sh-card-meta"><MapPin size={12} /> {b.address}</div>
                  {b.notes && <div className="sh-card-meta">"{b.notes}"</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="sh-btn sh-btn-primary sh-btn-sm" style={{ flex: 1 }}
                  onClick={() => updateBooking(b.id, { status: 'confirmed' })}>
                  <Check size={14} /> Accept
                </button>
                <button className="sh-btn sh-btn-danger sh-btn-sm" style={{ flex: 1 }}
                  onClick={() => updateBooking(b.id, { status: 'pending', providerId: null })}>
                  <X size={14} /> Decline
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ---- JOBS ---- */}
      {tab === 'jobs' && (
        <>
          {/* Filter tabs */}
          <div className="sh-tab-row">
            {['active', 'history'].map(f => (
              <div key={f} className={'sh-tab' + (jobFilter === f ? ' active' : '')} onClick={() => setJobFilter(f)}>
                {f === 'active' ? `Active (${activeJobs.length})` : `History (${history.length})`}
              </div>
            ))}
          </div>

          {jobFilter === 'active' && (
            <>
              {activeJobs.length === 0 && (
                <div className="sh-empty"><ClipboardList size={30} /><p>No active jobs. Accepted requests will appear here.</p></div>
              )}
              {activeJobs.map(b => (
                <div className="sh-card" key={b.id}>
                  <p className="sh-card-title">{b.serviceName} · ₹{b.price}</p>
                  <div className="sh-card-meta"><Calendar size={12} /> {b.date}, {b.time}</div>
                  <div className="sh-card-meta"><MapPin size={12} /> {b.address}</div>
                  <div className="sh-card-meta"><Phone size={12} /> {b.customerName} · {b.phone}</div>
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <StatusPill status={b.status} />
                    {b.status === 'confirmed' && (
                      <button className="sh-btn sh-btn-amber sh-btn-sm"
                        onClick={() => updateBooking(b.id, { status: 'in_progress' })}>
                        <PlayCircle size={14} /> Start job
                      </button>
                    )}
                    {b.status === 'in_progress' && (
                      <button className="sh-btn sh-btn-primary sh-btn-sm"
                        onClick={() => {
                          updateBooking(b.id, { status: 'completed' });
                          updateProvider(me.id, { jobs: me.jobs + 1, earnings: me.earnings + b.price });
                        }}>
                        <CheckCircle size={14} /> Mark complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {jobFilter === 'history' && (
            <>
              {history.length === 0 && (
                <div className="sh-empty"><ClipboardList size={30} /><p>No completed jobs yet.</p></div>
              )}
              {/* Summary strip */}
              {history.length > 0 && (
                <div className="sh-card" style={{ margin: '0 0 12px', background: 'var(--teal-tint)', border: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teal)' }}>Total from {history.length} completed</span>
                    <span className="sh-price" style={{ color: 'var(--teal)' }}>
                      ₹{history.reduce((s, b) => s + b.price, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}
              {history.map(b => (
                <div className="sh-card" key={b.id} style={{ opacity: 0.8 }}>
                  <p className="sh-card-title">{b.serviceName} · ₹{b.price}</p>
                  <div className="sh-card-meta"><Calendar size={12} /> {b.date}</div>
                  <div style={{ marginTop: 6 }}><StatusPill status="completed" /></div>
                </div>
              ))}
            </>
          )}
        </>
      )}

      {/* ---- PROFILE ---- */}
      {tab === 'profile' && (
        <>
          <div style={{ textAlign: 'center', margin: '10px 0 22px' }}>
            <div className="sh-avatar" style={{ width: 60, height: 60, fontSize: 20, margin: '0 auto 10px' }}>{me.name.slice(0, 2).toUpperCase()}</div>
            <h2 className="sh-h1" style={{ margin: 0 }}>{me.name}</h2>
            <p className="sh-sub">{me.skill} specialist</p>
            <span className="sh-pill" style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}>
              <ShieldCheck size={12} /> Verified partner
            </span>
          </div>
          {['Bank & payouts', 'Documents & verification', 'Working hours', 'Help & support'].map(t => (
            <div className="sh-card" key={t}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t}</span>
              <ChevronRight size={16} color="var(--ink-soft)" />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className="sh-btn sh-btn-ghost" style={{ flex: 1 }} onClick={handleLogOut}>
              <LogOut size={15} /> Log out
            </button>
            <button className="sh-btn sh-btn-danger" style={{ flex: 1 }} onClick={onExit}>
              <X size={15} /> Exit app
            </button>
          </div>
        </>
      )}
    </PhoneFrame>
  );
}
