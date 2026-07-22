import { supabase } from './src/lib/supabase.js';

const initialPostings = [
  {
    id: 1,
    title: 'Second Hand Sofa Set - 3+2 Seater',
    category: 'Local Sales',
    type: 'sale',
    price: 4500,
    description: 'Good condition teakwood frame sofa set with washable cushion covers. Moving out sale.',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    contact_phone: '+91 98765 43210',
    location_name: 'Near Central Park, Calicut',
    lat: 11.1500,
    lng: 75.9730
  },
  {
    id: 2,
    title: 'Urgent: Driver Needed for Outstation Trip',
    category: 'Requirement',
    type: 'requirement',
    price: 1200,
    description: 'Need experienced SUV driver for a 1-day trip to Wayanad tomorrow morning at 6 AM.',
    image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
    contact_phone: '+91 98765 12345',
    location_name: 'Civil Station Area, Calicut',
    lat: 11.1490,
    lng: 75.9710
  },
  {
    id: 3,
    title: 'LG 260L Double Door Refrigerator',
    category: 'Local Sales',
    type: 'sale',
    price: 8500,
    description: '3 star energy rating, works perfectly. 2 years old, selling due to upgrade.',
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    contact_phone: '+91 99887 76655',
    location_name: 'Mavoor Road, Calicut',
    lat: 11.1520,
    lng: 75.9750
  },
  {
    id: 4,
    title: 'Need Coconut Plucker for 5 Trees',
    category: 'Requirement',
    type: 'requirement',
    price: 500,
    description: 'Need skilled coconut plucker to clean and harvest 5 tall coconut trees in residential yard.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    contact_phone: '+91 97450 11223',
    location_name: 'Medical College Junction, Calicut',
    lat: 11.1480,
    lng: 75.9700
  }
];

async function seedMarketplace() {
  console.log('Seeding marketplace_postings table in Supabase...');
  for (const post of initialPostings) {
    const { data, error } = await supabase.from('marketplace_postings').upsert(post, { onConflict: 'id' }).select();
    if (error) {
      console.error(`Error seeding post ${post.title}:`, error.message);
    } else {
      console.log(`Successfully seeded post: ${post.title} (ID: ${post.id})`);
    }
  }
  console.log('Finished marketplace seeding!');
}

seedMarketplace();
