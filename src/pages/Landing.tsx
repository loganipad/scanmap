import { Link, useLocation } from "react-router-dom";
import { Navbar, Footer } from "../components/Layout";
import { Button, Card } from "../components/ui";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import "leaflet.heat";

// Demo data
const demoData = [
  { id: "A1", lat: 40.7580, lng: -73.9855, scans: 1247, conv: 18.4, crossStreet: "Broadway & W 45th St" },
  { id: "A2", lat: 40.7614, lng: -73.9776, scans: 932, conv: 14.1, crossStreet: "5th Ave & W 53rd St" },
  { id: "A3", lat: 40.7527, lng: -73.9772, scans: 847, conv: 12.3, crossStreet: "Park Ave & E 42nd St" },
  { id: "B1", lat: 40.7488, lng: -73.9856, scans: 203, conv: 4.2, crossStreet: "5th Ave & W 34th St" },
  { id: "B2", lat: 40.7549, lng: -73.9840, scans: 1089, conv: 16.7, crossStreet: "6th Ave & W 40th St" },
  { id: "B3", lat: 40.7590, lng: -73.9845, scans: 1334, conv: 21.0, crossStreet: "7th Ave & W 46th St" },
  { id: "C1", lat: 40.7643, lng: -73.9730, scans: 88, conv: 1.1, crossStreet: "5th Ave & E 59th St" },
  { id: "C2", lat: 40.7520, lng: -73.9900, scans: 441, conv: 7.8, crossStreet: "8th Ave & W 34th St" },
  { id: "C3", lat: 40.7671, lng: -73.9822, scans: 567, conv: 9.4, crossStreet: "Broadway & W 57th St" },
  { id: "C4", lat: 40.7505, lng: -73.9934, scans: 312, conv: 5.5, crossStreet: "7th Ave & W 31st St" },
  { id: "D1", lat: 40.7694, lng: -73.9813, scans: 29, conv: 0.4, crossStreet: "Broadway & W 60th St" },
  { id: "D2", lat: 40.7565, lng: -73.9920, scans: 119, conv: 2.2, crossStreet: "8th Ave & W 40th St" },
  { id: "D3", lat: 40.7530, lng: -73.9970, scans: 78, conv: 1.0, crossStreet: "9th Ave & W 34th St" },
  { id: "D4", lat: 40.7474, lng: -73.9971, scans: 44, conv: 0.6, crossStreet: "10th Ave & W 20th St" },
];

const createCustomIcon = (label: string, color: string, delay: number, glowClass: string) => {
  return L.divIcon({
    className: `custom-pin`,
    html: `
      <div class="pin-fall" style="position: relative; display: flex; flex-direction: column; align-items: center; animation-delay: ${delay}s;">
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
    const points = data.map(p => [p.lat, p.lng, p.scans / 1000]); // Normalize intensity
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

    // Add fade-in animation to the heatmap canvas
    if (heat._canvas) {
      heat._canvas.style.animation = 'fadeIn 2s ease-in-out forwards';
      heat._canvas.style.opacity = '0';
    }

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
}

export function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar />
      
      <main className="flex-1">
        {/* Live Chat Widget */}
        <div className="fixed bottom-6 right-6 z-[500]">
          <Button className="h-14 w-14 rounded-full shadow-xl flex items-center justify-center bg-accent text-bg hover:bg-accent/90 transition-transform hover:scale-105">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </Button>
        </div>

        {/* HERO SECTION */}
        <section className="relative flex min-h-[calc(100vh-3.5rem)] w-full items-center overflow-hidden border-b border-border">
          <div className="grid-3d opacity-30"></div>
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 px-4 py-12 lg:py-0">
            <div className="flex flex-col justify-center space-y-8 z-10">
              <div className="font-mono text-[11px] font-bold tracking-[0.15em] text-accent">
                OFFLINE AD INTELLIGENCE
              </div>
              <h1 className="text-5xl font-[800] leading-[1.0] text-text lg:text-[72px] tracking-tight">
                Stop advertising<br />blindly.
              </h1>
              <p className="max-w-[460px] text-lg text-muted">
                Every flyer you place is a data point you're ignoring.
                ScanMap gives each physical ad a unique QR code, maps
                every placement, and shows you exactly which locations
                are making you money.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/pricing">
                  <Button className="w-full sm:w-auto h-12 px-8 text-base">Start Free →</Button>
                </Link>
                <Link to="/demo">
                  <Button variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base">Try Live Demo</Button>
                </Link>
              </div>
              <div className="flex flex-col space-y-2 font-mono text-xs text-muted pt-4">
                <div>↳ 20 free QR codes — no card required</div>
                <div>↳ Works for flyers · posters · stickers · signage</div>
                <div>↳ Real-time tracking · Heatmap analytics · Route optimizer</div>
              </div>
            </div>
            
            <div className="relative hidden lg:block h-[calc(100vh-3.5rem)] -mr-4 border-l border-border">
              <div className="absolute top-4 left-4 z-[400] bg-surface/80 backdrop-blur border border-border rounded-sm px-3 py-1.5 font-mono text-[11px] text-accent flex items-center shadow-sm">
                <span className="h-2 w-2 rounded-full bg-accent mr-2 animate-pulse" />
                LIVE Demo Campaign · Midtown
              </div>
              <MapContainer 
                center={[40.7580, -73.9855]} 
                zoom={13} 
                scrollWheelZoom={false}
                className="h-full w-full bg-bg z-0"
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <HeatmapLayer data={demoData} />
                {demoData.map((pin, index) => {
                  const isRed = pin.conv > 15;
                  const isOrange = pin.conv > 10;
                  const isYellow = pin.conv > 5;
                  
                  const color = isRed ? '#FF0000' : isOrange ? '#FFA500' : isYellow ? '#FFFF00' : '#00FF00';
                  const glowClass = isRed ? 'pin-glow-red' : isOrange ? 'pin-glow-orange' : isYellow ? 'pin-glow-yellow' : 'pin-glow-green';
                  const delay = index * 0.1;
                  
                  return (
                    <Marker 
                      key={pin.id} 
                      position={[pin.lat, pin.lng]} 
                      icon={createCustomIcon(pin.id, color, delay, glowClass)}
                    >
                      <Tooltip direction="top" offset={[0, -40]} opacity={1} className="custom-tooltip">
                        <div className="bg-surface border border-accent rounded-sm p-2 w-48 text-left shadow-lg">
                          <div className="font-mono text-[10px] text-muted mb-1">LOC. {pin.id}</div>
                          <div className="font-bold text-accent mb-1 text-xs">{pin.crossStreet}</div>
                          <div className="font-mono text-xs text-text mb-1">({pin.scans} times scanned)</div>
                          <div className="font-mono text-xs text-text">({pin.conv}% conversion)</div>
                        </div>
                      </Tooltip>
                    </Marker>
                  );
                })}
              </MapContainer>
              {/* Fade overlay for left edge of map */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-[400] pointer-events-none" />
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="py-24 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="font-mono text-[11px] text-accent mb-4">THE PROBLEM</div>
            <h2 className="text-4xl font-bold text-text mb-16 max-w-2xl">
              You're spending real money. You have no data.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <div className="font-mono text-5xl text-accent mb-4">01</div>
                <h3 className="text-xl font-bold mb-4">Zero Attribution</h3>
                <p className="text-muted leading-relaxed">
                  You placed 200 flyers across 6 neighborhoods.
                  Not one data point came back.
                </p>
              </div>
              <div>
                <div className="font-mono text-5xl text-accent mb-4">02</div>
                <h3 className="text-xl font-bold mb-4">No Optimization</h3>
                <p className="text-muted leading-relaxed">
                  Without location data, every new campaign repeats
                  the same expensive mistakes.
                </p>
              </div>
              <div>
                <div className="font-mono text-5xl text-accent mb-4">03</div>
                <h3 className="text-xl font-bold mb-4">Falls Apart at Scale</h3>
                <p className="text-muted leading-relaxed">
                  Managing 500 flyers across 15 blocks with a
                  spreadsheet is exactly how campaigns fail.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LIFESTYLE SECTION */}
        <section className="relative py-32 border-b border-border bg-bg overflow-hidden">
          <div className="absolute inset-0 opacity-4" style={{ backgroundImage: 'radial-gradient(#AAFF00 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="container relative mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold text-text mb-6">Physical ads. Real data.</h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              ScanMap bridges the gap between the street
              and your analytics dashboard.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 border-b border-border overflow-x-auto">
          <div className="container mx-auto px-4 min-w-[800px]">
            <div className="flex items-start justify-between relative">
              <div className="absolute top-6 left-0 right-0 h-px border-t border-dashed border-accent/30 -z-10" />
              {[
                "Upload your flyer",
                "Generate QR batch",
                "Drop pins on the map",
                "Print in route order",
                "Place via optimized route",
                "Track scans and read heatmap"
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center w-32 text-center bg-bg">
                  <div className="w-12 h-12 rounded-full bg-surface border border-accent flex items-center justify-center font-mono text-accent mb-4">
                    {i + 1}
                  </div>
                  <div className="font-bold text-sm">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 border-b border-border bg-surface/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 flex flex-col">
                <div className="w-8 h-8 border border-accent rounded-sm flex items-center justify-center mb-6">
                  <div className="w-2 h-2 bg-accent rounded-sm" />
                </div>
                <h3 className="text-xl font-bold mb-4">Unique QR Per Location</h3>
                <p className="text-muted">
                  One flyer = one QR = one tracked data point.
                  Zero location confusion.
                </p>
              </Card>
              <Card className="p-8 flex flex-col">
                <div className="w-8 h-8 border border-accent rounded-sm flex flex-col items-center justify-center mb-6 gap-1">
                  <div className="w-4 h-1 bg-accent" />
                  <div className="w-4 h-1 bg-accent" />
                  <div className="w-4 h-1 bg-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4">Bulk Flyer Generator</h3>
                <p className="text-muted mb-6">
                  Upload one design. Get 100 unique QR-coded print-ready
                  PNGs with location labels. ZIP download.
                </p>
                <div className="mt-auto bg-bg border border-border p-4 rounded-sm">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="aspect-[3/4] bg-white rounded-sm relative">
                        <div className="absolute bottom-1 right-1 w-3 h-3 bg-black" />
                      </div>
                    ))}
                  </div>
                  <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[88%]" />
                  </div>
                  <div className="text-[10px] font-mono text-accent mt-2 text-right">88% COMPLETE</div>
                </div>
              </Card>
              <Card className="p-8 flex flex-col">
                <div className="w-8 h-8 border border-accent rounded-sm flex items-center justify-center mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Map Planner</h3>
                <p className="text-muted">
                  Drop pins on a real street map. QR auto-assigned.
                  Plan before you print a single page.
                </p>
              </Card>
              <Card className="p-8 flex flex-col">
                <div className="w-8 h-8 border border-accent rounded-sm flex items-center justify-center mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M15 6l6 6-6 6"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Route Optimizer</h3>
                <p className="text-muted">
                  Generates the most efficient walking or driving order
                  for all your pins. Step-by-step. Mobile-ready.
                </p>
              </Card>
              <Card className="p-8 flex flex-col">
                <div className="w-8 h-8 border border-accent rounded-sm flex items-center justify-center mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Real-Time Analytics</h3>
                <p className="text-muted">
                  Every scan tracked live by location and time.
                  Export full reports anytime.
                </p>
              </Card>
              <Card className="p-8 flex flex-col">
                <div className="w-8 h-8 border border-accent rounded-sm flex items-center justify-center mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Team Deployment Mode</h3>
                <p className="text-muted">
                  Send your team a link. They confirm each placement.
                  You track progress in real time.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 border-b border-border bg-bg">
          <div className="container mx-auto px-4">
            <div className="font-mono text-[11px] text-accent mb-4 text-center">TRUSTED BY TEAMS</div>
            <h2 className="text-4xl font-bold text-text mb-16 text-center">
              Don't just take our word for it.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "We used to guess which neighborhoods worked. Now we know exactly where our conversions come from. ScanMap paid for itself in week one.",
                  author: "Sarah J.",
                  role: "Marketing Director, LocalEats"
                },
                {
                  quote: "The route optimizer alone saves our street team hours every day. The fact that we get real-time scan data is just incredible.",
                  author: "Marcus T.",
                  role: "Operations Manager, EventPromo"
                },
                {
                  quote: "Finally, a tool that brings digital analytics to physical marketing. The heatmap feature completely changed our distribution strategy.",
                  author: "Elena R.",
                  role: "Founder, UrbanReach"
                }
              ].map((t, i) => (
                <Card key={i} className="p-8 flex flex-col bg-surface/50">
                  <div className="text-accent mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                  </div>
                  <p className="text-muted mb-8 flex-1 italic">"{t.quote}"</p>
                  <div>
                    <div className="font-bold text-text">{t.author}</div>
                    <div className="text-xs text-muted font-mono">{t.role}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 border-b border-border bg-surface/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="font-mono text-[11px] text-accent mb-4 text-center">FAQ</div>
            <h2 className="text-4xl font-bold text-text mb-16 text-center">
              Common Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How does the unique QR code generation work?",
                  a: "When you upload a flyer design, ScanMap generates a batch of unique QR codes and overlays them onto your design. Each QR code is tied to a specific location pin you drop on the map."
                },
                {
                  q: "Do I need special printers?",
                  a: "No. We provide a ZIP file with high-resolution PNGs or a combined PDF that you can send to any standard print shop."
                },
                {
                  q: "How do employees verify placement?",
                  a: "Using the Deploy Mode link on their phone, employees scan the QR code on the flyer they just placed. This logs the exact GPS coordinates and time, verifying the placement."
                },
                {
                  q: "Can I track conversions, not just scans?",
                  a: "Yes. You can append UTM parameters to your destination URLs, or use our API to send conversion events back to ScanMap when a user completes an action on your site."
                }
              ].map((faq, i) => (
                <Card key={i} className="p-6">
                  <h3 className="text-lg font-bold text-text mb-2">{faq.q}</h3>
                  <p className="text-muted">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 text-center bg-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-text mb-4">Your next campaign should have data.</h2>
            <p className="text-xl text-muted mb-8">20 free QR codes. No card. No catch.</p>
            <Link to="/pricing">
              <Button className="h-12 px-8 text-base">Start Free →</Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
