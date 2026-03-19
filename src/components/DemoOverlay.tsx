import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapPin } from 'lucide-react';

export function DemoOverlay() {
  const { isDemoMode, disableDemoMode } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState('New York');

  if (!isDemoMode) return null;

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    // Dispatch a custom event that map components can listen to
    window.dispatchEvent(new CustomEvent('demo-city-change', { detail: newCity }));
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-surface/90 backdrop-blur border border-accent rounded-sm shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <h3 className="font-mono text-sm font-bold text-accent">DEMO MODE</h3>
        </div>
      </div>
      <p className="text-xs text-muted mb-4">
        You are viewing a sandbox account. Changes will not be saved.
      </p>
      
      <div className="mb-4">
        <label className="text-xs font-mono text-muted uppercase mb-1 block">Simulate City</label>
        <div className="flex gap-2">
          {['New York', 'London', 'Tokyo'].map(c => (
            <Button 
              key={c}
              variant={city === c ? 'default' : 'secondary'}
              className="h-7 text-[10px] px-2 flex-1"
              onClick={() => handleCityChange(c)}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          variant="secondary" 
          className="w-full text-xs h-8"
          onClick={() => {
            disableDemoMode();
            navigate('/login');
          }}
        >
          Exit Demo
        </Button>
        <Button 
          className="w-full text-xs h-8"
          onClick={() => {
            disableDemoMode();
            navigate('/register');
          }}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}
