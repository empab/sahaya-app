import { supabase } from './src/lib/supabase.js';

async function run() {
  console.log('Testing browser anon client queries to Supabase...');
  const pRes = await supabase.from('providers').select('*');
  console.log('Providers count:', pRes.data?.length, 'data:', pRes.data, 'error:', pRes.error);

  const bRes = await supabase.from('bookings').select('*');
  console.log('Bookings count:', bRes.data?.length, 'error:', bRes.error);

  const sRes = await supabase.from('services').select('*');
  console.log('Services count:', sRes.data?.length, 'error:', sRes.error);

  const cRes = await supabase.from('customers').select('*');
  console.log('Customers count:', cRes.data?.length, 'error:', cRes.error);
}

run();
