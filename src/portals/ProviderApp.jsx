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

export default function ProviderApp({ providers, bookings, updateBooking, updateProvider, onExit }) {
  const [authed,    setAuthed]    = useState(false);
  const [tab,       setTab]       = useState('dashboard');
  const [available, setAvailable] = useState(true);
  const [jobFilter, setJobFilter] = useState('active');

  const me = providers.find(p => p.id === 1); // Rajesh Kumar – Electrical

  if (!authed) {
    return (
      <PhoneFrame>
        <LoginScreen
          roleLabel="Provider app"
          RoleIcon={Briefcase}
          hint="Accept jobs, track earnings and manage your schedule."
          onLogin={() => setAuthed(true)}
          onExit={onExit}
        />
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
            <div className="sh-avatar" style={{ width: 60, height: 60, fontSize: 20, margin: '0 auto 10px' }}>RK</div>
            <h2 className="sh-h1" style={{ margin: 0 }}>{me.name}</h2>
            <p className="sh-sub">{me.skill} specialist</p>
            <span className="sh-pill" style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}>
              <ShieldCheck size={12} /> Verified provider
            </span>
          </div>
          {['Bank & payouts', 'Documents & verification', 'Working hours', 'Help & support'].map(t => (
            <div className="sh-card" key={t}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t}</span>
              <ChevronRight size={16} color="var(--ink-soft)" />
            </div>
          ))}
          <button className="sh-btn sh-btn-danger" style={{ marginTop: 10 }} onClick={onExit}>
            <LogOut size={15} /> Exit demo
          </button>
        </>
      )}
    </PhoneFrame>
  );
}
