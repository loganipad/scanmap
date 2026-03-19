import { Link } from "react-router-dom";
import { Card, Button, Badge } from "../../components/ui";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import "leaflet.heat";
import { Map as MapIcon, Play, Pause, Trash2, Edit2, Eye, Users } from "lucide-react";
import { useCampaigns } from "../../hooks/useCampaigns";
import { formatDistanceToNow } from 'date-fns';

// Demo data for dashboard map
const demoDataByCity: Record<string, any[]> = {
  'New York': [
    { id: "A1", lat: 40.7580, lng: -73.9855, scans: 1247, conv: 18.4, street: "Times Square" },
    { id: "A2", lat: 40.7614, lng: -73.9776, scans: 932, conv: 14.1, street: "W 53rd St" },
    { id: "B3", lat: 40.7590, lng: -73.9845, scans: 1334, conv: 21.0, street: "Broadway" },
  ],
  'London': [
    { id: "L1", lat: 51.5074, lng: -0.1278, scans: 1500, conv: 19.2, street: "Trafalgar Sq" },
    { id: "L2", lat: 51.5113, lng: -0.1160, scans: 1100, conv: 15.5, street: "Strand" },
    { id: "L3", lat: 51.5033, lng: -0.1195, scans: 1800, conv: 22.1, street: "Waterloo Br" },
  ],
  'Tokyo': [
    { id: "T1", lat: 35.6762, lng: 139.6503, scans: 2200, conv: 25.4, street: "Shinjuku" },
    { id: "T2", lat: 35.6895, lng: 139.6917, scans: 1900, conv: 20.1, street: "Shibuya" },
    { id: "T3", lat: 35.6580, lng: 139.7016, scans: 3100, conv: 28.5, street: "Roppongi" },
  ]
};

const cityCenters: Record<string, [number, number]> = {
  'New York': [40.7580, -73.9855],
  'London': [51.5074, -0.1278],
  'Tokyo': [35.6762, 139.6503]
};

const createCustomIcon = (label: string, color: string, glowClass: string = '') => {
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
        <div class="${glowClass}" style="
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

function HeatmapLayer({ data }: { data: any[] }) {
  const map = useMap();

  useEffect(() => {
    const points = data.map(p => [p.lat, p.lng, p.scans / 1000]);
    const heat = (L as any).heatLayer(points, {
      radius: 25,
      blur: 20,
      gradient: {
        0.4: '#00FF00',
        0.6: '#FFFF00',
        0.8: '#FFA500',
        1.0: '#FF0000'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

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

export function DashboardHome() {
  const { campaigns, loading, updateCampaignStatus, deleteCampaign } = useCampaigns();
  const [currentCity, setCurrentCity] = useState('New York');

  useEffect(() => {
    const handleCityChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrentCity(customEvent.detail);
    };
    window.addEventListener('demo-city-change', handleCityChange);
    return () => window.removeEventListener('demo-city-change', handleCityChange);
  }, []);

  const totalScans = campaigns.reduce((acc, c) => acc + c.totalScans, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const avgConv = campaigns.length > 0 ? (campaigns.reduce((acc, c) => acc + c.avgConversion, 0) / campaigns.length).toFixed(1) : '0.0';

  const demoData = demoDataByCity[currentCity] || demoDataByCity['New York'];
  const center = cityCenters[currentCity] || cityCenters['New York'];

  return (
    <div className="flex flex-col h-full bg-bg p-6 space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="secondary">Export Report</Button>
          <Link to="/dashboard/campaigns/new">
            <Button>New Campaign</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col border-border">
          <div className="font-mono text-[11px] text-muted mb-2 uppercase">Total Scans</div>
          <div className="font-mono text-4xl text-accent mb-1">{totalScans.toLocaleString()}</div>
          <div className="text-xs text-muted mb-4">scans</div>
          <div className="mt-auto h-8 flex items-end gap-1">
            {[4,7,5,8,6,9,12,10,15,14,18,16,20,24].map((h, i) => (
              <div key={i} className="w-full bg-accent" style={{ height: `${(h/24)*100}%` }} />
            ))}
          </div>
        </Card>
        
        <Card className="p-4 flex flex-col border-border">
          <div className="font-mono text-[11px] text-muted mb-2 uppercase">Active Campaigns</div>
          <div className="font-mono text-4xl text-accent mb-1">{activeCampaigns}</div>
          <div className="text-xs text-muted mb-4">campaigns</div>
          <div className="mt-auto h-8 flex items-end gap-1">
            {[2,2,4,4,8,12,18,24,28,32,34,36,38,38].map((h, i) => (
              <div key={i} className="w-full bg-accent" style={{ height: `${(h/38)*100}%` }} />
            ))}
          </div>
        </Card>

        <Card className="p-4 flex flex-col border-border">
          <div className="font-mono text-[11px] text-muted mb-2 uppercase">Top Location</div>
          <div className="font-mono text-4xl text-accent mb-1">B3</div>
          <div className="text-xs text-muted mb-4">top location</div>
          <div className="mt-auto h-8 flex items-end">
            <MapIcon className="h-6 w-6 text-accent mb-1" />
          </div>
        </Card>

        <Card className="p-4 flex flex-col border-border">
          <div className="font-mono text-[11px] text-muted mb-2 uppercase">Avg Conversion</div>
          <div className="font-mono text-4xl text-accent mb-1">{avgConv}%</div>
          <div className="text-xs text-muted mb-4">avg conv</div>
          <div className="mt-auto h-8 flex items-end">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full stroke-accent fill-transparent stroke-2">
              <path d="M0,20 L10,18 L20,22 L30,15 L40,19 L50,10 L60,14 L70,5 L80,12 L90,2 L100,8" />
            </svg>
          </div>
        </Card>
      </div>

      <Card className="h-96 overflow-hidden border-border relative">
        <MapContainer 
          center={center} 
          zoom={13} 
          className="h-full w-full bg-bg z-0"
          zoomControl={false}
        >
          <MapUpdater center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <HeatmapLayer data={demoData} />
          {demoData.map(pin => {
            const isRed = pin.conv > 15;
            const isOrange = pin.conv > 10;
            const isYellow = pin.conv > 5;
            
            const color = isRed ? '#FF0000' : isOrange ? '#FFA500' : isYellow ? '#FFFF00' : '#00FF00';
            const glowClass = isRed ? 'pin-glow-red' : isOrange ? 'pin-glow-orange' : isYellow ? 'pin-glow-yellow' : 'pin-glow-green';
            
            return (
              <Marker 
                key={pin.id} 
                position={[pin.lat, pin.lng]} 
                icon={createCustomIcon(pin.id, color, glowClass)}
              >
                <Tooltip direction="top" offset={[0, -40]} opacity={1} className="custom-tooltip">
                  <div className="font-mono text-xs text-text">
                    <div className="font-bold text-accent mb-1">{pin.street || "Unknown Street"}</div>
                    <div className="mb-1">({pin.scans} times scanned)</div>
                    <div>({pin.conv}% conversion)</div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </Card>

      <Card className="border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-surface">
          <h2 className="text-lg font-bold text-text">Recent Campaigns</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-3 font-mono">Name</th>
                <th className="px-6 py-3 font-mono">Pins</th>
                <th className="px-6 py-3 font-mono">Total Scans</th>
                <th className="px-6 py-3 font-mono">Conv%</th>
                <th className="px-6 py-3 font-mono">Status</th>
                <th className="px-6 py-3 font-mono">Last Active</th>
                <th className="px-6 py-3 font-mono text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-muted">Loading campaigns...</td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-muted">No campaigns found. Create one to get started.</td>
                </tr>
              ) : campaigns.map((campaign) => (
                <tr key={campaign.id} className="bg-bg border-b border-border hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text">{campaign.name}</td>
                  <td className="px-6 py-4 font-mono">{campaign.totalPins}</td>
                  <td className="px-6 py-4 font-mono">{campaign.totalScans.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono">{campaign.avgConversion.toFixed(1)}%</td>
                  <td className="px-6 py-4">
                    <Badge variant={campaign.status === 'active' ? 'default' : 'outline'} 
                           className={campaign.status === 'active' ? 'bg-accent/10 text-accent border-accent/20' : 'text-muted border-muted'}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted">{formatDistanceToNow(campaign.lastActive, { addSuffix: true })}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" className="h-8 w-8 p-0" title="View Details">
                      <Eye size={16} />
                    </Button>
                    {campaign.status === 'active' ? (
                      <Button variant="ghost" className="h-8 w-8 p-0" title="Pause" onClick={() => updateCampaignStatus(campaign.id, 'paused')}>
                        <Pause size={16} />
                      </Button>
                    ) : (
                      <Button variant="ghost" className="h-8 w-8 p-0" title="Resume" onClick={() => updateCampaignStatus(campaign.id, 'active')}>
                        <Play size={16} />
                      </Button>
                    )}
                    <Button variant="ghost" className="h-8 w-8 p-0" title="Assign Employee">
                      <Users size={16} />
                    </Button>
                    <Button variant="ghost" className="h-8 w-8 p-0" title="Edit">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10" title="Delete" onClick={() => deleteCampaign(campaign.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
