import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use regular client for authentication
    const supabase = await createClient();
    
    console.log('API GET: Getting user from server-side client (table-guests)');
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('API GET: User from auth.getUser() (table-guests):', user?.id);
    console.log('API GET: Auth error (table-guests):', authError);
    
    if (authError || !user) {
      console.log('API GET: No user or auth error, returning 401 (table-guests)');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('API GET: User authenticated, fetching table guests');

    // Use service role client for the actual database operation to bypass RLS
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await serviceSupabase
      .from('table_guests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('API GET: Error fetching table guests:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log('API GET: Successfully fetched table guests:', data?.length || 0, 'table guests');

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API GET error (table-guests):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Use regular client for authentication
    const supabase = await createClient();
    
    console.log('API POST: Getting user from server-side client (table-guests)');
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('API POST: User from auth.getUser() (table-guests):', user?.id);
    console.log('API POST: Auth error (table-guests):', authError);
    
    if (authError || !user) {
      console.log('API POST: No user or auth error, returning 401 (table-guests)');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('API POST: User authenticated, proceeding with table guest assignment');

    const body = await request.json();
    const {
      guest_id,
      guest_name,
      table_id,
      table_name,
      event_id
    } = body;

    const insertData: any = {
      user_id: user.id,
      name: guest_name,
      table_id,
      table_name: table_name || null,
      event_id: event_id || null,
    };

    // Only add guest_id if it's provided
    if (guest_id) {
      insertData.guest_id = guest_id;
    }

    console.log('API POST: About to insert table guest data:', insertData);
    
    // Use service role client for the actual database operation to bypass RLS
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await serviceSupabase
      .from('table_guests')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('API POST: Error adding table guest:', error);
      console.error('API POST: Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log('API POST: Successfully inserted table guest:', data);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API POST error (table-guests):', error);
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

    // Use service role client for the actual database operation to bypass RLS
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await serviceSupabase
      .from('table_guests')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('API PUT: Error updating table guest:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API PUT error (table-guests):', error);
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

    // Use service role client for the actual database operation to bypass RLS
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!
    );
    
    const { error } = await serviceSupabase
      .from('table_guests')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('API DELETE: Error deleting table guest:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API DELETE error (table-guests):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}