import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    console.log('Auth Test: Getting user from server-side client');
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('Auth Test: User from auth.getUser():', user?.id);
    console.log('Auth Test: Auth error:', authError);
    
    // Get session 
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Auth Test: Session user:', session?.user?.id);
    console.log('Auth Test: Session error:', sessionError);
    console.log('Auth Test: Access token exists:', !!session?.access_token);
    
    return NextResponse.json({ 
      user: user?.id || null,
      session_user: session?.user?.id || null,
      has_token: !!session?.access_token,
      auth_error: authError?.message || null,
      session_error: sessionError?.message || null
    });
  } catch (error) {
    console.error('Auth Test API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}