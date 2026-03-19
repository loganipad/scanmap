import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Card, Badge } from "../components/ui";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Camera, CheckCircle2, MapPin, Navigation, ArrowLeft } from "lucide-react";

// Demo data
const demoStops = [
  { id: "A1", lat: 40.7580, lng: -73.9855, status: 'completed' },
  { id: "B3", lat: 40.7590, lng: -73.9845, status: 'pending' },
  { id: "A2", lat: 40.7614, lng: -73.9776, status: 'pending' },
];

const createCustomIcon = (label: string, status: string) => {
  const color = status === 'completed' ? '#34A853' : '#AAFF00';
  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: ${color};
          background: #0C0C0E;
          border: 1px solid ${color};
          border-radius: 2px;
          padding: 1px 4px;
          margin-bottom: 2px;
          white-space: nowrap;
        ">${label}</div>
        <div style="
          width: 20px;
          height: 20px;
          background: ${color};
          border: 2px solid #0C0C0E;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
        "></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

export function DeployMode() {
  const { id } = useParams();
  const [activeStop, setActiveStop] = useState(1); // Start at first pending
  const [stops, setStops] = useState(demoStops);
  const [cameraOpen, setCameraOpen] = useState(false);

  const handleConfirmPlacement = () => {
    const newStops = [...stops];
    newStops[activeStop].status = 'completed';
    setStops(newStops);
    setCameraOpen(false);
    
    // Move to next pending stop
    const nextPending = newStops.findIndex(s => s.status === 'pending');
    if (nextPending !== -1) {
      setActiveStop(nextPending);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/route" className="text-muted hover:text-text transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-text">Deploying: Campaign #{id || 'DEMO'}</h1>
            <p className="text-xs text-muted font-mono">{stops.filter(s => s.status === 'completed').length} / {stops.length} Placed</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
          Live Mode
        </Badge>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 relative flex flex-col md:flex-row">
        
        {/* MAP AREA */}
        <div className="flex-1 relative z-0 h-[50vh] md:h-auto">
          <MapContainer 
            center={[40.7590, -73.9845]} 
            zoom={15} 
            className="h-full w-full bg-bg"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {stops.map((pin, i) => (
              <Marker 
                key={pin.id} 
                position={[pin.lat, pin.lng]} 
                icon={createCustomIcon(pin.id, pin.status)}
              />
            ))}
          </MapContainer>
        </div>

        {/* ACTION PANEL */}
        <div className="h-[50vh] md:h-auto md:w-[400px] bg-surface border-t md:border-t-0 md:border-l border-border flex flex-col shrink-0 z-10 shadow-2xl">
          
          {/* Current Stop Info */}
          <div className="p-6 border-b border-border flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text">Current Stop</h2>
              <Badge variant="outline" className="font-mono text-accent border-accent">{stops[activeStop]?.id}</Badge>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center shrink-0 border border-border">
                  <MapPin className="h-5 w-5 text-muted" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text mb-1">Location</h3>
                  <p className="text-sm text-muted font-mono">{stops[activeStop]?.lat.toFixed(4)}, {stops[activeStop]?.lng.toFixed(4)}</p>
                  <p className="text-sm text-muted mt-1">Times Square Area, NYC</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center shrink-0 border border-border">
                  <Navigation className="h-5 w-5 text-muted" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text mb-1">Instructions</h3>
                  <p className="text-sm text-muted">Place flyer on the community board near the main entrance. Ensure QR code is clearly visible at eye level.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-bg border-t border-border mt-auto">
            {cameraOpen ? (
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 border-2 border-accent/50 m-4 rounded border-dashed"></div>
                  <p className="text-muted text-sm z-10">Camera View (Simulated)</p>
                </div>
                <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setCameraOpen(false)}>Cancel</Button>
                  <Button variant="primary" className="flex-1 gap-2" onClick={handleConfirmPlacement}>
                    <CheckCircle2 className="h-4 w-4" /> Confirm
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Button variant="secondary" className="w-full h-12 gap-2 text-base">
                  <Navigation className="h-5 w-5" /> Open in Maps
                </Button>
                <Button 
                  variant="primary" 
                  className="w-full h-14 gap-2 text-lg font-bold shadow-lg shadow-accent/20"
                  onClick={() => setCameraOpen(true)}
                  disabled={stops[activeStop]?.status === 'completed'}
                >
                  <Camera className="h-6 w-6" /> 
                  {stops[activeStop]?.status === 'completed' ? 'Completed' : 'Verify Placement'}
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
