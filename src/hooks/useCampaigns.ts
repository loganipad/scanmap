import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Campaign } from '../types';

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

  useEffect(() => {
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

    const q = query(collection(db, 'campaigns'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const camps: Campaign[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        camps.push({
          id: doc.id,
          ...data,
          lastActive: data.lastActive?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Campaign);
      });
      setCampaigns(camps);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching campaigns:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, isDemoMode]);

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
    
    await addDoc(collection(db, 'campaigns'), {
      ...campaign,
      userId: user.uid,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    });
  };

  const updateCampaignStatus = async (id: string, status: Campaign['status']) => {
    if (isDemoMode) {
      demoCampaignsState = demoCampaignsState.map(c => c.id === id ? { ...c, status, lastActive: new Date() } : c);
      setCampaigns([...demoCampaignsState]);
      return;
    }
    const ref = doc(db, 'campaigns', id);
    await updateDoc(ref, { status, lastActive: serverTimestamp() });
  };

  const deleteCampaign = async (id: string) => {
    if (isDemoMode) {
      demoCampaignsState = demoCampaignsState.filter(c => c.id !== id);
      setCampaigns([...demoCampaignsState]);
      return;
    }
    await deleteDoc(doc(db, 'campaigns', id));
  };

  return { campaigns, loading, addCampaign, updateCampaignStatus, deleteCampaign };
}
