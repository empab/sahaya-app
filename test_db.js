async function run() {
  const url = 'https://osjjxyqyifgpwfvlxczc.supabase.co/rest/v1/providers?select=*';
  const apiKey = 'sb_publishable_OnPppiz2wg609NIiu6ctNQ_xVkpSiCl';
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const text = await res.text();
    console.log('HTTP Status:', res.status);
    console.log('Response body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

run();
