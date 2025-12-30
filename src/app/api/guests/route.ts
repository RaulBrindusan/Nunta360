import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use regular client for authentication
    const supabase = await createClient();
    
    console.log('API GET: Getting user from server-side client');
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('API GET: User from auth.getUser():', user?.id);
    console.log('API GET: Auth error:', authError);
    
    if (authError || !user) {
      console.log('API GET: No user or auth error, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('API GET: User authenticated, fetching guests');

    // Use service role client for the actual database operation to bypass RLS
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await serviceSupabase
      .from('guests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('API GET: Error fetching guests:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log('API GET: Successfully fetched guests:', data?.length || 0, 'guests');

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Use regular client for authentication
    const supabase = await createClient();
    
    console.log('API: Getting user and session from server-side client');
    
    // Get the session first, then set it on the client
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('API: Session exists:', !!session);
    console.log('API: Session user:', session?.user?.id);
    console.log('API: Session error:', sessionError);
    
    if (session && session.access_token) {
      // Manually set the session to ensure the JWT is available for RLS
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      });
      console.log('API: Session manually set on client');
    }
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('API: User from auth.getUser():', user?.id);
    console.log('API: Auth error:', authError);
    
    if (authError || !user) {
      console.log('API: No user or auth error, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('API: User authenticated, proceeding with insert');

    const body = await request.json();
    const {
      name,
      phone_number,
      is_family,
      family_size,
      status,
      menu_preference,
      family_members
    } = body;

    const insertData: any = {
      user_id: user.id,
      name,
      phone_number: phone_number || null,
      is_family: is_family || false,
      family_size: family_size || 1,
      status: status || 'in_asteptare',
      menu_preference: menu_preference || 'normal',
    };
    
    // Only add family_members if we have data and it's a family
    if (is_family && family_members && family_members.length > 0) {
      insertData.family_members = family_members;
    }

    console.log('API: About to insert data:', insertData);
    
    // Use service role client for the actual database operation to bypass RLS
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await serviceSupabase
      .from('guests')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('API: Error adding guest:', error);
      console.error('API: Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log('API: Successfully inserted guest:', data);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Use regular client for authentication
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    console.log('API PUT: Updating guest:', { id, updates });

    // Use service role client for the actual database operation to bypass RLS
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await serviceSupabase
      .from('guests')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('API PUT: Error updating guest:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('API PUT: Successfully updated guest:', data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('API PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Use regular client for authentication
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    console.log('API DELETE: Deleting guest:', id);

    // Use service role client for the actual database operation to bypass RLS
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!
    );
    
    const { error } = await serviceSupabase
      .from('guests')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('API DELETE: Error deleting guest:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('API DELETE: Successfully deleted guest');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}