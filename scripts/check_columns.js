const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkColumns() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'products' });
  if (error) {
    // If RPC doesn't exist, try a simple select
    const { data: sample, error: selectError } = await supabase.from('products').select('*').limit(1);
    if (selectError) {
      console.error(selectError);
    } else {
      console.log('Columns:', Object.keys(sample[0] || {}));
    }
  } else {
    console.log(data);
  }
}
checkColumns();
