import { supabase } from './src/lib/supabase.js';

async function run() {
  const { data: bookings, error } = await supabase.from('bookings').select('*').order('id', { ascending: false });
  if (error) {
    console.error('Error fetching bookings:', error);
    return;
  }
  console.log(`Total bookings: ${bookings.length}`);
  bookings.forEach(b => {
    console.log(`ID: ${b.id} | Customer: ${b.customer_name} | Lat/Lng: ${b.lat}, ${b.lng} | ProviderID: ${b.provider_id}`);
  });
}

run();
