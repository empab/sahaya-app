import {
  Sparkles, Zap, Wind, Hammer, Snowflake, Tv, Droplet, Package, Wrench,
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
];

export const INITIAL_PROVIDERS = [
  { id: 1, name: 'Rajesh Kumar',  skill: 'Electrical',       rating: 4.8, jobs: 212, status: 'approved', phone: '98650 xxx01', earnings: 48200 },
  { id: 2, name: 'Anitha Menon',  skill: 'House Help',       rating: 4.9, jobs: 340, status: 'approved', phone: '98650 xxx02', earnings: 71600 },
  { id: 3, name: 'Suresh Nair',   skill: 'Plumbing',         rating: 4.6, jobs: 150, status: 'approved', phone: '98650 xxx03', earnings: 33900 },
  { id: 4, name: 'Divya Raj',     skill: 'Appliance Repair', rating: 4.7, jobs: 288, status: 'approved', phone: '98650 xxx04', earnings: 62100 },
  { id: 5, name: 'Vinod P.',      skill: 'Carpentry',        rating: 0,   jobs: 0,   status: 'pending',  phone: '98650 xxx05', earnings: 0 },
];

export const INITIAL_USERS = [
  { id: 1, name: 'Priya S.',   phone: '99470 11223', joined: '12 Mar 2026', bookingsCount: 3 },
  { id: 2, name: 'Arun Das',   phone: '99470 55221', joined: '02 May 2026', bookingsCount: 1 },
  { id: 3, name: 'Fathima K.', phone: '99470 88760', joined: '18 Jun 2026', bookingsCount: 5 },
];

export const INITIAL_BOOKINGS = [
  { id: 1001, serviceId: 3, serviceName: 'Electrical',      customerName: 'Priya S.',   phone: '99470 11223', address: '4B Palm Residency, Kondotty',     date: '13 Jul', time: '10:00 AM', price: 299, notes: 'Switchboard sparking in kitchen', status: 'confirmed',  providerId: 1, createdAt: 'Today' },
  { id: 1002, serviceId: 2, serviceName: 'Washing Machine', customerName: 'Arun Das',   phone: '99470 55221', address: '12 Green Villa, Malappuram Rd',   date: '13 Jul', time: '2:00 PM',  price: 499, notes: 'Not spinning',                  status: 'in_progress', providerId: 4, createdAt: 'Today' },
  { id: 1003, serviceId: 1, serviceName: 'House Help',      customerName: 'Fathima K.', phone: '99470 88760', address: '9 Rose Apartments, Kondotty',     date: '10 Jul', time: '9:00 AM',  price: 349, notes: '',                             status: 'completed', providerId: 2, createdAt: '2 days ago' },
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
