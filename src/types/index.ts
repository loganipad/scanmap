export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived' | 'draft';
  totalPins: number;
  totalScans: number;
  avgConversion: number;
  lastActive: Date;
  createdAt: Date;
  userId: string;
  pins: Pin[];
}

export interface Pin {
  id: string;
  lat: number;
  lng: number;
  scans: number;
  conv: number;
  status: 'pending' | 'placed' | 'verified';
  assignedTo?: string; // Employee ID
  placedAt?: Date;
  photoUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  userId: string; // The manager's user ID
}
