import { useState, useEffect } from "react";
import { Card, Badge, Button } from "../../components/ui";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Filter, Calendar, Map as MapIcon, Download } from "lucide-react";

// Demo heatmap data
const heatDataByCity: Record<string, number[][]> = {
  'New York': [
    [40.7580, -73.9855, 0.8], // Times Square
    [40.7590, -73.9845, 0.6],
    [40.7614, -73.9776, 0.9], // MoMA
    [40.7488, -73.9856, 0.7], // Empire State
    [40.7527, -73.9772, 0.5], // Grand Central
    [40.7643, -73.9730, 0.4], // Central Park Zoo
    [40.7549, -73.9840, 0.6], // Bryant Park
    [40.7505, -73.9934, 0.8], // Penn Station
    [40.7565, -73.9920, 0.5], // Port Authority
    [40.7671, -73.9822, 0.7], // Columbus Circle
  ],
  'London': [
    [51.5074, -0.1278, 0.8],
    [51.5113, -0.1160, 0.6],
    [51.5033, -0.1195, 0.9],
    [51.5154, -0.1410, 0.7],
    [51.5055, -0.0905, 0.5],
  ],
  'Tokyo': [
    [35.6762, 139.6503, 0.8],
    [35.6895, 139.6917, 0.6],
    [35.6580, 139.7016, 0.9],
    [35.7100, 139.8107, 0.7],
    [35.6244, 139.7758, 0.5],
  ]
};

const cityCenters: Record<string, [number, number]> = {
  'New York': [40.7580, -73.9855],
  'London': [51.5074, -0.1278],
  'Tokyo': [35.6762, 139.6503]
};

function HeatmapLayer({ data, options }: { data: number[][], options: any }) {
  const map = useMap();
  
  useEffect(() => {
    const layer = (L as any).heatLayer(data, options).addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, data, options]);
  
  return null;
}

// Component to handle map center changes
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

export function HeatmapView() {
  const [timeRange, setTimeRange] = useState("30d");
  const [currentCity, setCurrentCity] = useState('New York');

  useEffect(() => {
    const handleCityChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrentCity(customEvent.detail);
    };
    window.addEventListener('demo-city-change', handleCityChange);
    return () => window.removeEventListener('demo-city-change', handleCityChange);
  }, []);

  const heatData = heatDataByCity[currentCity] || heatDataByCity['New York'];
  const center = cityCenters[currentCity] || cityCenters['New York'];

  return (
    <div className="flex flex-col h-full bg-bg">
      <div className="p-6 border-b border-border bg-surface flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">Scan Heatmap</h1>
          <p className="text-sm text-muted">Visualize scan density across all active campaigns.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-bg border border-border rounded-md overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm font-medium ${timeRange === '7d' ? 'bg-accent text-bg' : 'text-muted hover:bg-surface-hover'}`}
              onClick={() => setTimeRange('7d')}
            >
              7D
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${timeRange === '30d' ? 'bg-accent text-bg' : 'text-muted hover:bg-surface-hover'}`}
              onClick={() => setTimeRange('30d')}
            >
              30D
            </button>
          </div>
          <Button variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer 
          center={center} 
          zoom={13} 
          className="h-full w-full bg-bg"
          zoomControl={true}
        >
          <MapUpdater center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <HeatmapLayer 
            data={heatData} 
            options={{ 
              radius: 25, 
              blur: 15, 
              maxZoom: 15,
              gradient: {
                0.4: '#00FF00', // Green
                0.6: '#FFFF00', // Yellow
                0.8: '#FFA500', // Orange
                1.0: '#FF0000'  // Red
              }
            }} 
          />
        </MapContainer>
        
        {/* Legend Overlay */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-surface/90 backdrop-blur-md border border-border p-4 rounded-lg shadow-xl">
          <h4 className="text-xs font-bold text-text mb-3 uppercase tracking-wider">Scan Density</h4>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-sm bg-[#FF0000]"></div>
            <span className="text-xs text-muted">Very High</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-sm bg-[#FFA500]"></div>
            <span className="text-xs text-muted">High</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-sm bg-[#FFFF00]"></div>
            <span className="text-xs text-muted">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[#00FF00]"></div>
            <span className="text-xs text-muted">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
