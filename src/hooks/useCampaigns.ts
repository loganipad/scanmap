import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Campaign } from '../types';

type CampaignRow = {
  id: string;
  name: string;
  status: Campaign['status'];
  total_pins: number;
  total_scans: number;
  avg_conversion: number;
  last_active: string | null;
  created_at: string | null;
  user_id: string;
  pins: Campaign['pins'] | null;
};

let demoCampaignsState: Campaign[] = [
  {
    id: 'demo-1',
    name: 'Downtown Metro Test',
    status: 'active',
    totalPins: 42,
    totalScans: 14382,
    avgConversion: 9.2,
    lastActive: new Date(),
    createdAt: new Date(),
    userId: 'demo-user-123',
    pins: []
  },
  {
    id: 'demo-2',
    name: 'East Side Expansion',
    status: 'paused',
    totalPins: 15,
    totalScans: 3102,
    avgConversion: 4.1,
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    userId: 'demo-user-123',
    pins: []
  }
];

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isDemoMode } = useAuth();

  const mapRowToCampaign = (row: CampaignRow): Campaign => ({
    id: row.id,
    name: row.name,
    status: row.status,
    totalPins: row.total_pins,
    totalScans: row.total_scans,
    avgConversion: row.avg_conversion,
    lastActive: row.last_active ? new Date(row.last_active) : new Date(),
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    userId: row.user_id,
    pins: row.pins ?? [],
  });

  const fetchCampaigns = useCallback(async () => {
    if (isDemoMode) {
      setCampaigns([...demoCampaignsState]);
      setLoading(false);
      return;
    }

    if (!user) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      setLoading(false);
      return;
    }

    const mapped = ((data ?? []) as CampaignRow[]).map(mapRowToCampaign);
    setCampaigns(mapped);
    setLoading(false);
  }, [isDemoMode, user]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const addCampaign = async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'lastActive' | 'userId'>) => {
    if (isDemoMode) {
      const newCampaign: Campaign = {
        ...campaign,
        id: `demo-${Date.now()}`,
        userId: 'demo-user-123',
        createdAt: new Date(),
        lastActive: new Date()
      };
      demoCampaignsState = [newCampaign, ...demoCampaignsState];
      setCampaigns([...demoCampaignsState]);
      return;
    }
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase.from('campaigns').insert({
      name: campaign.name,
      status: campaign.status,
      total_pins: campaign.totalPins,
      total_scans: campaign.totalScans,
      avg_conversion: campaign.avgConversion,
      user_id: user.id,
      pins: campaign.pins ?? [],
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
    });

    if (error) throw error;
    await fetchCampaigns();
  };

  const updateCampaignStatus = async (id: string, status: Campaign['status']) => {
    if (isDemoMode) {
      demoCampaignsState = demoCampaignsState.map(c => c.id === id ? { ...c, status, lastActive: new Date() } : c);
      setCampaigns([...demoCampaignsState]);
      return;
    }
    const { error } = await supabase
      .from('campaigns')
      .update({ status, last_active: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    await fetchCampaigns();
  };

  const deleteCampaign = async (id: string) => {
    if (isDemoMode) {
      demoCampaignsState = demoCampaignsState.filter(c => c.id !== id);
      setCampaigns([...demoCampaignsState]);
      return;
    }
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    if (error) throw error;
    await fetchCampaigns();
  };

  return { campaigns, loading, addCampaign, updateCampaignStatus, deleteCampaign };
}
