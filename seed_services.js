import { supabase } from './src/lib/supabase.js';

const newServices = [
  {
    id: 10,
    name: 'Hire a Driver',
    icon: 'driver',
    price: 499,
    skill: 'Driver',
    desc: 'Professional on-demand drivers for personal or commercial vehicles.',
    bookings: '18'
  },
  {
    id: 11,
    name: 'Taxi Service',
    icon: 'taxi',
    price: 299,
    skill: 'Taxi',
    desc: 'Local and outstation rides with verified cabs and drivers.',
    bookings: '24'
  },
  {
    id: 12,
    name: 'Porter Service',
    icon: 'porter',
    price: 399,
    skill: 'Porter',
    desc: 'Goods transport and luggage moving services.',
    bookings: '11'
  },
  {
    id: 13,
    name: 'Mechanic',
    icon: 'mechanic',
    price: 449,
    skill: 'Mechanic',
    desc: 'On-site auto and bike repair, breakdown assistance, and tuneups.',
    bookings: '15'
  },
  {
    id: 14,
    name: 'House Cleaning',
    icon: 'house_cleaning',
    price: 699,
    skill: 'House Cleaning',
    desc: 'Comprehensive deep home cleaning, dusting, and sanitization.',
    bookings: '29'
  },
  {
    id: 15,
    name: 'Home Painting',
    icon: 'home_painting',
    price: 899,
    skill: 'Home Painting',
    desc: 'Interior and exterior painting, waterproofing, and wall texturing.',
    bookings: '8'
  },
  {
    id: 16,
    name: 'Coconut Plucking',
    icon: 'coconut',
    price: 349,
    skill: 'Coconut Plucking',
    desc: 'Safe and professional coconut tree climbing, plucking, and trimming.',
    bookings: '6'
  },
  {
    id: 17,
    name: 'Wood Cutting',
    icon: 'wood_cutting',
    price: 549,
    skill: 'Wood Cutting',
    desc: 'Tree trimming, log cutting, and heavy timber clearing.',
    bookings: '5'
  }
];

async function seed() {
  console.log('Seeding 8 new services into Supabase database...');
  for (const s of newServices) {
    const { data, error } = await supabase.from('services').upsert(s, { onConflict: 'id' }).select();
    if (error) {
      console.error(`Error seeding service ${s.name}:`, error.message);
    } else {
      console.log(`Successfully seeded: ${s.name} (ID: ${s.id})`);
    }
  }
  console.log('Finished seeding services!');
}

seed();
