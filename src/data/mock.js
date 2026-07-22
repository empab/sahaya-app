import {
  Sparkles, Zap, Wind, Hammer, Snowflake, Tv, Droplet, Package, Wrench,
  Car, CarTaxiFront, Truck, Paintbrush, Trees, Scissors, Home
} from 'lucide-react';

export const SERVICES = [
  { id: 1, name: 'House Help',      icon: Sparkles,  bookings: '26k+', price: 349, skill: 'House Help',       desc: 'Regular home cleaning and everyday help from trained, background-checked staff.' },
  { id: 2, name: 'Washing Machine', icon: Droplet,   bookings: '14k+', price: 499, skill: 'Appliance Repair', desc: 'Repair, installation and demo for front-load and top-load machines, all brands.' },
  { id: 3, name: 'Electrical',      icon: Zap,       bookings: '16k+', price: 299, skill: 'Electrical',       desc: 'Wiring, switchboards, MCB and fitting work by licensed electricians.' },
  { id: 4, name: 'Air Conditioner', icon: Wind,      bookings: '22k+', price: 599, skill: 'Appliance Repair', desc: 'AC service, gas top-up, installation and deep cleaning.' },
  { id: 5, name: 'Carpentry',       icon: Hammer,    bookings: '12k+', price: 399, skill: 'Carpentry',        desc: 'Furniture repair, fittings, hinges and custom woodwork.' },
  { id: 6, name: 'Refrigerator',    icon: Snowflake, bookings: '13k+', price: 449, skill: 'Appliance Repair', desc: 'Fridge repair, gas refill and cooling issues, all brands.' },
  { id: 7, name: 'Microwave Oven',  icon: Package,   bookings: '8k+',  price: 349, skill: 'Appliance Repair', desc: 'Microwave and OTG repair, and routine servicing.' },
  { id: 8, name: 'Smart TV',        icon: Tv,        bookings: '9k+',  price: 399, skill: 'Appliance Repair', desc: 'Wall mounting, panel repair and smart setup assistance.' },
  { id: 9, name: 'Plumbing',        icon: Wrench,    bookings: '13k+', price: 299, skill: 'Plumbing',         desc: 'Leak fixes, tap and pipeline work, and bathroom fittings.' },
  { id: 10, name: 'Hire a Driver',   icon: Car,           bookings: '18k+', price: 499, skill: 'Driver',           desc: 'Professional on-demand drivers for personal or commercial vehicles.' },
  { id: 11, name: 'Taxi Service',    icon: CarTaxiFront,  bookings: '24k+', price: 299, skill: 'Taxi',             desc: 'Local and outstation rides with verified cabs and drivers.' },
  { id: 12, name: 'Porter Service',  icon: Truck,         bookings: '11k+', price: 399, skill: 'Porter',           desc: 'Goods transport and luggage moving services.' },
  { id: 13, name: 'Mechanic',        icon: Wrench,        bookings: '15k+', price: 449, skill: 'Mechanic',         desc: 'On-site auto and bike repair, breakdown assistance, and tuneups.' },
  { id: 14, name: 'House Cleaning',  icon: Home,          bookings: '29k+', price: 699, skill: 'House Cleaning',   desc: 'Comprehensive deep home cleaning, dusting, and sanitization.' },
  { id: 15, name: 'Home Painting',   icon: Paintbrush,    bookings: '8k+',  price: 899, skill: 'Home Painting',    desc: 'Interior and exterior painting, waterproofing, and wall texturing.' },
  { id: 16, name: 'Coconut Plucking',icon: Trees,       bookings: '6k+',  price: 349, skill: 'Coconut Plucking', desc: 'Safe and professional coconut tree climbing, plucking, and trimming.' },
  { id: 17, name: 'Wood Cutting',    icon: Scissors,      bookings: '5k+',  price: 549, skill: 'Wood Cutting',     desc: 'Tree trimming, log cutting, and heavy timber clearing.' },
];

export const INITIAL_PROVIDERS = [
  { id: 'p1', name: 'Ramesh Kumar', skill: 'House Help', phone: '+91 98765 11111', address: 'Mavoor Road, Calicut', email: 'ramesh@sahaya.in', aadhaar_number: '5544 3322 1100', price: 350, charge: 1500, rating: 4.8, jobs: 34, status: 'approved', is_available: true },
  { id: 'p2', name: 'Sujith V', skill: 'Appliance Repair', phone: '+91 98765 22222', address: 'Kondotty, Malappuram', email: 'sujith@sahaya.in', aadhaar_number: '6677 8899 0011', price: 499, charge: 2400, rating: 4.9, jobs: 48, status: 'approved', is_available: true },
  { id: 'p3', name: 'Muhammed Ali', skill: 'Electrical', phone: '+91 98765 33333', address: 'Pattambi, Palakkad', email: 'ali@sahaya.in', aadhaar_number: '1122 3344 5566', price: 299, charge: 1800, rating: 4.7, jobs: 29, status: 'approved', is_available: true },
];

export const INITIAL_USERS = [
  { id: 'u1', name: 'Ananya Sharma', phone: '+91 98950 12345', email: 'ananya@gmail.com', joined: '12 Jan 2026', lastLogin: 'Active', bookingsCount: 4 },
  { id: 'u2', name: 'Rahul Varma', phone: '+91 98950 67890', email: 'rahul.v@gmail.com', joined: '04 Feb 2026', lastLogin: 'Active', bookingsCount: 2 },
];

export const INITIAL_BOOKINGS = [
  { id: 'b101', serviceId: 1, serviceName: 'House Help', customerName: 'Ananya Sharma', phone: '+91 98950 12345', address: 'Civil Station, Calicut', date: '2026-07-22', time: '10:00 AM', price: 349, status: 'completed', providerId: 'p1', createdAt: new Date().toISOString() },
  { id: 'b102', serviceId: 4, serviceName: 'Air Conditioner', customerName: 'Rahul Varma', phone: '+91 98950 67890', address: 'Mavoor Road, Calicut', date: '2026-07-22', time: '02:00 PM', price: 599, status: 'pending', providerId: null, createdAt: new Date().toISOString() },
];

export const INITIAL_MARKETPLACE_POSTINGS = [
  {
    id: 101,
    title: 'Second Hand Teakwood Sofa (3+2)',
    category: 'Local Sales',
    type: 'sale',
    price: 4500,
    description: 'Moving out sale! Solid teakwood frame, pristine washable cushions. Pick up near Central Park.',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    contact_phone: '+919876543210',
    location_name: 'Central Park Area, Calicut',
    lat: 11.1500,
    lng: 75.9730,
    created_at: new Date().toISOString(),
  },
  {
    id: 102,
    title: 'Urgent: Driver Needed for Outstation Trip',
    category: 'Requirements',
    type: 'requirement',
    price: 1200,
    description: 'Need experienced SUV driver for a 1-day trip to Wayanad. Daily payout + lunch provided.',
    image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
    contact_phone: '+919876512345',
    location_name: 'Civil Station, Calicut',
    lat: 11.1490,
    lng: 75.9710,
    created_at: new Date().toISOString(),
  },
  {
    id: 103,
    title: 'LG 260L Double Door Refrigerator',
    category: 'Local Sales',
    type: 'sale',
    price: 8500,
    description: '3-star energy rating, zero noise, perfect cooling. 2 years old, selling due to home shift.',
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    contact_phone: '+919988776655',
    location_name: 'Mavoor Road, Calicut',
    lat: 11.1520,
    lng: 75.9750,
    created_at: new Date().toISOString(),
  },
  {
    id: 104,
    title: 'Need Coconut Plucker for 5 Trees',
    category: 'Requirements',
    type: 'requirement',
    price: 500,
    description: 'Need professional coconut plucker to clean and harvest 5 tall coconut trees in residential yard.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    contact_phone: '+919745011223',
    location_name: 'Medical College, Calicut',
    lat: 11.1480,
    lng: 75.9700,
    created_at: new Date().toISOString(),
  },
];

export const STATUS_META = {
  pending:     { label: 'Finding a provider',    color: 'var(--amber)' },
  assigned:    { label: 'Awaiting confirmation', color: 'var(--amber)' },
  confirmed:   { label: 'Confirmed',             color: 'var(--teal)' },
  in_progress: { label: 'In progress',           color: 'var(--coral)' },
  completed:   { label: 'Completed',             color: 'var(--green)' },
  cancelled:   { label: 'Cancelled',             color: '#94A099' },
};

export const providerFor  = (b, providers) => providers.find(p => p.id === b.providerId);
export const serviceFor   = (b) => SERVICES.find(s => s.id === b.serviceId);
