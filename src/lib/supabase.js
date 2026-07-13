import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osjjxyqyifgpwfvlxczc.supabase.co';
const supabaseKey = 'sb_publishable_OnPppiz2wg609NIiu6ctNQ_xVkpSiCl';

export const supabase = createClient(supabaseUrl, supabaseKey);
