import { Card } from "../../components/ui";

export function Team() {
  return (
    <div className="flex flex-col h-full bg-bg p-6 space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Team Management</h1>
      </div>
      <Card className="p-6 border-border text-muted">
        Team management features coming soon.
      </Card>
    </div>
  );
}
