import React, { useState } from 'react';
import {
  LayoutGrid, ClipboardList, UserCircle, Bell, Search,
  Calendar, Clock, MapPin, Star, ArrowLeft, CheckCircle,
  ChevronRight, LogOut, Check, X
} from 'lucide-react';
import { Home as HomeIcon } from 'lucide-react';

import PhoneFrame   from '../components/PhoneFrame.jsx';
import LoginScreen  from '../components/LoginScreen.jsx';
import StatusPill   from '../components/StatusPill.jsx';
import Field        from '../components/Field.jsx';
import { supabase } from '../lib/supabase.js';

const TIMELINE_STEPS = ['pending', 'assigned', 'confirmed', 'in_progress', 'completed'];

/* ---------- Rating Modal ---------- */
function RatingModal({ booking, onSubmit, onClose }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 999, padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 360,
        animation: 'fadeSlideUp .25s ease',
      }}>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", margin: '0 0 4px', fontSize: 17 }}>
          Rate your experience
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, margin: '0 0 20px' }}>
          {booking.serviceName} on {booking.date}
        </p>
        <div className="sh-stars">
          {[1,2,3,4,5].map(n => (
            <span
              key={n}
              className="sh-star"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setStars(n)}
            >
              <Star
                size={30}
                fill={(hover || stars) >= n ? 'var(--amber)' : 'none'}
                color={(hover || stars) >= n ? 'var(--amber)' : 'var(--border)'}
              />
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="sh-btn sh-btn-ghost sh-btn-sm" style={{ flex: 1 }} onClick={onClose}>
            <X size={14} /> Skip
          </button>
          <button
            className="sh-btn sh-btn-amber sh-btn-sm"
            style={{ flex: 2 }}
            onClick={() => { if (stars > 0) onSubmit(stars); }}
            disabled={stars === 0}
          >
            <Star size={14} /> Submit rating
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main UserApp ---------- */
export default function UserApp({ bookings, addBooking, updateBooking, services, session, onExit }) {
  const [screen,   setScreen]   = useState('home');
  const [tab,      setTab]      = useState('home');
  const [service,  setService]  = useState(null);
  const [query,    setQuery]    = useState('');
  const [bookingForm, setBookingForm] = useState({ date: '13 Jul', time: '10:00 AM', address: '', notes: '' });
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [ratingBookingId,   setRatingBookingId]   = useState(null);
  const [notifications, setNotifications]         = useState([
    { id: 1, text: 'Your Electrical booking is confirmed!', time: '10 min ago', read: false },
    { id: 2, text: 'Rajesh Kumar accepted your job.',       time: '1 hr ago',   read: false },
  ]);

  const userEmail = session?.user?.email;
  const userName  = userEmail ? userEmail.split('@')[0] : '';
  const myBookings    = bookings.filter(b => b.customerName === userEmail).sort((a, b) => b.id - a.id);
  const unreadCount   = notifications.filter(n => !n.read).length;
  const filteredSvcs  = services.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
  const ratingBooking = ratingBookingId ? bookings.find(b => b.id === ratingBookingId) : null;

  function goTab(key) { setTab(key); setScreen(key); }

  function openService(s) {
    setService(s);
    setBookingForm({ date: '13 Jul', time: '10:00 AM', address: '', notes: '' });
    setScreen('detail');
  }

  function confirmBooking() {
    addBooking({
      serviceId:    service.id,
      serviceName:  service.name,
      customerName: userEmail,
      phone:        'N/A', // Collected later or via profile
      address:      bookingForm.address || 'My Address',
      date:         bookingForm.date,
      time:         bookingForm.time,
      price:        service.price,
      notes:        bookingForm.notes,
      status:       'pending',
      providerId:   null,
      createdAt:    'Just now',
    });
    setScreen('confirmed');
  }

  function cancelBooking(id) {
    updateBooking(id, { status: 'cancelled' });
    setScreen('bookings');
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const handleSendOtp = async (email) => {
    return supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });
  };

  const handleVerifyOtp = async (email, token) => {
    return supabase.auth.verifyOtp({
      email,
      token,
      type: 'magiclink' // Verify OTP code sent via magiclink
    });
  };

  if (!session) {
    return (
      <PhoneFrame title={null}>
        <LoginScreen
          roleLabel="Sahaya Customer"
          icon={HomeIcon}
          hint="Book trusted help for anything at home."
          useOtp={true}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          onExit={onExit}
        />
      </PhoneFrame>
    );
  }

  const nav = [
    { key: 'home',     label: 'Home',     icon: LayoutGrid },
    { key: 'bookings', label: 'Bookings', icon: ClipboardList },
    { key: 'notifs',   label: 'Alerts',   icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { key: 'profile',  label: 'Profile',  icon: UserCircle },
  ];

  let title  = 'Sahaya';
  let onBack = null;
  if (screen === 'detail')       { title = service?.name;      onBack = () => setScreen('home'); }
  if (screen === 'booking')      { title = 'Confirm booking';  onBack = () => setScreen('detail'); }
  if (screen === 'confirmed')    { title = 'Booked ✓'; }
  if (screen === 'bookingDetail'){ title = 'Booking details';  onBack = () => setScreen('bookings'); }
  if (screen === 'bookings')     { title = 'My bookings'; }
  if (screen === 'notifs')       { title = 'Notifications'; }
  if (screen === 'profile')      { title = 'Profile'; }

  const hasNav = !['detail', 'booking', 'confirmed', 'bookingDetail'].includes(screen);

  return (
    <>
      <PhoneFrame
        title={title}
        onBack={onBack}
        nav={hasNav ? nav : null}
        active={tab}
        onNav={goTab}
      >
        {/* ---- HOME ---- */}
        {screen === 'home' && (
          <>
            <div className="sh-greeting">
              <div>
                <p className="sh-sub" style={{ marginBottom: 2 }}>Good afternoon,</p>
                <h2 className="sh-h1" style={{ margin: 0 }}>{CURRENT_USER.name.split(' ')[0]} 👋</h2>
              </div>
              <div
                className="sh-patch teal"
                style={{ cursor: 'pointer' }}
                onClick={() => goTab('notifs')}
              >
                <span className="sh-nav-badge-wrap">
                  <Bell size={18} color="var(--teal)" />
                  {unreadCount > 0 && <span className="sh-badge">{unreadCount}</span>}
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="sh-search-bar">
              <Search size={16} />
              <input
                placeholder="Search for a service"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <p className="sh-sub" style={{ marginBottom: 10, fontWeight: 700, color: 'var(--ink)' }}>
              {query ? `Results for "${query}"` : 'Find your perfect home service'}
            </p>

            {filteredSvcs.length === 0 && (
              <div className="sh-empty">
                <Search size={28} />
                <p>No services matched "{query}"</p>
              </div>
            )}

            <div className="sh-service-grid">
              {filteredSvcs.map(s => (
                <div className="sh-service-card" key={s.id} onClick={() => openService(s)}>
                  <div className="sh-patch"><s.icon size={20} color="var(--teal)" /></div>
                  <b>{s.name}</b>
                  <span>{s.bookings} Bookings</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---- SERVICE DETAIL ---- */}
        {screen === 'detail' && service && (
          <>
            <div className="sh-patch lg" style={{ marginBottom: 14 }}>
              <service.icon size={26} color="var(--teal)" />
            </div>
            <h2 className="sh-h1">{service.name}</h2>
            <p className="sh-sub">{service.desc}</p>
            <div className="sh-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Starts at</span>
                <div className="sh-price" style={{ fontSize: 18 }}>₹{service.price}</div>
              </div>
              <span className="sh-pill" style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}>
                <Star size={11} /> {service.bookings} booked
              </span>
            </div>
            <button className="sh-btn sh-btn-primary" style={{ marginTop: 6 }} onClick={() => setScreen('booking')}>
              Book now
            </button>
          </>
        )}

        {/* ---- BOOKING FORM ---- */}
        {screen === 'booking' && service && (
          <>
            <p className="sh-sub" style={{ marginTop: 0 }}>
              Booking <b style={{ color: 'var(--ink)' }}>{service.name}</b> · ₹{service.price}
            </p>
            <Field label="Preferred date" icon={Calendar} value={bookingForm.date}
              onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })} />
            <Field label="Preferred time" icon={Clock} value={bookingForm.time}
              onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })} />
            <Field label="Address" icon={MapPin} placeholder="4B Palm Residency, Kondotty"
              value={bookingForm.address}
              onChange={e => setBookingForm({ ...bookingForm, address: e.target.value })} />
            <div className="sh-field">
              <label className="sh-label">Notes for the provider (optional)</label>
              <input
                className="sh-input sh-input-noicon"
                placeholder="e.g. ring the bell twice"
                value={bookingForm.notes}
                onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
              />
            </div>
            <button className="sh-btn sh-btn-amber" onClick={confirmBooking}>
              Confirm booking · ₹{service.price}
            </button>
          </>
        )}

        {/* ---- BOOKING CONFIRMED ---- */}
        {screen === 'confirmed' && service && (
          <div style={{ textAlign: 'center', padding: '30px 6px' }}>
            <div className="sh-patch lg" style={{ margin: '0 auto 16px', background: 'var(--teal-tint)' }}>
              <CheckCircle size={28} color="var(--teal)" />
            </div>
            <h2 className="sh-h1">Booking requested!</h2>
            <p className="sh-sub">
              We're finding a verified {service.skill.toLowerCase()} provider for you.
              You'll get a notification once someone accepts.
            </p>
            <button className="sh-btn sh-btn-primary" onClick={() => goTab('bookings')}>
              View my bookings
            </button>
          </div>
        )}

        {/* ---- MY BOOKINGS ---- */}
        {screen === 'bookings' && (
          <>
            {myBookings.length === 0 && (
              <div className="sh-empty">
                <ClipboardList size={30} />
                <p>No bookings yet — book a service from Home.</p>
              </div>
            )}
            {myBookings.map(b => (
              <div
                className="sh-card"
                key={b.id}
                style={{ cursor: 'pointer' }}
                onClick={() => { setSelectedBookingId(b.id); setScreen('bookingDetail'); }}
              >
                <div className="sh-card-row">
                  <div className="sh-patch">
                    {React.createElement(serviceFor(b)?.icon || 'span', { size: 19, color: 'var(--teal)' })}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p className="sh-card-title">{b.serviceName}</p>
                      <ChevronRight size={16} color="var(--ink-soft)" />
                    </div>
                    <div className="sh-card-meta"><Calendar size={12} /> {b.date}, {b.time}</div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <StatusPill status={b.status} />
                      {b.status === 'completed' && (
                        <span
                          className="sh-pill"
                          style={{ background: 'var(--amber-tint)', color: 'var(--amber-dark)', cursor: 'pointer' }}
                          onClick={e => { e.stopPropagation(); setRatingBookingId(b.id); }}
                        >
                          <Star size={10} fill="var(--amber)" color="var(--amber)" /> Rate
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ---- BOOKING DETAIL ---- */}
        {screen === 'bookingDetail' && selectedBookingId && (() => {
          const b   = bookings.find(x => x.id === selectedBookingId);
          if (!b) return null;
          const idx = TIMELINE_STEPS.indexOf(b.status);
          return (
            <>
              <div className="sh-card">
                <div className="sh-card-row">
                  <div className="sh-patch">
                    {React.createElement(serviceFor(b)?.icon || 'span', { size: 19, color: 'var(--teal)' })}
                  </div>
                  <div>
                    <p className="sh-card-title">{b.serviceName}</p>
                    <div className="sh-card-meta"><Calendar size={12} /> {b.date}, {b.time}</div>
                    <div className="sh-card-meta"><MapPin size={12} /> {b.address}</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="sh-timeline">
                {TIMELINE_STEPS.map((s, i) => (
                  <div className="sh-tl-item" key={s}>
                    <div className="sh-tl-dot-col">
                      <div className="sh-tl-dot"
                        style={{ background: i <= idx ? 'var(--teal)' : 'var(--border)', color: '#fff' }}>
                        {i <= idx ? <Check size={12} /> : null}
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className="sh-tl-line"
                          style={{ background: i < idx ? 'var(--teal)' : 'var(--border)' }} />
                      )}
                    </div>
                    <div className="sh-tl-content">
                      <b style={{ color: i <= idx ? 'var(--ink)' : 'var(--ink-soft)' }}>
                        {STATUS_META[s].label}
                      </b>
                    </div>
                  </div>
                ))}
              </div>

              {/* Amount */}
              <p className="sh-sub" style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Amount</p>
              <div className="sh-card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Service charge</span>
                <span className="sh-price">₹{b.price}</span>
              </div>

              {/* Actions */}
              {(b.status === 'pending' || b.status === 'confirmed') && (
                <button
                  className="sh-btn sh-btn-danger"
                  style={{ marginTop: 8 }}
                  onClick={() => cancelBooking(b.id)}
                >
                  <X size={15} /> Cancel booking
                </button>
              )}
              {b.status === 'completed' && (
                <button
                  className="sh-btn sh-btn-amber"
                  style={{ marginTop: 8 }}
                  onClick={() => setRatingBookingId(b.id)}
                >
                  <Star size={15} /> Rate this service
                </button>
              )}
            </>
          );
        })()}

        {/* ---- NOTIFICATIONS ---- */}
        {screen === 'notifs' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p className="sh-sub" style={{ margin: 0, fontWeight: 700, color: 'var(--ink)' }}>Recent alerts</p>
              {unreadCount > 0 && (
                <span style={{ fontSize: 12, color: 'var(--teal)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={markAllRead}>Mark all read</span>
              )}
            </div>
            {notifications.length === 0 && (
              <div className="sh-empty"><Bell size={28} /><p>No notifications yet.</p></div>
            )}
            {notifications.map(n => (
              <div key={n.id} className="sh-card" style={{ opacity: n.read ? 0.65 : 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div className="sh-patch teal" style={{ width: 36, height: 36, flexShrink: 0 }}>
                    <Bell size={16} color="var(--teal)" />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 3px', fontSize: 13.5, fontWeight: 600 }}>{n.text}</p>
                    <span style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{n.time}</span>
                  </div>
                  {!n.read && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', marginLeft: 'auto', flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ---- PROFILE ---- */}
        {screen === 'profile' && (
          <>
            <div style={{ textAlign: 'center', margin: '10px 0 22px' }}>
              <div className="sh-avatar" style={{ width: 60, height: 60, fontSize: 20, margin: '0 auto 10px' }}>
                {CURRENT_USER.initials}
              </div>
              <h2 className="sh-h1" style={{ margin: 0 }}>{CURRENT_USER.name}</h2>
              <p className="sh-sub">{CURRENT_USER.phone}</p>
            </div>
            {['Saved addresses', 'Payment methods', 'Notifications', 'Help & support'].map(t => (
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

      {/* Rating modal */}
      {ratingBooking && (
        <RatingModal
          booking={ratingBooking}
          onSubmit={stars => {
            console.log('Rated', stars, 'stars for booking', ratingBooking.id);
            setRatingBookingId(null);
          }}
          onClose={() => setRatingBookingId(null)}
        />
      )}
    </>
  );
}
