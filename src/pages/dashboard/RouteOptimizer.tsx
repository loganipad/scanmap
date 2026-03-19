import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Badge } from "../../components/ui";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, Download, Play, Map as MapIcon } from "lucide-react";

const demoDataByCity: Record<string, any[]> = {
  'New York': [
    { id: "A1", lat: 40.7580, lng: -73.9855 },
    { id: "B3", lat: 40.7590, lng: -73.9845 },
    { id: "A2", lat: 40.7614, lng: -73.9776 },
    { id: "C3", lat: 40.7671, lng: -73.9822 },
    { id: "D1", lat: 40.7694, lng: -73.9813 },
    { id: "C1", lat: 40.7643, lng: -73.9730 },
    { id: "B2", lat: 40.7549, lng: -73.9840 },
    { id: "A3", lat: 40.7527, lng: -73.9772 },
    { id: "B1", lat: 40.7488, lng: -73.9856 },
    { id: "C2", lat: 40.7520, lng: -73.9900 },
    { id: "D2", lat: 40.7565, lng: -73.9920 },
    { id: "C4", lat: 40.7505, lng: -73.9934 },
    { id: "D3", lat: 40.7530, lng: -73.9970 },
    { id: "D4", lat: 40.7474, lng: -73.9971 },
  ],
  'London': [
    { id: "L1", lat: 51.5074, lng: -0.1278 },
    { id: "L2", lat: 51.5113, lng: -0.1160 },
    { id: "L3", lat: 51.5033, lng: -0.1195 },
    { id: "L4", lat: 51.5154, lng: -0.1410 },
    { id: "L5", lat: 51.5055, lng: -0.0905 },
  ],
  'Tokyo': [
    { id: "T1", lat: 35.6762, lng: 139.6503 },
    { id: "T2", lat: 35.6895, lng: 139.6917 },
    { id: "T3", lat: 35.6580, lng: 139.7016 },
    { id: "T4", lat: 35.7100, lng: 139.8107 },
    { id: "T5", lat: 35.6244, lng: 139.7758 },
  ]
};

const cityCenters: Record<string, [number, number]> = {
  'New York': [40.7580, -73.9855],
  'London': [51.5074, -0.1278],
  'Tokyo': [35.6762, 139.6503]
};

const createCustomIcon = (label: string, color: string) => {
  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #AAFF00;
          background: #0C0C0E;
          border: 1px solid #AAFF00;
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

// Component to handle map center changes
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

export function RouteOptimizer() {
  const [activeStop, setActiveStop] = useState(0);
  const [mode, setMode] = useState<'walking' | 'driving'>('walking');
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [currentCity, setCurrentCity] = useState('New York');

  useEffect(() => {
    const handleCityChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrentCity(customEvent.detail);
      setActiveStop(0);
    };
    window.addEventListener('demo-city-change', handleCityChange);
    return () => window.removeEventListener('demo-city-change', handleCityChange);
  }, []);

  const demoData = demoDataByCity[currentCity] || demoDataByCity['New York'];
  const center = cityCenters[currentCity] || cityCenters['New York'];

  const routePositions = demoData.map(p => [p.lat, p.lng] as [number, number]);

  useEffect(() => {
    const fetchRoute = async () => {
      const coords = demoData.map(p => `${p.lng},${p.lat}`).join(';');
      const profile = mode === 'walking' ? 'foot' : 'driving';
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates;
          // GeoJSON is [lng, lat], Leaflet wants [lat, lng]
          setRouteGeometry(coordinates.map((c: [number, number]) => [c[1], c[0]]));
        }
      } catch (err) {
        console.error("Failed to fetch route", err);
      }
    };
    fetchRoute();
  }, [mode, demoData]);

  return (
    <div className="flex h-full bg-bg overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-[300px] flex flex-col border-r border-border bg-surface shrink-0 z-10">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold text-text mb-4">Optimized Route</h2>
          <div className="flex gap-2 mb-4">
            <Button variant={mode === 'walking' ? 'primary' : 'secondary'} className="flex-1 h-8 text-xs" onClick={() => setMode('walking')}>Walking</Button>
            <Button variant={mode === 'driving' ? 'primary' : 'secondary'} className="flex-1 h-8 text-xs" onClick={() => setMode('driving')}>Driving</Button>
          </div>
          <Link to="/deploy/demo">
            <Button className="w-full h-10 gap-2">
              <Play className="h-4 w-4" /> Start Route Mode
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {demoData.map((stop, i) => (
            <div 
              key={stop.id} 
              className={`flex items-center p-3 border-l-2 ${activeStop === i ? 'border-accent bg-accent/5' : 'border-transparent hover:bg-surface/50'} cursor-pointer transition-colors`}
              onClick={() => setActiveStop(i)}
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted">Stop {i + 1}</span>
                  <ArrowRight className="h-3 w-3 text-muted" />
                  <span className="font-mono text-sm text-accent font-bold">{stop.id}</span>
                </div>
                <span className="font-mono text-[10px] text-muted">{stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border bg-surface flex flex-col gap-2">
          <Button variant="secondary" className="w-full h-8 text-xs gap-2" onClick={() => {
            const origin = `${demoData[0].lat},${demoData[0].lng}`;
            const destination = `${demoData[demoData.length - 1].lat},${demoData[demoData.length - 1].lng}`;
            const waypoints = demoData.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|');
            const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=${mode}`;
            window.open(url, '_blank');
          }}>
            <MapIcon className="h-3 w-3" /> Open in Google Maps
          </Button>
          <Button variant="secondary" className="w-full h-8 text-xs gap-2" onClick={() => window.print()}>
            <Download className="h-3 w-3" /> Export Route PDF
          </Button>
          <Button variant="secondary" className="w-full h-8 text-xs gap-2" onClick={() => {
            const header = "Stop,ID,Latitude,Longitude\n";
            const rows = demoData.map((p, i) => `${i + 1},${p.id},${p.lat},${p.lng}`).join('\n');
            const csv = header + rows;
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `route-${currentCity.toLowerCase().replace(' ', '-')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}>
            <Download className="h-3 w-3" /> Export Route CSV
          </Button>
        </div>
      </div>

      {/* RIGHT PANEL: MAP */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={center} 
          zoom={14} 
          className="h-full w-full bg-bg"
          zoomControl={true}
        >
          <MapUpdater center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          <Polyline positions={routeGeometry.length > 0 ? routeGeometry : routePositions} pathOptions={{ color: '#AAFF00', weight: 3, dashArray: routeGeometry.length > 0 ? undefined : '5, 10' }} />
          
          {demoData.map((pin, i) => (
            <Marker 
              key={pin.id} 
              position={[pin.lat, pin.lng]} 
              icon={createCustomIcon(pin.id, i === activeStop ? '#AAFF00' : '#444444')}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
