import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  BarChart3, ClipboardList, LayoutGrid, Users, LogOut,
  Shield, Wallet, Briefcase, MapPin, Check, X,
  ShieldCheck, Star, Search, ChevronRight, ArrowLeft,
  ShoppingBag, Pencil, Trash2, Plus, Tag,
  Eye, Image as ImageIcon, ExternalLink, Copy, Upload, Camera
} from 'lucide-react';

import LoginScreen from '../components/LoginScreen.jsx';
import StatusPill  from '../components/StatusPill.jsx';
import { SERVICES, CATEGORIES_TIER1, STATUS_META, serviceFor, providerFor } from '../data/mock.js';
import { supabase } from '../lib/supabase.js';

function getServiceCategory(s) {
  if (!s) return 'Quick Repairs & Fixes';
  if (s.category && s.category.trim()) return s.category;
  const id = parseInt(s.id);
  if (id >= 100 && id < 200) return 'Quick Repairs & Fixes';
  if (id >= 200 && id < 300) return 'Appliance Care & Repairs';
  if (id >= 300 && id < 400) return 'Cleaning & Pest Control';
  if (id >= 400 && id < 500) return 'Health & Medical Care';
  if (id >= 500 && id < 600) return 'Auto & Vehicle Care';
  if (id >= 600 && id < 700) return 'Professional & Business Services';
  if (id >= 700 && id < 800) return 'Tutors & Consultancies';
  if (id >= 800 && id < 900) return 'Pet & Animal Care';
  if (id >= 900 && id < 1000) return 'Food & Daily Supplies';
  if (id >= 1000) return 'Construction & Home Makeover';
  const mockS = SERVICES.find(m => m.id === id || m.name === s.name);
  if (mockS && mockS.category) return mockS.category;
  return 'Quick Repairs & Fixes';
}

function getServiceSubcategory(s) {
  if (!s) return 'General';
  if (s.subCategory && s.subCategory.trim()) return s.subCategory;
  const id = parseInt(s.id);
  const mockS = SERVICES.find(m => m.id === id || m.name === s.name);
  if (mockS && mockS.subCategory) return mockS.subCategory;
  return s.skill || 'General';
}

// Upload photo directly to Supabase Storage ('marketplace-images' bucket)
async function uploadMarketPhoto(file, onProgress) {
  try {
    if (onProgress) onProgress(20);

    const ext  = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `posts/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    if (onProgress) onProgress(50);

    const { data, error } = await supabase.storage
      .from('marketplace-images')
      .upload(path, file, { contentType: file.type, upsert: true });

    if (onProgress) onProgress(80);

    if (!error && data) {
      const { data: urlData } = supabase.storage.from('marketplace-images').getPublicUrl(path);
      if (urlData?.publicUrl) {
        if (onProgress) onProgress(100);
        return urlData.publicUrl;
      }
    }

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
    }

    if (onProgress) onProgress(100);
    return null;
  } catch (e) {
    console.error('Photo upload failed:', e);
    return null;
  }
}

const PRESET_MARKET_IMAGES = [
  { label: '🛋️ Sofa / Furniture', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' },
  { label: '📱 Electronics', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80' },
  { label: '🚗 Vehicle / Car', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80' },
  { label: '🛠️ Tools & Equipment', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
  { label: '🏠 Property / House', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80' },
];

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

function cleanDigits(val) {
  if (!val) return '';
  return String(val).replace(/\D/g, '');
}

function findPosterForPost(p, usersList = []) {
  if (!p) return null;

  const pUserId = p.user_id || p.userId;
  if (pUserId) {
    const matched = usersList.find(u => u.id === pUserId);
    if (matched) return matched;
  }

  const rawPhone = p.contactPhone || p.contact_phone || p.phone;
  const pDigits = cleanDigits(rawPhone);
  if (pDigits && pDigits.length >= 7) {
    const matched = usersList.find(u => {
      const uDigits = cleanDigits(u.phone);
      return uDigits.endsWith(pDigits) || pDigits.endsWith(uDigits);
    });
    if (matched) return matched;
  }

  const pName = p.postedBy || p.posted_by || p.contactName || p.contact_name || p.userName || p.user_name || p.customerName || p.customer_name || p.name;
  if (pName && pName !== 'Customer' && pName !== '-') {
    const matched = usersList.find(u => (u.name || '').toLowerCase() === String(pName).toLowerCase());
    if (matched) return matched;
  }

  return null;
}

function getPosterName(p, posterObj) {
  if (posterObj && posterObj.name && posterObj.name !== '-') return posterObj.name;
  
  const pName = p.postedBy || p.posted_by || p.contactName || p.contact_name || p.userName || p.user_name || p.customerName || p.customer_name || p.name;
  if (pName && pName !== '-' && pName !== 'Customer') return pName;

  const rawPhone = p.contactPhone || p.contact_phone || p.phone;
  if (rawPhone && rawPhone !== '-') return `Customer (${rawPhone})`;

  return 'Sahaya User';
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
  providers = [], bookings = [], users = [], updateUser, deleteUser, services = [], updateBooking, updateProvider, addProvider, addService, updateService,
  marketplacePostings = [], addMarketplacePosting, updateMarketplacePosting, deleteMarketplacePosting, onExit
}) {
  const [authed,         setAuthed]         = useState(() => localStorage.getItem('sh_admin_auth') === 'true');
  const [section,        setSectionState]   = useState(() => {
    const hash = (window.location.hash || '').replace('#', '');
    const valid = ['dashboard', 'bookings', 'marketplace', 'providers', 'services', 'users'];
    if (hash && valid.includes(hash)) return hash;
    const saved = localStorage.getItem('sh_admin_section');
    if (saved && valid.includes(saved)) return saved;
    return 'dashboard';
  });

  function setSection(secKey) {
    setSectionState(secKey);
    window.location.hash = secKey;
    localStorage.setItem('sh_admin_section', secKey);
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || '').replace('#', '');
      const valid = ['dashboard', 'bookings', 'marketplace', 'providers', 'services', 'users'];
      if (hash && valid.includes(hash)) {
        setSectionState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [bookingFilter,  setBookingFilter]  = useState('all');
  const [bookingSearch,  setBookingSearch]  = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userDetail,      setUserDetail]      = useState(null);
  const [editingUser,    setEditingUser]    = useState(null);
  const [userPhotoUploading, setUserPhotoUploading] = useState(false);
  const userPhotoInputRef = useRef(null);

  const [providerDetail, setProviderDetail] = useState(null);
  const [showCreateProvider, setShowCreateProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', phone: '', email: '', address: '', aadhaar_number: '', skill: 'House Help', price: '', username: '', password: '' });
  const [showCreateService, setShowCreateService] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', skill: '', category: 'Quick Repairs & Fixes', subCategory: 'Electrical' });
  const [editingService, setEditingService] = useState(null);
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');
  const [serviceSearchQuery,    setServiceSearchQuery]    = useState('');
  const [headerSkillFilter,    setHeaderSkillFilter]    = useState('all');
  const [headerPriceSort,      setHeaderPriceSort]      = useState('none'); // 'none' | 'asc' | 'desc'
  const [headerBookingsSort,   setHeaderBookingsSort]   = useState('none'); // 'none' | 'desc' | 'asc'
  const [headerStatusFilter,   setHeaderStatusFilter]   = useState('all');  // 'all' | 'active' | 'inactive'

  // Marketplace Management State
  const [showCreateMarketPost, setShowCreateMarketPost] = useState(false);
  const [editingMarketPost, setEditingMarketPost]       = useState(null);
  const [previewImagePost, setPreviewImagePost]         = useState(null);
  const [copiedUrl, setCopiedUrl]                       = useState(false);
  const [marketSearch, setMarketSearch]                 = useState('');
  const [marketTypeFilter, setMarketTypeFilter]         = useState('all');
  // Photo upload state
  const [uploadingPhoto, setUploadingPhoto]         = useState(false);
  const [uploadProgress, setUploadProgress]         = useState(0);
  const [editUploadingPhoto, setEditUploadingPhoto] = useState(false);
  const [editUploadProgress, setEditUploadProgress] = useState(0);
  const createFileRef = useRef(null);
  const editFileRef   = useRef(null);

  const handleCreatePhotoUpload = useCallback(async (file) => {
    if (!file) return;
    setUploadingPhoto(true);
    setUploadProgress(10);
    const url = await uploadMarketPhoto(file, setUploadProgress);
    setUploadingPhoto(false);
    if (url) {
      setNewMarketPost(prev => ({ ...prev, image_url: url }));
    } else {
      // Fallback: use a local object URL so the preview still shows
      const localUrl = URL.createObjectURL(file);
      setNewMarketPost(prev => ({ ...prev, image_url: localUrl }));
      alert('Photo saved locally. It will display in the preview but may not persist after closing.');
    }
  }, []);

  const handleEditPhotoUpload = useCallback(async (file) => {
    if (!file) return;
    setEditUploadingPhoto(true);
    setEditUploadProgress(10);
    const url = await uploadMarketPhoto(file, setEditUploadProgress);
    setEditUploadingPhoto(false);
    if (url) {
      setEditingMarketPost(prev => ({ ...prev, image_url: url, imageUrl: url }));
    } else {
      const localUrl = URL.createObjectURL(file);
      setEditingMarketPost(prev => ({ ...prev, image_url: localUrl, imageUrl: localUrl }));
    }
  }, []);

  const [newMarketPost, setNewMarketPost] = useState({
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

  async function handleUserAvatarUpload(file) {
    if (!file || !editingUser) return;
    setUserPhotoUploading(true);
    try {
      const url = await uploadMarketPhoto(file);
      if (url) {
        setEditingUser(prev => ({ ...prev, avatarUrl: url, avatar_url: url }));
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          setEditingUser(prev => ({ ...prev, avatarUrl: base64, avatar_url: base64 }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('User photo upload error:', err);
    } finally {
      setUserPhotoUploading(false);
    }
  }

  function handleSaveUserProfile(e) {
    e.preventDefault();
    if (!editingUser) return;
    updateUser?.(editingUser.id, {
      name: editingUser.name,
      phone: editingUser.phone,
      email: editingUser.email,
      avatarUrl: editingUser.avatarUrl || editingUser.avatar_url || '',
      avatar_url: editingUser.avatarUrl || editingUser.avatar_url || '',
    });
    setEditingUser(null);
    alert('User profile updated successfully!');
  }

  function handleDeleteUserAccount(id, name) {
    if (window.confirm(`Are you sure you want to delete customer account "${name}"? This action cannot be undone.`)) {
      deleteUser?.(id);
      if (editingUser?.id === id) setEditingUser(null);
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

  const [editingProvider, setEditingProvider] = useState(null);

  function handleUpdateProvider(e) {
    e.preventDefault();
    if (!editingProvider) return;
    const updatedData = {
      name: editingProvider.name,
      username: editingProvider.username,
      password: editingProvider.password,
      phone: editingProvider.phone,
      email: editingProvider.email,
      address: editingProvider.address,
      aadhaar_number: editingProvider.aadhaar_number || editingProvider.aadhaar || '',
      skill: editingProvider.skill,
      price: parseFloat(editingProvider.price) || 0,
      charge: parseFloat(editingProvider.charge) || 0,
      is_available: editingProvider.is_available === true || editingProvider.is_available === 'true',
      status: editingProvider.status || 'approved',
      rating: parseFloat(editingProvider.rating) || 4.8
    };
    updateProvider(editingProvider.id, updatedData);
    setEditingProvider(null);
  }

  function handleCreateService(e) {
    e.preventDefault();
    addService({
      name: newService.name,
      category: newService.category || 'Quick Repairs & Fixes',
      subCategory: newService.subCategory || newService.skill || 'Electrical',
      price: parseInt(newService.price) || 0,
      skill: newService.skill || newService.subCategory || 'Electrical',
      desc: newService.desc || '',
      icon: newService.icon || 'electric_bolt'
    });
    setShowCreateService(false);
    setNewService({ name: '', price: '', skill: '', category: 'Quick Repairs & Fixes', subCategory: 'Electrical', desc: '', icon: 'electric_bolt' });
  }

  function handleUpdateService(e) {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService.id, {
      name: editingService.name,
      category: editingService.category || 'Quick Repairs & Fixes',
      subCategory: editingService.subCategory || editingService.skill || 'Electrical',
      price: parseInt(editingService.price) || 0,
      skill: editingService.skill || editingService.subCategory || 'Electrical',
      desc: editingService.desc || ''
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



  /* Customer / User detail view */
  if (userDetail !== null) {
    const u = users.find(x => x.id === userDetail) || userDetail;
    const userBookings = bookings.filter(b => b.phone === u.phone || b.customerName === u.name);
    const userTotalSpent = userBookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
    const userMarketPosts = (marketplacePostings || []).filter(p => p.contactPhone === u.phone || p.contact_phone === u.phone);

    return (
      <div className="sh-admin-shell">
        <Sidebar section={section} setSection={s => { setSection(s); setUserDetail(null); setProviderDetail(null); }} onExit={onExit} />
        <div className="sh-admin-main">
          {/* Header Bar */}
          <div className="sh-admin-header">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="sh-btn sh-btn-ghost sh-btn-sm" style={{ width: 'auto' }}
                onClick={() => setUserDetail(null)}>
                <ArrowLeft size={14} /> Back to Customers
              </button>
              <div>
                <h2 className="sh-section-title">Customer Profile: {u.name}</h2>
                <p className="sh-section-sub" style={{ margin: 0 }}>Registered Customer Account #{u.id?.slice?.(0, 8) || u.id}</p>
              </div>
            </div>
          </div>

          {/* Customer Profile Banner Card */}
          <div className="sh-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{
                  position: 'relative', width: 80, height: 80, borderRadius: '50%',
                  overflow: 'hidden', flexShrink: 0, border: '3px solid var(--teal)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: 'var(--teal-tint)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {(u.avatarUrl || u.avatar_url || u.avatar) ? (
                    <img src={u.avatarUrl || u.avatar_url || u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-dark)', fontWeight: 800, fontSize: 28 }}>
                      {(u.name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{u.name}</h3>
                  <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>
                    📞 {u.phone} &bull; ✉️ {u.email || 'No email registered'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
                    📅 Member Joined: <b>{u.joined}</b> &bull; Status: <b style={{ color: 'green' }}>Active Customer</b>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="sh-btn sh-btn-primary sh-btn-sm"
                  onClick={() => setEditingUser(u)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Pencil size={14} /> Edit Customer Profile
                </button>
                <button
                  className="sh-btn sh-btn-sm"
                  style={{ background: '#ffe3e3', color: '#e03131', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => handleDeleteUserAccount(u.id, u.name)}
                >
                  <Trash2 size={14} /> Delete Account
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div><strong>Customer ID:</strong> {u.id}</div>
              <div><strong>Phone Number:</strong> {u.phone}</div>
              <div><strong>Email Address:</strong> {u.email || '—'}</div>
              <div><strong>Account Password:</strong> {u.password || '******'}</div>
              <div><strong>Registered Date:</strong> {u.joined}</div>
              <div><strong>Account Status:</strong> <span className="sh-pill" style={{ background: '#e6f4f1', color: '#0f9384', fontWeight: 700 }}>Active</span></div>
            </div>
          </div>

          {/* Customer Activity KPIs */}
          <div className="sh-kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
            <div className="sh-kpi-card">
              <div className="sh-kpi-label"><ClipboardList size={13} /> Bookings Made</div>
              <div className="sh-kpi-value">{userBookings.length}</div>
            </div>
            <div className="sh-kpi-card">
              <div className="sh-kpi-label"><Wallet size={13} /> Total Amount Spent</div>
              <div className="sh-kpi-value">₹{userTotalSpent.toLocaleString('en-IN')}</div>
            </div>
            <div className="sh-kpi-card">
              <div className="sh-kpi-label"><ShoppingBag size={13} /> Community Posts</div>
              <div className="sh-kpi-value">{userMarketPosts.length}</div>
            </div>
            <div className="sh-kpi-card">
              <div className="sh-kpi-label"><Check size={13} /> Account Status</div>
              <div className="sh-kpi-value" style={{ fontSize: 16, color: 'var(--green)' }}>Verified Customer</div>
            </div>
          </div>

          {/* Customer Booking History Table */}
          <div style={{ marginBottom: 24 }}>
            <p className="sh-section-title" style={{ fontSize: 16 }}>Booking History</p>
            <p className="sh-section-sub">{userBookings.length} bookings placed by this customer</p>
            {userBookings.length === 0 ? (
              <div className="sh-empty">No bookings placed by this customer yet.</div>
            ) : (
              <table className="sh-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Service Name</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 600 }}>#{b.id}</td>
                      <td>{b.serviceName}</td>
                      <td>{b.date} {b.time}</td>
                      <td className="sh-price">₹{b.price}</td>
                      <td><StatusPill status={b.status} /></td>
                      <td>{b.providerId ? `Provider #${b.providerId}` : 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Customer Marketplace Postings */}
          {userMarketPosts.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p className="sh-section-title" style={{ fontSize: 16 }}>Marketplace Listings & Requirements</p>
              <p className="sh-section-sub">{userMarketPosts.length} posts created in community marketplace</p>
              <table className="sh-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Price / Budget</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {userMarketPosts.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.title}</td>
                      <td>{m.type === 'requirement' ? '📢 Requirement' : '🛍️ For Sale'}</td>
                      <td>{m.category}</td>
                      <td style={{ fontWeight: 700, color: 'var(--teal-dark)' }}>₹{m.price}</td>
                      <td>{m.locationName || m.location_name || 'Calicut'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Sign-up & Account Details</h3>
              <button
                className="sh-btn sh-btn-primary sh-btn-sm"
                onClick={() => setEditingProvider(p)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Pencil size={13} /> Edit Provider Profile
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: 14 }}>
              <div><strong>Username:</strong> {p.username || '—'}</div>
              <div><strong>Password:</strong> {p.password || '—'}</div>
              <div><strong>Email:</strong> {p.email || '—'}</div>
              <div><strong>Phone:</strong> {p.phone || '—'}</div>
              <div><strong>Aadhaar Number:</strong> {p.aadhaar_number || p.aadhaar || '—'}</div>
              <div><strong>Base Price:</strong> ₹{p.price || 0}</div>
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
                {providers.filter(p => p && (p.status === 'approved' || p.status === 'active' || !p.status || p.status !== 'rejected')).map(p => {
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
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          className="sh-btn sh-btn-sm sh-btn-ghost"
                          style={{ padding: '4px 8px', fontSize: 12, border: '1px solid var(--border)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProvider(p);
                          }}
                        >
                          Edit
                        </button>
                        <ChevronRight size={14} color="var(--ink-soft)" />
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </>
        )}

        {/* ---- SERVICES ---- */}
        {section === 'services' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h2 className="sh-section-title">Service Catalog</h2>
                <p className="sh-section-sub">Manage 10 Tier-1 main categories and detailed subcategory services</p>
              </div>
              <button className="sh-btn sh-btn-primary" onClick={() => setShowCreateService(true)}>
                + Create Service
              </button>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
              <button
                onClick={() => setServiceCategoryFilter('all')}
                className={'sh-btn sh-btn-sm ' + (serviceCategoryFilter === 'all' ? 'sh-btn-primary' : 'sh-btn-ghost')}
                style={{ borderRadius: 20, whiteSpace: 'nowrap' }}
              >
                All Categories ({services.length})
              </button>
              {CATEGORIES_TIER1.map(cat => {
                const count = services.filter(s => getServiceCategory(s) === cat.name).length;
                const isActive = serviceCategoryFilter === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setServiceCategoryFilter(cat.name)}
                    className={'sh-btn sh-btn-sm ' + (isActive ? 'sh-btn-primary' : 'sh-btn-ghost')}
                    style={{ borderRadius: 20, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                    <span style={{ opacity: 0.7, fontSize: 11 }}>({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search input & Active Filters Reset */}
            <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: 340 }}>
                <Search size={16} color="var(--ink-soft)" style={{ position: 'absolute', left: 12 }} />
                <input
                  type="text"
                  placeholder="Search service name, subcategory, skill..."
                  value={serviceSearchQuery}
                  onChange={e => setServiceSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8,
                    border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg)'
                  }}
                />
              </div>

              {(serviceCategoryFilter !== 'all' || headerSkillFilter !== 'all' || headerPriceSort !== 'none' || headerBookingsSort !== 'none' || headerStatusFilter !== 'all' || serviceSearchQuery) && (
                <button
                  className="sh-btn sh-btn-sm sh-btn-ghost"
                  style={{ color: 'var(--coral)', fontSize: 12 }}
                  onClick={() => {
                    setServiceCategoryFilter('all');
                    setHeaderSkillFilter('all');
                    setHeaderPriceSort('none');
                    setHeaderBookingsSort('none');
                    setHeaderStatusFilter('all');
                    setServiceSearchQuery('');
                  }}
                >
                  Clear All Filters ✕
                </button>
              )}
            </div>
            
            <table className="sh-table">
              <thead>
                <tr style={{ background: 'var(--surface-tint)' }}>
                  <th style={{ padding: '12px 14px', minWidth: 200 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-soft)' }}>
                      Service Name
                    </div>
                  </th>

                  <th style={{ padding: '12px 14px', minWidth: 190 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-soft)' }}>
                        Tier-1 Category
                      </span>
                      <select
                        className="sh-input"
                        value={serviceCategoryFilter}
                        onChange={e => setServiceCategoryFilter(e.target.value)}
                        style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 6px', height: 28, borderRadius: 6,
                          background: serviceCategoryFilter !== 'all' ? 'var(--teal-tint)' : 'var(--bg)',
                          borderColor: serviceCategoryFilter !== 'all' ? 'var(--teal)' : 'var(--border)',
                          color: serviceCategoryFilter !== 'all' ? 'var(--teal)' : 'inherit'
                        }}
                      >
                        <option value="all">All Categories ({services.length})</option>
                        {CATEGORIES_TIER1.map(cat => (
                          <option key={cat.id} value={cat.name}>
                            {cat.emoji} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>

                  <th style={{ padding: '12px 14px', minWidth: 170 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-soft)' }}>
                        Subcategory / Skill
                      </span>
                      <select
                        className="sh-input"
                        value={headerSkillFilter}
                        onChange={e => setHeaderSkillFilter(e.target.value)}
                        style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 6px', height: 28, borderRadius: 6,
                          background: headerSkillFilter !== 'all' ? 'var(--teal-tint)' : 'var(--bg)',
                          borderColor: headerSkillFilter !== 'all' ? 'var(--teal)' : 'var(--border)',
                          color: headerSkillFilter !== 'all' ? 'var(--teal)' : 'inherit'
                        }}
                      >
                        <option value="all">All Subcategories / Skills</option>
                        {Array.from(new Set(services.flatMap(s => [s.skill, getServiceSubcategory(s)]).filter(Boolean))).sort().map(sk => (
                          <option key={sk} value={sk}>{sk}</option>
                        ))}
                      </select>
                    </div>
                  </th>

                  <th style={{ padding: '12px 14px', minWidth: 140 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-soft)' }}>
                        Starting Price
                      </span>
                      <select
                        className="sh-input"
                        value={headerPriceSort}
                        onChange={e => {
                          setHeaderPriceSort(e.target.value);
                          setHeaderBookingsSort('none');
                        }}
                        style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 6px', height: 28, borderRadius: 6,
                          background: headerPriceSort !== 'none' ? 'var(--teal-tint)' : 'var(--bg)',
                          borderColor: headerPriceSort !== 'none' ? 'var(--teal)' : 'var(--border)',
                          color: headerPriceSort !== 'none' ? 'var(--teal)' : 'inherit'
                        }}
                      >
                        <option value="none">Sort: Default</option>
                        <option value="asc">Price: Low → High (₹↑)</option>
                        <option value="desc">Price: High → Low (₹↓)</option>
                      </select>
                    </div>
                  </th>

                  <th style={{ padding: '12px 14px', minWidth: 140 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-soft)' }}>
                        Bookings
                      </span>
                      <select
                        className="sh-input"
                        value={headerBookingsSort}
                        onChange={e => {
                          setHeaderBookingsSort(e.target.value);
                          setHeaderPriceSort('none');
                        }}
                        style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 6px', height: 28, borderRadius: 6,
                          background: headerBookingsSort !== 'none' ? 'var(--teal-tint)' : 'var(--bg)',
                          borderColor: headerBookingsSort !== 'none' ? 'var(--teal)' : 'var(--border)',
                          color: headerBookingsSort !== 'none' ? 'var(--teal)' : 'inherit'
                        }}
                      >
                        <option value="none">Sort: Default</option>
                        <option value="desc">Most Booked (High → Low)</option>
                        <option value="asc">Least Booked (Low → High)</option>
                      </select>
                    </div>
                  </th>

                  <th style={{ padding: '12px 14px', minWidth: 150 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-soft)' }}>
                        Status & Actions
                      </span>
                      <select
                        className="sh-input"
                        value={headerStatusFilter}
                        onChange={e => setHeaderStatusFilter(e.target.value)}
                        style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 6px', height: 28, borderRadius: 6,
                          background: headerStatusFilter !== 'all' ? 'var(--teal-tint)' : 'var(--bg)',
                          borderColor: headerStatusFilter !== 'all' ? 'var(--teal)' : 'var(--border)',
                          color: headerStatusFilter !== 'all' ? 'var(--teal)' : 'inherit'
                        }}
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                      </select>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {services
                  .filter(s => {
                    const catName = getServiceCategory(s);
                    const subcat = getServiceSubcategory(s);
                    
                    const matchCat = serviceCategoryFilter === 'all' || catName === serviceCategoryFilter;
                    
                    const matchSkill = headerSkillFilter === 'all' || 
                      s.skill === headerSkillFilter || 
                      subcat === headerSkillFilter;
                      
                    const matchStatus = headerStatusFilter === 'all' || 
                      (headerStatusFilter === 'active' && s.status !== 'inactive') ||
                      (headerStatusFilter === 'inactive' && s.status === 'inactive');

                    const matchQuery = !serviceSearchQuery ||
                      s.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                      subcat.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                      (s.skill && s.skill.toLowerCase().includes(serviceSearchQuery.toLowerCase())) ||
                      catName.toLowerCase().includes(serviceSearchQuery.toLowerCase());
                      
                    return matchCat && matchSkill && matchStatus && matchQuery;
                  })
                  .sort((a, b) => {
                    if (headerPriceSort === 'asc') return (a.price || 0) - (b.price || 0);
                    if (headerPriceSort === 'desc') return (b.price || 0) - (a.price || 0);
                    
                    const aBookings = parseInt(a.bookings || 0) || bookings.filter(bk => bk.serviceId === a.id).length;
                    const bBookings = parseInt(b.bookings || 0) || bookings.filter(bk => bk.serviceId === b.id).length;
                    if (headerBookingsSort === 'desc') return bBookings - aBookings;
                    if (headerBookingsSort === 'asc') return aBookings - bBookings;
                    
                    return 0;
                  })
                  .map(s => {
                    const liveCount = bookings.filter(b => b.serviceId === s.id).length;
                    const catName = getServiceCategory(s);
                    const subcat = getServiceSubcategory(s);
                    const catObj = CATEGORIES_TIER1.find(c => c.name === catName) || CATEGORIES_TIER1[0];
                    return (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="sh-patch" style={{ width: 32, height: 32, background: 'var(--teal-tint)', borderRadius: 8, flexShrink: 0 }}>
                              <span style={{ fontSize: 16 }}>{catObj?.emoji || '🛠️'}</span>
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{s.desc}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                            background: 'var(--teal-tint)', color: 'var(--teal)', whiteSpace: 'nowrap'
                          }}>
                            {catName}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>
                            {subcat !== s.skill ? `${subcat} · ${s.skill}` : s.skill}
                          </span>
                        </td>
                        <td className="sh-price">₹{s.price}</td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{liveCount || s.bookings || 0}</span> <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>live</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="sh-pill" style={{ background: 'var(--green)22', color: 'var(--green)' }}>Active</span>
                            <button 
                              className="sh-btn sh-btn-sm sh-btn-ghost" 
                              style={{ padding: '4px 8px' }}
                              onClick={() => setEditingService(s)}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </>
        )}

        {/* ---- USERS ---- */}
        {section === 'users' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 className="sh-section-title">Customer Profiles & User Management</h2>
                <p className="sh-section-sub">View, search, edit customer details and manage profile pictures</p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal-dark)', background: 'var(--teal-tint)', padding: '6px 14px', borderRadius: 20 }}>
                👥 {users.length} Registered Customers
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-light)' }} />
                <input
                  type="text"
                  className="sh-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search customers by name, phone number, or email..."
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <table className="sh-table">
              <thead>
                <tr>
                  <th>Customer Profile</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Bookings Made</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => {
                    const q = userSearchQuery.toLowerCase();
                    return (u.name || '').toLowerCase().includes(q) ||
                           (u.phone || '').toLowerCase().includes(q) ||
                           (u.email || '').toLowerCase().includes(q);
                  })
                  .map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              position: 'relative', width: 36, height: 36, borderRadius: '50%',
                              overflow: 'hidden', flexShrink: 0, border: '2px solid var(--teal-light, #ccece6)',
                              background: 'var(--teal-tint, #e6f4f1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            {(u.avatarUrl || u.avatar_url || u.avatar) ? (
                              <img
                                src={u.avatarUrl || u.avatar_url || u.avatar}
                                alt={u.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }}
                              />
                            ) : null}
                            <div
                              style={{
                                display: (u.avatarUrl || u.avatar_url || u.avatar) ? 'none' : 'flex',
                                width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--teal-dark, #0f9384)', fontWeight: 700, fontSize: 12
                              }}
                            >
                              {(u?.name || 'U').split(' ').map(n => n ? n[0] : '').filter(Boolean).slice(0, 2).join('') || 'U'}
                            </div>
                          </div>
                          <div style={{ cursor: 'pointer' }} onClick={() => setUserDetail(u.id)}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--teal-dark)' }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-light)' }}>ID: #{u.id?.slice?.(0, 8) || u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{u.phone}</td>
                      <td>{u.email || '-'}</td>
                      <td>{u.joined}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--teal-dark)', background: '#eef2ff', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>
                          {u.bookingsCount} orders
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="sh-btn sh-btn-sm sh-btn-ghost"
                            style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            onClick={() => setUserDetail(u.id)}
                            title="View Customer Profile Screen"
                          >
                            <Eye size={13} color="var(--teal)" /> View Profile
                          </button>
                          <button
                            className="sh-btn sh-btn-sm sh-btn-ghost"
                            style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            onClick={() => setEditingUser(u)}
                            title="Edit Profile"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            className="sh-btn sh-btn-sm"
                            style={{ padding: '6px 10px', background: '#ffe3e3', color: '#e03131', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            onClick={() => handleDeleteUserAccount(u.id, u.name)}
                            title="Delete User"
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
                  <th>Posted Person Details</th>
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
                          <div
                            style={{ position: 'relative', width: 48, height: 48, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                            title="Click to view & manage full image"
                            onClick={() => setPreviewImagePost(p)}
                          >
                            <img
                              src={p.imageUrl || p.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=120&q=80'}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s ease' }}
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=120&q=80'; }}
                            />
                            <div style={{
                              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                            >
                              <Eye size={16} color="#fff" />
                            </div>
                          </div>
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
                      {(() => {
                        const poster = findPosterForPost(p, users);
                        const posterName = getPosterName(p, poster);
                        const posterPhone = p.contactPhone || p.contact_phone || poster?.phone || '-';
                        const posterAvatar = poster?.avatarUrl || poster?.avatar_url || poster?.avatar || null;
                        return (
                          <td>
                            <div
                              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: poster ? 'pointer' : 'default' }}
                              onClick={() => poster && setUserDetail(poster.id)}
                              title={poster ? `Click to view ${posterName}'s full Customer Profile` : ''}
                            >
                              <div
                                style={{
                                  width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                                  border: '1.5px solid var(--teal-light, #ccece6)', background: 'var(--teal-tint, #e6f4f1)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                              >
                                {posterAvatar ? (
                                  <img src={posterAvatar} alt={posterName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ color: 'var(--teal-dark, #0f9384)', fontWeight: 700, fontSize: 12 }}>
                                    {(posterName || 'U').split(' ').map(n => n ? n[0] : '').filter(Boolean).slice(0, 2).join('') || 'U'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: poster ? 'var(--teal-dark)' : 'inherit' }}>{posterName}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{posterPhone}</div>
                              </div>
                            </div>
                          </td>
                        );
                      })()}
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="sh-btn sh-btn-sm sh-btn-ghost"
                            style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            onClick={() => setPreviewImagePost(p)}
                            title="View / Manage Image"
                          >
                            <ImageIcon size={13} color="var(--teal)" /> Image
                          </button>
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

      {/* Complete Edit Provider Modal */}
      {editingProvider && (
        <div className="sh-modal-backdrop">
          <div className="sh-modal" style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h2 className="sh-section-title">Edit Provider Profile</h2>
                <p className="sh-section-sub" style={{ margin: 0 }}>Update account credentials, skills, pricing, and status for #{editingProvider.id}</p>
              </div>
              <button
                className="sh-btn sh-btn-ghost sh-btn-sm"
                onClick={() => setEditingProvider(null)}
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateProvider} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Full Name</label>
                  <input
                    required
                    className="sh-input"
                    value={editingProvider.name || ''}
                    onChange={e => setEditingProvider({ ...editingProvider, name: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Username</label>
                  <input
                    required
                    className="sh-input"
                    value={editingProvider.username || ''}
                    onChange={e => setEditingProvider({ ...editingProvider, username: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Password</label>
                  <input
                    required
                    type="text"
                    className="sh-input"
                    value={editingProvider.password || ''}
                    onChange={e => setEditingProvider({ ...editingProvider, password: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Phone Number</label>
                  <input
                    required
                    type="tel"
                    className="sh-input"
                    value={editingProvider.phone || ''}
                    onChange={e => setEditingProvider({ ...editingProvider, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Email Address</label>
                  <input
                    type="email"
                    className="sh-input"
                    value={editingProvider.email || ''}
                    onChange={e => setEditingProvider({ ...editingProvider, email: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Aadhaar Number</label>
                  <input
                    type="text"
                    className="sh-input"
                    placeholder="XXXX XXXX XXXX"
                    value={editingProvider.aadhaar_number || editingProvider.aadhaar || ''}
                    onChange={e => setEditingProvider({ ...editingProvider, aadhaar_number: e.target.value, aadhaar: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Primary Skill(s)</label>
                  <input
                    required
                    className="sh-input"
                    placeholder="e.g. Electrical, Carpentry"
                    value={editingProvider.skill || ''}
                    onChange={e => setEditingProvider({ ...editingProvider, skill: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Base Price (₹)</label>
                  <input
                    required
                    type="number"
                    className="sh-input"
                    value={editingProvider.price !== undefined ? editingProvider.price : (editingProvider.charge || 0)}
                    onChange={e => setEditingProvider({ ...editingProvider, price: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Wallet Balance (₹)</label>
                  <input
                    type="number"
                    className="sh-input"
                    value={editingProvider.charge !== undefined ? editingProvider.charge : 0}
                    onChange={e => setEditingProvider({ ...editingProvider, charge: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Platform Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    className="sh-input"
                    value={editingProvider.rating !== undefined ? editingProvider.rating : 4.8}
                    onChange={e => setEditingProvider({ ...editingProvider, rating: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Availability Status</label>
                  <select
                    className="sh-input"
                    value={editingProvider.is_available === false || editingProvider.is_available === 'false' ? 'false' : 'true'}
                    onChange={e => setEditingProvider({ ...editingProvider, is_available: e.target.value === 'true' })}
                  >
                    <option value="true">🟢 Active (Online for jobs)</option>
                    <option value="false">⚪ Inactive (Offline)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Verification Status</label>
                  <select
                    className="sh-input"
                    value={editingProvider.status || 'approved'}
                    onChange={e => setEditingProvider({ ...editingProvider, status: e.target.value })}
                  >
                    <option value="approved">✅ Verified / Approved</option>
                    <option value="pending">⏳ Pending Approval</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Physical Address</label>
                <textarea
                  className="sh-input"
                  style={{ minHeight: 60, resize: 'vertical' }}
                  value={editingProvider.address || ''}
                  onChange={e => setEditingProvider({ ...editingProvider, address: e.target.value })}
                />
              </div>

              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="sh-btn sh-btn-ghost"
                  onClick={() => setEditingProvider(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sh-btn sh-btn-primary"
                >
                  Save Provider Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateService && (
        <div className="sh-modal-backdrop">
          <div className="sh-modal" style={{ maxWidth: 460 }}>
            <h2 className="sh-section-title">Create New Service</h2>
            <p className="sh-section-sub">Add a service to one of the 10 main Tier-1 categories</p>
            <form onSubmit={handleCreateService} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Tier-1 Category</label>
                <select
                  className="sh-input"
                  value={newService.category || 'Quick Repairs & Fixes'}
                  onChange={e => setNewService({ ...newService, category: e.target.value })}
                >
                  {CATEGORIES_TIER1.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Service Name</label>
                  <input className="sh-input" placeholder="e.g. Fan Fitting & Repair" required value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Price (₹)</label>
                  <input className="sh-input" placeholder="e.g. 299" type="number" required value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Subcategory / Skill</label>
                  <input className="sh-input" placeholder="e.g. Electrical" required value={newService.skill} onChange={e => setNewService({...newService, skill: e.target.value, subCategory: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Description</label>
                <textarea className="sh-input" style={{ minHeight: 60, resize: 'vertical' }} placeholder="Short service description..." value={newService.desc || ''} onChange={e => setNewService({...newService, desc: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="sh-btn sh-btn-ghost" onClick={() => setShowCreateService(false)}>Cancel</button>
                <button type="submit" className="sh-btn sh-btn-primary">Add Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingService && (
        <div className="sh-modal-backdrop">
          <div className="sh-modal" style={{ maxWidth: 460 }}>
            <h2 className="sh-section-title">Edit Service</h2>
            <p className="sh-section-sub">Update category, price, and details for #{editingService.id}</p>
            <form onSubmit={handleUpdateService} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Tier-1 Category</label>
                <select
                  className="sh-input"
                  value={editingService.category || 'Quick Repairs & Fixes'}
                  onChange={e => setEditingService({ ...editingService, category: e.target.value })}
                >
                  {CATEGORIES_TIER1.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Service Name</label>
                  <input className="sh-input" placeholder="Service Name" required value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Price (₹)</label>
                  <input className="sh-input" placeholder="Price (₹)" type="number" required value={editingService.price} onChange={e => setEditingService({...editingService, price: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Subcategory / Skill</label>
                  <input className="sh-input" placeholder="Skill / Subcategory" required value={editingService.skill || editingService.subCategory || ''} onChange={e => setEditingService({...editingService, skill: e.target.value, subCategory: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Description</label>
                <textarea className="sh-input" style={{ minHeight: 60, resize: 'vertical' }} placeholder="Description..." value={editingService.desc || ''} onChange={e => setEditingService({...editingService, desc: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="sh-btn sh-btn-ghost" onClick={() => setEditingService(null)}>Cancel</button>
                <button type="submit" className="sh-btn sh-btn-primary">Save Changes</button>
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

              {/* Photo Upload Section - Create */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Product Photo</label>

                {/* Drop zone / file picker */}
                <div
                  onClick={() => !uploadingPhoto && createFileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleCreatePhotoUpload(f); }}
                  style={{
                    border: '2px dashed var(--border)', borderRadius: 10, padding: '14px 16px',
                    cursor: uploadingPhoto ? 'not-allowed' : 'pointer',
                    background: newMarketPost.image_url ? 'var(--teal-tint, #f0f9fb)' : '#fafafa',
                    transition: 'border-color 0.2s', textAlign: 'center', position: 'relative',
                    minHeight: newMarketPost.image_url ? 140 : 80,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  {newMarketPost.image_url ? (
                    <>
                      <img
                        src={newMarketPost.image_url}
                        alt="preview"
                        style={{ maxHeight: 110, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 }}
                      />
                      <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>
                        ✓ Photo attached — click to replace
                      </div>
                    </>
                  ) : uploadingPhoto ? (
                    <>
                      <div style={{ width: '80%', height: 6, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--teal)', transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Uploading… {uploadProgress}%</div>
                    </>
                  ) : (
                    <>
                      <Camera size={26} color="var(--teal)" />
                      <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>Click to upload a photo</div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)' }}>or drag & drop · JPG, PNG, WEBP up to 5 MB</div>
                    </>
                  )}
                </div>

                <input
                  ref={createFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleCreatePhotoUpload(f); e.target.value = ''; }}
                />

                {/* Clear photo button */}
                {newMarketPost.image_url && (
                  <button
                    type="button"
                    className="sh-btn sh-btn-ghost sh-btn-sm"
                    style={{ marginTop: 4, fontSize: 11 }}
                    onClick={() => setNewMarketPost(p => ({ ...p, image_url: '' }))}
                  >
                    <X size={11} /> Remove photo
                  </button>
                )}

                {/* Quick preset images */}
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8, marginBottom: 4 }}>Or use a sample image:</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PRESET_MARKET_IMAGES.map((img, i) => (
                    <button
                      key={i} type="button"
                      className="sh-btn sh-btn-sm sh-btn-ghost"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                      onClick={() => setNewMarketPost({ ...newMarketPost, image_url: img.url })}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
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

              {/* Photo Upload Section - Edit */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Product Photo</label>

                <div
                  onClick={() => !editUploadingPhoto && editFileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleEditPhotoUpload(f); }}
                  style={{
                    border: '2px dashed var(--border)', borderRadius: 10, padding: '14px 16px',
                    cursor: editUploadingPhoto ? 'not-allowed' : 'pointer',
                    background: (editingMarketPost.imageUrl || editingMarketPost.image_url) ? 'var(--teal-tint, #f0f9fb)' : '#fafafa',
                    textAlign: 'center', minHeight: (editingMarketPost.imageUrl || editingMarketPost.image_url) ? 140 : 80,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  {(editingMarketPost.imageUrl || editingMarketPost.image_url) ? (
                    <>
                      <img
                        src={editingMarketPost.imageUrl || editingMarketPost.image_url}
                        alt="preview"
                        style={{ maxHeight: 110, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 }}
                      />
                      <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>✓ Photo attached — click to replace</div>
                    </>
                  ) : editUploadingPhoto ? (
                    <>
                      <div style={{ width: '80%', height: 6, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${editUploadProgress}%`, height: '100%', background: 'var(--teal)', transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Uploading… {editUploadProgress}%</div>
                    </>
                  ) : (
                    <>
                      <Camera size={26} color="var(--teal)" />
                      <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>Click to upload a photo</div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)' }}>or drag & drop · JPG, PNG, WEBP up to 5 MB</div>
                    </>
                  )}
                </div>

                <input
                  ref={editFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleEditPhotoUpload(f); e.target.value = ''; }}
                />

                {(editingMarketPost.imageUrl || editingMarketPost.image_url) && (
                  <button
                    type="button" className="sh-btn sh-btn-ghost sh-btn-sm"
                    style={{ marginTop: 4, fontSize: 11 }}
                    onClick={() => setEditingMarketPost(p => ({ ...p, image_url: '', imageUrl: '' }))}
                  >
                    <X size={11} /> Remove photo
                  </button>
                )}

                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8, marginBottom: 4 }}>Or use a sample image:</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PRESET_MARKET_IMAGES.map((img, i) => (
                    <button
                      key={i} type="button"
                      className="sh-btn sh-btn-sm sh-btn-ghost"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                      onClick={() => setEditingMarketPost({ ...editingMarketPost, image_url: img.url, imageUrl: img.url })}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
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

      {/* Image Preview & Management Modal */}
      {previewImagePost && (
        <div className="sh-modal-backdrop" onClick={() => setPreviewImagePost(null)}>
          <div className="sh-modal" style={{ maxWidth: 640, padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative', width: '100%', height: 320, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={previewImagePost.imageUrl || previewImagePost.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'}
                alt=""
                style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'contain' }}
              />
              <button
                className="sh-btn sh-btn-ghost"
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: 6, borderRadius: 20 }}
                onClick={() => setPreviewImagePost(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{previewImagePost.title}</h3>
                  <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>
                    Category: <b>{previewImagePost.category}</b> &nbsp;&bull;&nbsp; Location: <b>{previewImagePost.locationName || previewImagePost.location_name || 'Calicut'}</b>
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--teal-dark)' }}>
                  ₹{(previewImagePost.price || 0).toLocaleString('en-IN')}
                </div>
              </div>

              {/* Posted Person Card */}
              {(() => {
                const poster = findPosterForPost(previewImagePost, users);
                const posterName = getPosterName(previewImagePost, poster);
                const posterPhone = previewImagePost.contactPhone || previewImagePost.contact_phone || poster?.phone || '-';
                const posterAvatar = poster?.avatarUrl || poster?.avatar_url || poster?.avatar || null;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--teal)', background: 'var(--teal-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {posterAvatar ? (
                          <img src={posterAvatar} alt={posterName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ color: 'var(--teal-dark)', fontWeight: 800, fontSize: 14 }}>
                            {(posterName || 'U')[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Posted By Customer</div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{posterName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-light)' }}>📞 {posterPhone}</div>
                      </div>
                    </div>
                    {poster && (
                      <button
                        className="sh-btn sh-btn-ghost sh-btn-sm"
                        style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        onClick={() => {
                          setPreviewImagePost(null);
                          setUserDetail(poster.id);
                        }}
                      >
                        <User size={13} color="var(--teal)" /> View Profile
                      </button>
                    )}
                  </div>
                );
              })()}

              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: 16, color: '#495057' }}>
                {previewImagePost.imageUrl || previewImagePost.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <a
                  href={previewImagePost.imageUrl || previewImagePost.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="sh-btn sh-btn-ghost sh-btn-sm"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <ExternalLink size={14} /> Open Original
                </a>
                <button
                  className="sh-btn sh-btn-ghost sh-btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  onClick={() => {
                    const imgUrl = previewImagePost.imageUrl || previewImagePost.image_url || '';
                    navigator.clipboard.writeText(imgUrl);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                >
                  {copiedUrl ? <Check size={14} color="green" /> : <Copy size={14} />}
                  {copiedUrl ? 'Copied Link!' : 'Copy Image Link'}
                </button>
                <button
                  className="sh-btn sh-btn-primary sh-btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  onClick={() => {
                    setEditingMarketPost(previewImagePost);
                    setPreviewImagePost(null);
                  }}
                >
                  <Pencil size={14} /> Change Image / Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Profile & Activity Modal */}
      {editingUser && (
        <div className="sh-modal-backdrop">
          <div className="sh-modal" style={{ maxWidth: 600, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h2 className="sh-section-title">Customer Profile Management</h2>
                <p className="sh-section-sub" style={{ margin: 0 }}>View and update details or review booking history for customer #{editingUser.id?.slice?.(0, 8) || editingUser.id}</p>
              </div>
              <button
                className="sh-btn sh-btn-ghost sh-btn-sm"
                onClick={() => setEditingUser(null)}
                style={{ padding: '4px 8px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Picture Header & Change Upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 20, border: '1px solid var(--border)' }}>
              <div
                onClick={() => !userPhotoUploading && userPhotoInputRef.current?.click()}
                style={{ position: 'relative', width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, border: '2px solid var(--teal)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                title="Click to change profile picture"
              >
                {(editingUser.avatarUrl || editingUser.avatar_url || editingUser.avatar) ? (
                  <img
                    src={editingUser.avatarUrl || editingUser.avatar_url || editingUser.avatar}
                    alt={editingUser.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--teal-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24 }}>
                    {(editingUser.name || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                     onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                     onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <Camera size={18} color="#fff" />
                </div>
              </div>
              <input
                ref={userPhotoInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUserAvatarUpload(f); e.target.value = ''; }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{editingUser.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>{editingUser.phone} &bull; {editingUser.email || 'No email set'}</div>
                <button
                  type="button"
                  className="sh-btn sh-btn-ghost sh-btn-sm"
                  style={{ marginTop: 6, fontSize: 11, padding: '3px 8px' }}
                  onClick={() => userPhotoInputRef.current?.click()}
                >
                  <Camera size={12} /> {userPhotoUploading ? 'Uploading Photo...' : 'Upload New Profile Photo'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveUserProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Full Name</label>
                  <input
                    required
                    className="sh-input"
                    value={editingUser.name || ''}
                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Phone Number</label>
                  <input
                    required
                    type="tel"
                    className="sh-input"
                    value={editingUser.phone || ''}
                    onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Email Address</label>
                <input
                  type="email"
                  className="sh-input"
                  value={editingUser.email || ''}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-light)' }}>Profile Picture URL</label>
                <input
                  type="text"
                  className="sh-input"
                  placeholder="https://... or data:image/..."
                  value={editingUser.avatarUrl || editingUser.avatar_url || ''}
                  onChange={e => setEditingUser({ ...editingUser, avatarUrl: e.target.value, avatar_url: e.target.value })}
                />
              </div>

              {/* Booking Activity Section */}
              <div style={{ marginTop: 10 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700 }}>Customer Booking History</h4>
                {(() => {
                  const userBookings = bookings.filter(b => b.phone === editingUser.phone || b.customerName === editingUser.name);
                  if (userBookings.length === 0) {
                    return <div style={{ fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic' }}>No bookings placed by this user yet.</div>;
                  }
                  return (
                    <div style={{ maxHeight: 150, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <table className="sh-table" style={{ margin: 0, fontSize: 12 }}>
                        <thead>
                          <tr>
                            <th>Date & Time</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userBookings.map(b => (
                            <tr key={b.id}>
                              <td>{b.date} {b.time}</td>
                              <td style={{ fontWeight: 600 }}>{b.serviceName}</td>
                              <td><StatusPill status={b.status} /></td>
                              <td style={{ fontWeight: 700 }}>₹{b.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <button
                  type="button"
                  className="sh-btn sh-btn-sm"
                  style={{ background: '#ffe3e3', color: '#e03131', border: 'none' }}
                  onClick={() => handleDeleteUserAccount(editingUser.id, editingUser.name)}
                >
                  Delete Account
                </button>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="sh-btn" onClick={() => setEditingUser(null)}>Cancel</button>
                  <button type="submit" className="sh-btn sh-btn-primary">Save Profile Changes</button>
                </div>
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
        <a
          key={it.key}
          href={`#${it.key}`}
          className={'sh-side-item' + (section === it.key ? ' active' : '')}
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              setSection(it.key);
            }
          }}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <it.icon size={16} /> {it.label}
        </a>
      ))}
      <div className="sh-side-footer">
        <div className="sh-side-item" onClick={onExit} style={{ cursor: 'pointer' }}><LogOut size={16} /> Exit demo</div>
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
