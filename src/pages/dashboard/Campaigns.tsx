import { Link } from "react-router-dom";
import { Card, Button, Badge } from "../../components/ui";
import { Play, Pause, Trash2, Edit2, Eye, Users } from "lucide-react";
import { useCampaigns } from "../../hooks/useCampaigns";
import { formatDistanceToNow } from 'date-fns';

export function Campaigns() {
  const { campaigns, loading, updateCampaignStatus, deleteCampaign } = useCampaigns();

  return (
    <div className="flex flex-col h-full bg-bg p-6 space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Campaigns</h1>
        <Link to="/dashboard/campaigns/new">
          <Button>New Campaign</Button>
        </Link>
      </div>

      <Card className="border-border overflow-hidden">
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
