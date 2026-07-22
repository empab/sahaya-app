import { supabase } from './src/lib/supabase.js';

async function run() {
  const [pRes, bRes, sRes, cRes] = await Promise.all([
    supabase.from('providers').select('*'),
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('services').select('*').order('id', { ascending: true }),
    supabase.from('customers').select('*'),
  ]);
  console.log('--- SERVICES ---', sRes.data?.length);
  console.log(sRes.data?.map(s => `[${s.id}] ${s.name} (₹${s.price})`));

  console.log('\n--- PROVIDERS ---', pRes.data?.length);
  console.log(pRes.data?.map(p => `[${p.id}] ${p.name} - ${p.skill} (${p.status})`));

  console.log('\n--- CUSTOMERS ---', cRes.data?.length);
  console.log(cRes.data?.map(c => `[${c.id}] ${c.name} (${c.phone})`));

  console.log('\n--- RECENT BOOKINGS ---', bRes.data?.length);
  console.log(bRes.data?.map(b => `[${b.id}] ${b.service_name} by ${b.customer_name} (${b.status})`));
}

run();
