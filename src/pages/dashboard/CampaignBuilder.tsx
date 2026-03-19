import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input, Badge } from "../../components/ui";
import QRCode from "qrcode";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import { Upload, FileImage, LayoutTemplate, CheckCircle2, Download, FileText, ArrowRight } from "lucide-react";
import { useCampaigns } from "../../hooks/useCampaigns";

export function CampaignBuilder() {
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState("");
  const [targetCity, setTargetCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  
  const [qrQuantity, setQrQuantity] = useState(20);
  const [qrPosition, setQrPosition] = useState<'br' | 'bl' | 'tr' | 'tl'>('br');
  const [labelFormat, setLabelFormat] = useState<'A1' | '001' | 'custom'>('A1');
  const [customPrefix, setCustomPrefix] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const navigate = useNavigate();
  const { addCampaign } = useCampaigns();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFlyerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFlyerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBatch = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate generation process for UX
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 50));
      setProgress(i);
    }
    
    setStep(4);
    setIsGenerating(false);
  };

  const handleSaveCampaign = async () => {
    try {
      await addCampaign({
        name: campaignName || 'Untitled Campaign',
        status: 'draft',
        totalPins: qrQuantity,
        totalScans: 0,
        avgConversion: 0,
        pins: [] // We would generate initial pins here
      });
      navigate('/dashboard/campaigns');
    } catch (error) {
      console.error("Error saving campaign:", error);
      alert("Failed to save campaign. Please try again.");
    }
  };

  const downloadZip = async () => {
    try {
      const zip = new JSZip();
      const folder = zip.folder("campaign_flyers");
      
      if (!folder) throw new Error("Could not create zip folder");

      // Generate QR codes
      for (let i = 1; i <= qrQuantity; i++) {
        const label = labelFormat === 'A1' ? `A${i}` : labelFormat === '001' ? i.toString().padStart(3, '0') : `${customPrefix}${i}`;
        const url = `https://scanmap.io/c/cmp_123_${label}`;
        
        // Generate QR code data URL
        const qrDataUrl = await QRCode.toDataURL(url, {
          color: {
            dark: qrColor,
            light: '#FFFFFF'
          },
          margin: 1,
          width: 300
        });

        if (flyerPreview) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const flyerImg = new Image();
          flyerImg.crossOrigin = "Anonymous";
          flyerImg.src = flyerPreview;
          await new Promise(resolve => { flyerImg.onload = resolve; flyerImg.onerror = resolve; });
          
          canvas.width = flyerImg.width;
          canvas.height = flyerImg.height;
          
          if (ctx) {
            ctx.drawImage(flyerImg, 0, 0);
            
            const qrImg = new Image();
            qrImg.src = qrDataUrl;
            await new Promise(resolve => { qrImg.onload = resolve; });
            
            // Calculate position
            const qrSize = Math.min(canvas.width, canvas.height) * 0.15; // 15% of smallest dimension
            const padding = qrSize * 0.2;
            
            let x = 0;
            let y = 0;
            
            if (qrPosition === 'tl') { x = padding; y = padding; }
            else if (qrPosition === 'tr') { x = canvas.width - qrSize - padding; y = padding; }
            else if (qrPosition === 'bl') { x = padding; y = canvas.height - qrSize - padding; }
            else if (qrPosition === 'br') { x = canvas.width - qrSize - padding; y = canvas.height - qrSize - padding; }
            
            // Draw white background for QR
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x - padding/2, y - padding/2, qrSize + padding, qrSize + padding);
            
            // Draw QR
            ctx.drawImage(qrImg, x, y, qrSize, qrSize);
            
            // Draw Label
            ctx.fillStyle = '#000000';
            ctx.font = `bold ${qrSize * 0.15}px monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(label, x + qrSize/2, y + qrSize + padding/2.5);
            
            const finalDataUrl = canvas.toDataURL('image/png');
            const base64Data = finalDataUrl.replace(/^data:image\/png;base64,/, "");
            folder.file(`flyer_${label}.png`, base64Data, { base64: true });
          }
        } else {
          // Strip the data:image/png;base64, part
          const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
          folder.file(`flyer_${label}_qr.png`, base64Data, { base64: true });
        }
      }

      // Generate CSV
      let csvContent = "Label,URL,Status\n";
      for (let i = 1; i <= qrQuantity; i++) {
        const label = labelFormat === 'A1' ? `A${i}` : labelFormat === '001' ? i.toString().padStart(3, '0') : `${customPrefix}${i}`;
        const url = `https://scanmap.io/c/cmp_123_${label}`;
        csvContent += `${label},${url},Pending\n`;
      }
      zip.file("location_data.csv", csvContent);

      // Generate zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${campaignName || 'campaign'}_assets.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error generating zip:", error);
      alert("Failed to generate files. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg overflow-hidden">
      <div className="p-6 border-b border-border bg-surface shrink-0">
        <h1 className="text-2xl font-bold text-text mb-4">New Campaign</h1>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs ${step >= s ? 'bg-accent text-bg' : 'bg-bg border border-border text-muted'}`}>
                {s}
              </div>
              {s < 4 && <div className={`w-12 h-px mx-2 ${step > s ? 'bg-accent' : 'bg-border'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {step === 1 && (
            <Card className="p-8 space-y-6">
              <h2 className="text-xl font-bold mb-6">Campaign Setup</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Campaign Name</label>
                  <Input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="Downtown Metro Test" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Target City or Area</label>
                  <Input value={targetCity} onChange={e => setTargetCity(e.target.value)} placeholder="New York, NY" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Start Date</label>
                    <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">End Date</label>
                    <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!campaignName}>Next Step <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-8 space-y-6">
              <h2 className="text-xl font-bold mb-6">Upload Flyer</h2>
              
              {!flyerPreview ? (
                <div className="border-2 border-dashed border-border rounded-sm p-12 flex flex-col items-center justify-center text-center hover:border-accent/50 transition-colors cursor-pointer relative">
                  <input type="file" accept="image/png, image/jpeg" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                  <Upload className="h-12 w-12 text-muted mb-4" />
                  <h3 className="text-lg font-medium text-text mb-2">Drag & drop your flyer</h3>
                  <p className="text-sm text-muted mb-4">PNG or JPG, max 20MB</p>
                  <Button variant="secondary">Browse Files</Button>
                </div>
              ) : (
                <div className="flex gap-6">
                  <div className="w-1/3 aspect-[3/4] rounded-sm overflow-hidden border border-border relative">
                    <img src={flyerPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => setFlyerPreview(null)} className="absolute top-2 right-2 bg-bg/80 p-1 rounded-sm text-xs border border-border">Change</button>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <FileImage className="h-6 w-6 text-accent" />
                      <span className="font-medium">{flyerFile?.name}</span>
                    </div>
                    <div className="text-sm text-muted mb-6">{(flyerFile?.size || 0) / 1024 / 1024 > 1 ? `${((flyerFile?.size || 0) / 1024 / 1024).toFixed(2)} MB` : `${Math.round((flyerFile?.size || 0) / 1024)} KB`}</div>
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <CheckCircle2 className="h-4 w-4" /> Ready for QR overlay
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-border">
                <h3 className="text-sm font-medium text-muted mb-4">Or use a blank template</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-[3/4] border border-border rounded-sm bg-surface flex items-center justify-center hover:border-accent cursor-pointer transition-colors" onClick={() => setFlyerPreview("https://picsum.photos/seed/poster/400/600")}>
                      <LayoutTemplate className="h-8 w-8 text-muted" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!flyerPreview}>Next Step <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="p-8 space-y-6">
              <h2 className="text-xl font-bold mb-6">QR Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="1" max="20" value={qrQuantity} onChange={e => setQrQuantity(parseInt(e.target.value))} className="flex-1 accent-accent" />
                      <span className="font-mono text-xl text-accent w-12 text-right">{qrQuantity}</span>
                    </div>
                    <div className="text-xs text-accent mt-1 font-mono">{qrQuantity} of 20 remaining (Free Tier)</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">QR Position</label>
                    <div className="grid grid-cols-2 gap-2 w-32">
                      <button onClick={() => setQrPosition('tl')} className={`aspect-square border rounded-sm flex items-start justify-start p-1 ${qrPosition === 'tl' ? 'border-accent bg-accent/10' : 'border-border bg-bg'}`}><div className="w-3 h-3 bg-text" /></button>
                      <button onClick={() => setQrPosition('tr')} className={`aspect-square border rounded-sm flex items-start justify-end p-1 ${qrPosition === 'tr' ? 'border-accent bg-accent/10' : 'border-border bg-bg'}`}><div className="w-3 h-3 bg-text" /></button>
                      <button onClick={() => setQrPosition('bl')} className={`aspect-square border rounded-sm flex items-end justify-start p-1 ${qrPosition === 'bl' ? 'border-accent bg-accent/10' : 'border-border bg-bg'}`}><div className="w-3 h-3 bg-text" /></button>
                      <button onClick={() => setQrPosition('br')} className={`aspect-square border rounded-sm flex items-end justify-end p-1 ${qrPosition === 'br' ? 'border-accent bg-accent/10' : 'border-border bg-bg'}`}><div className="w-3 h-3 bg-text" /></button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">Label Format</label>
                    <div className="flex gap-2">
                      <Button variant={labelFormat === 'A1' ? 'primary' : 'secondary'} className="h-8 text-xs" onClick={() => setLabelFormat('A1')}>A1, A2...</Button>
                      <Button variant={labelFormat === '001' ? 'primary' : 'secondary'} className="h-8 text-xs" onClick={() => setLabelFormat('001')}>001, 002...</Button>
                      <Button variant={labelFormat === 'custom' ? 'primary' : 'secondary'} className="h-8 text-xs" onClick={() => setLabelFormat('custom')}>Custom</Button>
                    </div>
                    {labelFormat === 'custom' && (
                      <Input value={customPrefix} onChange={e => setCustomPrefix(e.target.value)} placeholder="Prefix (e.g. NYC-)" className="mt-2 h-8" />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">Tracked URL</label>
                    <Input readOnly value={`https://scanmap.io/c/cmp_123_A1`} className="bg-bg text-muted font-mono text-xs" />
                  </div>
                </div>

                <div className="border border-border rounded-sm p-4 bg-bg flex items-center justify-center relative aspect-[3/4]">
                  {flyerPreview && <img src={flyerPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                  <div className={`absolute w-24 h-24 bg-white p-2 flex flex-col items-center justify-center shadow-lg
                    ${qrPosition === 'tl' ? 'top-4 left-4' : qrPosition === 'tr' ? 'top-4 right-4' : qrPosition === 'bl' ? 'bottom-4 left-4' : 'bottom-4 right-4'}
                  `}>
                    <div className="w-full h-full border-2 border-black border-dashed flex items-center justify-center">QR</div>
                    <div className="text-[10px] font-mono text-black mt-1 font-bold">A1</div>
                  </div>
                </div>
              </div>

              {isGenerating && (
                <div className="pt-6 border-t border-border">
                  <div className="flex justify-between font-mono text-xs mb-2">
                    <span className="text-muted">Processing unique QR codes & locations...</span>
                    <span className="text-accent">{progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all duration-100" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} disabled={isGenerating}>Back</Button>
                <Button onClick={generateBatch} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate Batch'}
                </Button>
              </div>
            </Card>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="aspect-[3/4] p-2 flex flex-col relative overflow-hidden">
                    <img src={flyerPreview || "https://picsum.photos/seed/poster/400/600"} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute w-12 h-12 bg-white p-1 flex flex-col items-center justify-center
                      ${qrPosition === 'tl' ? 'top-2 left-2' : qrPosition === 'tr' ? 'top-2 right-2' : qrPosition === 'bl' ? 'bottom-2 left-2' : 'bottom-2 right-2'}
                    `}>
                      <div className="w-full h-full border border-black border-dashed flex items-center justify-center text-[8px]">QR</div>
                      <div className="text-[6px] font-mono text-black font-bold">A{i}</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-bg/90 backdrop-blur p-1 text-center font-mono text-[10px] text-accent border-t border-border">
                      A{i}
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 flex flex-col h-fit">
                <div className="font-mono text-[11px] text-accent mb-1 uppercase">Export Settings</div>
                <div className="font-mono text-xs text-muted mb-6">Selected: {qrQuantity} Flyers, CSV Data</div>
                
                <div className="h-px w-full bg-border mb-6" />
                
                <div className="font-mono text-[11px] text-muted mb-2 uppercase">Progress</div>
                <div className="text-sm text-text mb-2">Generating {qrQuantity} flyers...</div>
                <div className="h-1 w-full bg-border rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-accent w-full" />
                </div>
                <div className="font-mono text-xs text-muted mb-6">100% COMPLETE ({qrQuantity} / {qrQuantity})</div>
                
                <div className="h-px w-full bg-border mb-6" />
                
                <div className="font-mono text-[11px] text-muted mb-4 uppercase">Download Options</div>
                <div className="flex justify-between font-mono text-xs mb-2">
                  <span className="text-muted">Format</span>
                  <span className="text-text">PDF (Select)</span>
                </div>
                <div className="flex justify-between font-mono text-xs mb-2">
                  <span className="text-muted">Resolution</span>
                  <span className="text-text">300 DPI</span>
                </div>
                <div className="flex justify-between font-mono text-xs mb-6">
                  <span className="text-muted">Pages</span>
                  <span className="text-text">{qrQuantity} (Single Files)</span>
                </div>
                
                <div className="h-px w-full bg-border mb-6" />
                
                <div className="font-mono text-[11px] text-muted mb-4 uppercase">Data Export</div>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-10 bg-surface border border-border rounded-sm flex items-center justify-center">
                    <FileText className="h-4 w-4 text-muted" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-text">location_data.csv</span>
                    <span className="font-mono text-[10px] text-muted">(14.2 KB)</span>
                  </div>
                </div>
                
                <Button className="w-full mb-3" onClick={downloadZip}>GENERATE BATCH ({qrQuantity} Flyers)</Button>
                <Button variant="secondary" className="w-full mb-3" onClick={downloadZip}>DOWNLOAD CSV</Button>
                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10" onClick={handleSaveCampaign}>SAVE CAMPAIGN & EXIT</Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
