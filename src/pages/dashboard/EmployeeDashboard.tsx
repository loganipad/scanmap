import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { MapPin, Camera, CheckCircle, Navigation, QrCode } from 'lucide-react';

// Demo jobs
const jobs = [
  { id: '1', location: '123 Main St', status: 'pending', instructions: 'Place on community board inside coffee shop.' },
  { id: '2', location: '456 Market St', status: 'completed', instructions: 'Hand to store manager.' },
  { id: '3', location: '789 Broadway', status: 'pending', instructions: 'Tape to light pole facing north.' },
];

export function EmployeeDashboard() {
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleScan = () => {
    // Simulate scanning
    setTimeout(() => {
      setShowScanner(false);
      setPhotoUploaded(true);
    }, 1500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      // Simulate upload delay
      setTimeout(() => {
        setPhotoUrl(url);
        setPhotoUploaded(true);
      }, 1000);
    }
  };

  const completeJob = () => {
    setActiveJob(null);
    setPhotoUploaded(false);
    setPhotoUrl(null);
    alert('Job marked as completed and verified!');
  };

  return (
    <div className="flex flex-col h-full bg-bg p-4 md:p-6 space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">My Route</h1>
        <Badge variant="default" className="bg-accent/10 text-accent border-accent/20">3 Jobs Today</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-text">Job List</h2>
          {jobs.map(job => (
            <Card 
              key={job.id} 
              className={`p-4 cursor-pointer transition-colors ${activeJob === job.id ? 'border-accent bg-surface/80' : 'border-border bg-surface hover:bg-surface/50'}`}
              onClick={() => setActiveJob(job.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="font-medium text-text">{job.location}</span>
                </div>
                {job.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                )}
              </div>
              <p className="text-sm text-muted line-clamp-2">{job.instructions}</p>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          {activeJob ? (
            <Card className="p-6 border-border h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text mb-1">{jobs.find(j => j.id === activeJob)?.location}</h2>
                  <Badge variant="outline" className="text-muted border-muted">Job #{activeJob}</Badge>
                </div>
                <Button variant="secondary" className="gap-2">
                  <Navigation className="h-4 w-4" /> Navigate
                </Button>
              </div>

              <div className="bg-bg p-4 rounded-sm border border-border mb-6">
                <h3 className="text-sm font-bold text-text mb-2 uppercase font-mono">Instructions</h3>
                <p className="text-muted">{jobs.find(j => j.id === activeJob)?.instructions}</p>
              </div>

              <div className="mt-auto space-y-4">
                <h3 className="text-sm font-bold text-text uppercase font-mono">Verification Required</h3>
                
                {!photoUploaded ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      className="h-24 flex flex-col items-center justify-center gap-2 bg-surface hover:bg-surface/80 border border-border text-text"
                      onClick={() => setShowScanner(true)}
                    >
                      <QrCode className="h-6 w-6 text-accent" />
                      <span>Scan QR Code</span>
                    </Button>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handlePhotoUpload}
                      />
                      <Button 
                        className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-surface hover:bg-surface/80 border border-border text-text relative z-0"
                      >
                        <Camera className="h-6 w-6 text-accent" />
                        <span>Take Photo</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-accent/10 border border-accent/20 rounded-sm p-4 flex items-center gap-4">
                    {photoUrl ? (
                      <div className="h-12 w-12 rounded-sm overflow-hidden border border-accent/20">
                        <img src={photoUrl} alt="Verification" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-accent" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-accent">Verification Successful</div>
                      <div className="text-sm text-muted">{photoUrl ? 'Photo uploaded and location verified.' : 'QR code scanned and location verified.'}</div>
                    </div>
                  </div>
                )}

                {showScanner && (
                  <div className="fixed inset-0 z-50 bg-bg/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-sm aspect-square border-2 border-accent border-dashed rounded-lg relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-accent/5 animate-pulse" />
                      <p className="text-accent font-mono text-sm text-center">Scanning...<br/>Align QR code within frame</p>
                    </div>
                    <Button className="mt-8" variant="secondary" onClick={handleScan}>Simulate Successful Scan</Button>
                    <Button className="mt-4" variant="ghost" onClick={() => setShowScanner(false)}>Cancel</Button>
                  </div>
                )}

                <Button 
                  className="w-full mt-6" 
                  disabled={!photoUploaded}
                  onClick={completeJob}
                >
                  Complete Job
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-border h-full flex flex-col items-center justify-center text-center text-muted">
              <MapPin className="h-12 w-12 mb-4 opacity-50" />
              <h2 className="text-xl font-bold text-text mb-2">Select a Job</h2>
              <p>Choose a job from the list to view details and verify placement.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
