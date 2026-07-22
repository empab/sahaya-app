async function run() {
  const BASE = 'https://osjjxyqyifgpwfvlxczc.supabase.co/rest/v1';
  const KEY  = 'sb_publishable_OnPppiz2wg609NIiu6ctNQ_xVkpSiCl';
  const h    = { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } };

  const tables = ['providers', 'bookings', 'services', 'customers', 'marketplace_postings'];
  for (const t of tables) {
    const r = await fetch(`${BASE}/${t}?select=*`, h);
    const d = await r.json();
    console.log(`${t}: HTTP ${r.status} | count=${Array.isArray(d) ? d.length : 'err'} | ${Array.isArray(d) ? '' : JSON.stringify(d)}`);
  }
}

run();
