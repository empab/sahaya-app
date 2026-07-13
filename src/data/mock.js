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

export const INITIAL_PROVIDERS = [];

export const INITIAL_USERS = [];

export const INITIAL_BOOKINGS = [];

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
