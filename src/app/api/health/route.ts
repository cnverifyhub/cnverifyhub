import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const status: Record<string, any> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      supabase: 'unknown',
      redis: 'disabled'
    }
  };

  let statusCode = 200;

  // 1. Supabase Check
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      // Run quick query to verify connection
      const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });
      
      if (error) {
        status.services.supabase = `error: ${error.message}`;
        status.status = 'degraded';
        statusCode = 503;
      } else {
        status.services.supabase = 'connected';
      }
    } else {
      status.services.supabase = 'error: missing configuration';
      status.status = 'degraded';
      statusCode = 503;
    }
  } catch (err: any) {
    status.services.supabase = `error: ${err.message || err}`;
    status.status = 'degraded';
    statusCode = 503;
  }

  // 2. Redis Rate Limiter Check (If configured)
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    if (redisUrl) {
      // Just check config presence, middleware handles actual calls safely
      status.services.redis = 'configured';
    }
  } catch (err) {
    status.services.redis = 'error';
  }

  return NextResponse.json(status, { status: statusCode });
}
