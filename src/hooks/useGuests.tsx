
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Guest {
  id: string;
  name: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export const useGuests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = async () => {
    if (!user) {
      setGuests([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching guests:', error);
        toast({
          title: "Error",
          description: "Failed to fetch guests",
          variant: "destructive",
        });
      } else {
        setGuests(data || []);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGuest = async (name: string, phoneNumber?: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('guests')
        .insert({
          user_id: user.id,
          name,
          phone_number: phoneNumber || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding guest:', error);
        toast({
          title: "Error",
          description: "Failed to add guest",
          variant: "destructive",
        });
        return false;
      }

      setGuests(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Guest added successfully",
      });
      return true;
    } catch (error) {
      console.error('Error adding guest:', error);
      return false;
    }
  };

  const deleteGuest = async (guestId: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (error) {
        console.error('Error deleting guest:', error);
        toast({
          title: "Error",
          description: "Failed to delete guest",
          variant: "destructive",
        });
        return false;
      }

      setGuests(prev => prev.filter(guest => guest.id !== guestId));
      toast({
        title: "Success",
        description: "Guest deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting guest:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [user]);

  return {
    guests,
    loading,
    addGuest,
    deleteGuest,
    refetch: fetchGuests,
  };
};
