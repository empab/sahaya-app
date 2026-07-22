import { supabase } from './src/lib/supabase.js';

async function createTable() {
  console.log('Testing SQL table creation for marketplace_postings...');
  
  const { data, error } = await supabase.from('marketplace_postings').insert({
    title: 'Test Posting',
    category: 'Local Sales',
    type: 'sale',
    price: 100,
    description: 'Test description',
    contact_phone: '+91 98765 43210',
    location_name: 'Calicut',
    lat: 11.1495,
    lng: 75.9723
  }).select();

  if (error) {
    console.error('Insert error:', error.message, error.code);
  } else {
    console.log('Successfully created row:', data);
  }
}

createTable();
