const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTables() {
  const { data, error } = await supabase.rpc('get_tables');
  if (error) {
    // Fallback: list of tables we expect
    const tables = ['profiles', 'orders', 'order_items', 'vault_accounts', 'fraud_blocklist', 'fraud_events', 'products'];
    for (const t of tables) {
      const { error: te } = await supabase.from(t).select('id').limit(1);
      console.log(`Table ${t}: ${te ? 'MISSING (' + te.message + ')' : 'EXISTS'}`);
    }
  } else {
    console.log(data);
  }
}
checkTables();
