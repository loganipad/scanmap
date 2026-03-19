import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Input } from "../../components/ui";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Search, Plus, MousePointer2, Trash2, Edit2, Copy, Flame, Download, Map as MapIcon, Layers } from "lucide-react";

type Pin = {
  id: string;
  lat: number;
  lng: number;
  scans: number;
  conv: number;
  street?: string;
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

function HeatmapLayer({ data, active }: { data: Pin[], active: boolean }) {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (active) {
      const points = data.map(p => [p.lat, p.lng, p.scans / 1000 || 0.5]);
      heatLayerRef.current = (L as any).heatLayer(points, {
        radius: 25,
        blur: 20,
        gradient: {
          0.4: '#00FF00',
          0.6: '#FFFF00',
          0.8: '#FFA500',
          1.0: '#FF0000'
        }
      }).addTo(map);
    } else if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, data, active]);

  return null;
}

function MapEvents({ mode, onAddPin }: { mode: 'add' | 'select', onAddPin: (latlng: L.LatLng) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (mode === 'add') {
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.getContainer().style.cursor = '';
    }
  }, [mode, map]);

  useMapEvents({
    click(e) {
      if (mode === 'add') {
        onAddPin(e.latlng);
      }
    },
  });

  return null;
}

const cityCenters: Record<string, [number, number]> = {
  'New York': [40.7580, -73.9855],
  'London': [51.5074, -0.1278],
  'Tokyo': [35.6762, 139.6503]
};

const demoPinsByCity: Record<string, Pin[]> = {
  'New York': [
    { id: "A1", lat: 40.7580, lng: -73.9855, scans: 1247, conv: 18.4, street: "Times Square" },
    { id: "A2", lat: 40.7614, lng: -73.9776, scans: 932, conv: 14.1, street: "W 53rd St" },
  ],
  'London': [
    { id: "L1", lat: 51.5074, lng: -0.1278, scans: 1500, conv: 19.2, street: "Trafalgar Sq" },
    { id: "L2", lat: 51.5113, lng: -0.1160, scans: 1100, conv: 15.5, street: "Strand" },
  ],
  'Tokyo': [
    { id: "T1", lat: 35.6762, lng: 139.6503, scans: 2200, conv: 25.4, street: "Shinjuku" },
    { id: "T2", lat: 35.6895, lng: 139.6917, scans: 1900, conv: 20.1, street: "Shibuya" },
  ]
};

// Component to handle map center changes
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

export function MapPlanner() {
  const [pins, setPins] = useState<Pin[]>(demoPinsByCity['New York']);
  const [mode, setMode] = useState<'add' | 'select'>('select');
  const [heatmapOn, setHeatmapOn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(cityCenters['New York']);
  const [editingPinId, setEditingPinId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  useEffect(() => {
    const handleCityChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const city = customEvent.detail;
      if (cityCenters[city]) {
        setMapCenter(cityCenters[city]);
        setPins(demoPinsByCity[city] || []);
      }
    };
    window.addEventListener('demo-city-change', handleCityChange);
    return () => window.removeEventListener('demo-city-change', handleCityChange);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectResult = (result: any) => {
    setMapCenter([parseFloat(result.lat), parseFloat(result.lon)]);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleAddPin = async (latlng: L.LatLng) => {
    if (pins.length >= 20) {
      alert("You've used all 20 free QR codes. Upgrade to Pro for unlimited campaigns.");
      return;
    }

    let finalLat = latlng.lat;
    let finalLng = latlng.lng;
    let streetName = "Unknown Street";

    try {
      const res = await fetch(`https://router.project-osrm.org/nearest/v1/foot/${latlng.lng},${latlng.lat}?number=1`);
      const data = await res.json();
      if (data.code === 'Ok' && data.waypoints && data.waypoints.length > 0) {
        finalLng = data.waypoints[0].location[0];
        finalLat = data.waypoints[0].location[1];
        if (data.waypoints[0].name) {
          streetName = data.waypoints[0].name;
        }
      }
    } catch (err) {
      console.error("Failed to snap to street", err);
    }

    const nextId = `A${pins.length + 1}`;
    setPins([...pins, { id: nextId, lat: finalLat, lng: finalLng, scans: 0, conv: 0, street: streetName }]);
  };

  const handleDragEnd = async (id: string, e: L.DragEndEvent) => {
    const marker = e.target;
    const position = marker.getLatLng();
    
    let finalLat = position.lat;
    let finalLng = position.lng;
    let streetName = "Unknown Street";

    try {
      const res = await fetch(`https://router.project-osrm.org/nearest/v1/foot/${position.lng},${position.lat}?number=1`);
      const data = await res.json();
      if (data.code === 'Ok' && data.waypoints && data.waypoints.length > 0) {
        finalLng = data.waypoints[0].location[0];
        finalLat = data.waypoints[0].location[1];
        if (data.waypoints[0].name) {
          streetName = data.waypoints[0].name;
        }
      }
    } catch (err) {
      console.error("Failed to snap to street", err);
    }

    setPins(prevPins => prevPins.map(p => 
      p.id === id ? { ...p, lat: finalLat, lng: finalLng, street: streetName } : p
    ));
  };

  const handleDeletePin = (id: string) => {
    if (window.confirm(`Delete pin ${id}? This cannot be undone.`)) {
      setPins(pins.filter(p => p.id !== id));
    }
  };

  const startRename = (pin: Pin) => {
    setEditingPinId(pin.id);
    setEditLabel(pin.id);
  };

  const finishRename = (id: string) => {
    if (editLabel.trim()) {
      setPins(pins.map(p => p.id === id ? { ...p, id: editLabel.trim() } : p));
    }
    setEditingPinId(null);
  };

  return (
    <div className="flex h-full bg-bg overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-[300px] flex flex-col border-r border-border bg-surface shrink-0 z-10">
        {/* TOP: LOCATION SEARCH */}
        <div className="p-4 border-b border-border">
          <div className="font-mono text-[11px] text-muted mb-2 uppercase">Search Location</div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search address..." 
              className="pl-9 bg-bg"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-sm shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <div 
                    key={i} 
                    className="p-2 text-sm text-text hover:bg-accent/10 cursor-pointer border-b border-border last:border-0"
                    onClick={() => handleSelectResult(res)}
                  >
                    {res.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button 
            variant="secondary" 
            className="w-full mt-3 h-8 text-xs"
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
                (err) => console.error(err)
              );
            }}
          >
            ◎ Use My Location
          </Button>
        </div>

        {/* MIDDLE: MODE TOGGLE */}
        <div className="p-4 border-b border-border">
          <div className="font-mono text-[11px] text-muted mb-2 uppercase">Campaign Pins</div>
          <div className="flex gap-2">
            <Button 
              variant={mode === 'add' ? 'primary' : 'secondary'} 
              className="flex-1 h-8 text-xs gap-1"
              onClick={() => setMode('add')}
            >
              <Plus className="h-3 w-3" /> Add Pin
            </Button>
            <Button 
              variant={mode === 'select' ? 'primary' : 'secondary'} 
              className="flex-1 h-8 text-xs gap-1"
              onClick={() => setMode('select')}
            >
              <MousePointer2 className="h-3 w-3" /> Select
            </Button>
          </div>
        </div>

        {/* BOTTOM: PIN LIST */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-border flex gap-2">
            <Link to="/dashboard/route" className="flex-1">
              <Button variant="secondary" className="w-full h-7 text-[10px] px-2">Generate Route</Button>
            </Link>
            <Button variant="secondary" className="h-7 text-[10px] px-2" onClick={() => setPins([])}>Clear All</Button>
            <Button variant="secondary" className="h-7 w-7 p-0 flex items-center justify-center"><Download className="h-3 w-3" /></Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {pins.map(pin => (
              <div key={pin.id} className="flex items-center justify-between p-2 bg-bg border border-border rounded-sm hover:border-accent/50 group">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <div className="flex flex-col">
                    {editingPinId === pin.id ? (
                      <input 
                        autoFocus
                        value={editLabel}
                        onChange={e => setEditLabel(e.target.value)}
                        onBlur={() => finishRename(pin.id)}
                        onKeyDown={e => e.key === 'Enter' && finishRename(pin.id)}
                        className="font-mono text-sm text-accent bg-transparent border-b border-accent outline-none w-16"
                      />
                    ) : (
                      <span className="font-mono text-sm text-accent cursor-pointer" onClick={() => startRename(pin)}>{pin.id}</span>
                    )}
                    <span className="font-mono text-[10px] text-muted">{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-muted hover:text-accent" onClick={() => startRename(pin)}><Edit2 className="h-3 w-3" /></button>
                  <button className="p-1 text-muted hover:text-red-500" onClick={() => handleDeletePin(pin.id)}><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border bg-surface">
            <div className="text-xs font-mono text-muted mb-2">{pins.length} / 20 QR codes used</div>
            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all" style={{ width: `${(pins.length/20)*100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: MAP */}
      <div className="flex-1 relative z-0">
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          <Card className="p-1 flex flex-col gap-1 bg-surface/90 backdrop-blur">
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setHeatmapOn(!heatmapOn)}>
              <Flame className={heatmapOn ? "text-accent" : "text-muted"} size={16} />
            </Button>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Layers className="text-muted" size={16} />
            </Button>
          </Card>
        </div>

        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          className="h-full w-full bg-bg"
          zoomControl={true}
        >
          <MapUpdater center={mapCenter} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapEvents mode={mode} onAddPin={handleAddPin} />
          <HeatmapLayer data={pins} active={heatmapOn} />
          
          {pins.map(pin => {
            let color = '#444444';
            let glowClass = '';
            
            if (pin.scans > 0) {
              const isRed = pin.conv > 15;
              const isOrange = pin.conv > 10;
              const isYellow = pin.conv > 5;
              
              color = isRed ? '#FF0000' : isOrange ? '#FFA500' : isYellow ? '#FFFF00' : '#00FF00';
              glowClass = isRed ? 'pin-glow-red' : isOrange ? 'pin-glow-orange' : isYellow ? 'pin-glow-yellow' : 'pin-glow-green';
            }
            
            return (
              <Marker 
                key={pin.id} 
                position={[pin.lat, pin.lng]} 
                icon={createCustomIcon(pin.id, color, glowClass)}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => handleDragEnd(pin.id, e),
                }}
              >
                <Tooltip direction="top" offset={[0, -40]} opacity={1} className="custom-tooltip">
                  <div className="font-mono text-xs text-text">
                    <div className="font-bold text-accent mb-1">{pin.street || "Unknown Street"}</div>
                    <div className="mb-1">({pin.scans} times scanned)</div>
                    <div>({pin.conv}% conversion)</div>
                  </div>
                </Tooltip>
                <Popup className="custom-popup" closeButton={false}>
                  <div className="bg-surface border border-accent rounded-sm p-3 w-48 text-left">
                    <div className="font-mono text-[10px] text-muted mb-1">AD_ZONE_TRACK</div>
                    <div className="font-mono text-base text-accent mb-1">LOC. {pin.id}</div>
                    <div className="font-mono text-[11px] text-muted mb-1">{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</div>
                    <div className="font-mono text-[11px] text-muted mb-2">QR: scanmap.io/c/{pin.id}</div>
                    <div className="font-mono text-[13px] text-text mb-2">({pin.scans} times scanned)</div>
                    <div className="font-mono text-[13px] text-text mb-2">({pin.conv}% conversion)</div>
                    <div className="flex items-center text-xs text-text mb-3">
                      <span className="h-2 w-2 rounded-full bg-accent mr-2" /> ACTIVE
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="h-6 px-2 text-[10px] flex-1" onClick={() => startRename(pin)}>Rename</Button>
                      <Button variant="secondary" className="h-6 px-2 text-[10px] flex-1">Copy QR</Button>
                      <Button variant="destructive" className="h-6 px-2 text-[10px] flex-1" onClick={() => handleDeletePin(pin.id)}>Delete</Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
