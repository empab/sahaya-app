// Clean Supabase DB script - ES module
import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs';

const supabaseUrl = 'https://osjjxyqyifgpwfvlxczc.supabase.co';
const supabaseKey = 'sb_publishable_OnPppiz2wg609NIiu6ctNQ_xVkpSiCl';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanAll() {
  console.log('🧹 Starting Sahaya DB cleanup...\n');

  // 1. Delete all marketplace postings
  try {
    const { error } = await supabase.from('marketplace_postings').delete().gte('id', 0);
    if (error) console.log('marketplace_postings error:', error.message);
    else console.log('✅ marketplace_postings - Cleared');
  } catch (e) { console.log('marketplace_postings failed:', e.message); }

  // 2. Delete all bookings
  try {
    const { error } = await supabase.from('bookings').delete().neq('status', '_never_exists_sentinel_');
    if (error) console.log('bookings error:', error.message);
    else console.log('✅ bookings - Cleared');
  } catch (e) { console.log('bookings failed:', e.message); }

  // 3. Delete all providers
  try {
    const { error } = await supabase.from('providers').delete().gte('id', 0);
    if (error) console.log('providers error:', error.message);
    else console.log('✅ providers - Cleared');
  } catch (e) { console.log('providers failed:', e.message); }

  // 4. Delete all customers
  try {
    const { error } = await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.log('customers error:', error.message);
    else console.log('✅ customers - Cleared');
  } catch (e) { console.log('customers failed:', e.message); }

  // 5. Reset booking count on all services to 0
  try {
    const { error } = await supabase.from('services').update({ bookings: '0' }).gte('id', 0);
    if (error) console.log('services reset error:', error.message);
    else console.log('✅ services bookings count - Reset to 0');
  } catch (e) { console.log('services reset failed:', e.message); }

  console.log('\n🎉 DB Cleanup complete! Sahaya is now a fresh start.');
  console.log('\n⚠️  Note: Auth users must also be removed via Supabase Dashboard → Authentication → Users');
  console.log('    to force-logout all existing customer/provider logins.\n');
}

cleanAll().catch(console.error);
