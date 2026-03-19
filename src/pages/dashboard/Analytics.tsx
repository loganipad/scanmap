import { useState } from "react";
import { Card, Badge, Button } from "../../components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, Calendar, Filter, TrendingUp, Users, MapPin, QrCode } from "lucide-react";

const scanData = [
  { date: "Mon", scans: 120 },
  { date: "Tue", scans: 150 },
  { date: "Wed", scans: 180 },
  { date: "Thu", scans: 220 },
  { date: "Fri", scans: 310 },
  { date: "Sat", scans: 450 },
  { date: "Sun", scans: 380 },
];

const locationData = [
  { name: "Downtown", value: 400 },
  { name: "Uptown", value: 300 },
  { name: "Midtown", value: 300 },
  { name: "Suburbs", value: 200 },
];

const COLORS = ["#AAFF00", "#558800", "#335500", "#112200"];

export function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Analytics Overview</h1>
          <p className="text-muted">Track campaign performance and scan metrics.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-surface border border-border rounded-md overflow-hidden">
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
            <button 
              className={`px-4 py-2 text-sm font-medium ${timeRange === 'all' ? 'bg-accent text-bg' : 'text-muted hover:bg-surface-hover'}`}
              onClick={() => setTimeRange('all')}
            >
              All Time
            </button>
          </div>
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-sm font-medium">Total Scans</span>
            <QrCode className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-text">12,450</div>
          <div className="flex items-center gap-1 text-accent text-sm font-medium mt-2">
            <TrendingUp className="h-3 w-3" /> +15% from last period
          </div>
        </Card>
        
        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-sm font-medium">Unique Visitors</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-text">8,230</div>
          <div className="flex items-center gap-1 text-accent text-sm font-medium mt-2">
            <TrendingUp className="h-3 w-3" /> +8% from last period
          </div>
        </Card>

        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-sm font-medium">Top Location</span>
            <MapPin className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-text">Downtown</div>
          <div className="text-sm text-muted mt-2">
            45% of total scans
          </div>
        </Card>

        <Card className="p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-sm font-medium">Avg. Conversion</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-text">4.2%</div>
          <div className="flex items-center gap-1 text-red-500 text-sm font-medium mt-2">
            <TrendingUp className="h-3 w-3 rotate-180" /> -1.2% from last period
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-text mb-6">Scans Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scanData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#AAFF00' }}
                />
                <Line type="monotone" dataKey="scans" stroke="#AAFF00" strokeWidth={3} dot={{r: 4, fill: '#AAFF00', strokeWidth: 0}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-text mb-6">Scans by Location</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {locationData.map((loc, i) => (
              <div key={loc.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-muted">{loc.name}</span>
                </div>
                <span className="font-medium text-text">{loc.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
