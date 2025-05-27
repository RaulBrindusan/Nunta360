
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WeddingDetails {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date?: string;
  created_at: string;
  updated_at: string;
}

export const useWeddingDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeddingDetails = async () => {
    if (!user) {
      setWeddingDetails(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wedding_details')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching wedding details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch wedding details",
          variant: "destructive",
        });
      } else {
        setWeddingDetails(data);
      }
    } catch (error) {
      console.error('Error fetching wedding details:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWeddingDetails = async (details: {
    bride_name: string;
    groom_name: string;
    wedding_date?: string;
  }) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('wedding_details')
        .upsert({
          user_id: user.id,
          bride_name: details.bride_name,
          groom_name: details.groom_name,
          wedding_date: details.wedding_date || null,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving wedding details:', error);
        toast({
          title: "Error",
          description: "Failed to save wedding details",
          variant: "destructive",
        });
        return false;
      }

      setWeddingDetails(data);
      toast({
        title: "Success",
        description: "Wedding details saved successfully",
      });
      return true;
    } catch (error) {
      console.error('Error saving wedding details:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchWeddingDetails();
  }, [user]);

  return {
    weddingDetails,
    loading,
    saveWeddingDetails,
    refetch: fetchWeddingDetails,
  };
};
