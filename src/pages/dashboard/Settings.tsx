import React, { useState } from "react";
import { Card, Button, Input } from "../../components/ui";
import { User, Bell, Shield, CreditCard, Globe, Moon, Sun, Monitor, Smartphone } from "lucide-react";

export function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col h-full bg-bg p-6 space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <Button variant="primary">Save Changes</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
            { id: "billing", label: "Billing", icon: CreditCard },
            { id: "preferences", label: "Preferences", icon: Globe },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? "bg-accent/10 text-accent border border-accent/20" 
                  : "text-muted hover:text-text hover:bg-surface"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <Card className="p-6 border-border space-y-6 bg-surface">
              <div>
                <h2 className="text-lg font-bold text-text mb-1">Public Profile</h2>
                <p className="text-sm text-muted">This information will be displayed publicly.</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 text-accent text-2xl font-bold">
                  JD
                </div>
                <div className="space-y-2">
                  <Button variant="secondary" className="text-xs">Change Avatar</Button>
                  <Button variant="ghost" className="text-xs text-red-500 hover:text-red-400">Remove</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">First Name</label>
                  <Input defaultValue="John" className="bg-bg" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Last Name</label>
                  <Input defaultValue="Doe" className="bg-bg" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text">Email Address</label>
                  <Input defaultValue="john.doe@example.com" type="email" className="bg-bg" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text">Company</label>
                  <Input defaultValue="Acme Corp" className="bg-bg" />
                </div>
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="p-6 border-border space-y-6 bg-surface">
              <div>
                <h2 className="text-lg font-bold text-text mb-1">Notification Preferences</h2>
                <p className="text-sm text-muted">Manage how you receive alerts and updates.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: "email", title: "Email Notifications", desc: "Receive daily summaries and alerts via email." },
                  { key: "push", title: "Push Notifications", desc: "Receive real-time alerts in your browser." },
                  { key: "sms", title: "SMS Alerts", desc: "Get critical alerts directly to your phone." },
                  { key: "marketing", title: "Marketing Emails", desc: "Receive product updates and promotional offers." }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-border rounded-md bg-bg">
                    <div>
                      <div className="font-medium text-text">{item.title}</div>
                      <div className="text-xs text-muted mt-1">{item.desc}</div>
                    </div>
                    <button 
                      onClick={() => handleNotificationChange(item.key as keyof typeof notifications)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key as keyof typeof notifications] ? 'bg-accent' : 'bg-surface border border-border'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[item.key as keyof typeof notifications] ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "preferences" && (
            <Card className="p-6 border-border space-y-6 bg-surface">
              <div>
                <h2 className="text-lg font-bold text-text mb-1">App Preferences</h2>
                <p className="text-sm text-muted">Customize your workspace experience.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text mb-3 block">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Monitor }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center justify-center p-4 border rounded-md gap-2 transition-colors ${
                          theme === t.id ? "border-accent bg-accent/10 text-accent" : "border-border bg-bg text-muted hover:text-text"
                        }`}
                      >
                        <t.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-sm font-medium text-text">Timezone</label>
                  <select className="w-full h-10 px-3 rounded-md border border-border bg-bg text-text text-sm focus:outline-none focus:border-accent">
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                    <option>Asia/Tokyo (JST)</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="p-6 border-border space-y-6 bg-surface">
              <div>
                <h2 className="text-lg font-bold text-text mb-1">Security Settings</h2>
                <p className="text-sm text-muted">Manage your password and security preferences.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Current Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-bg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">New Password</label>
                    <Input type="password" placeholder="••••••••" className="bg-bg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Confirm New Password</label>
                    <Input type="password" placeholder="••••••••" className="bg-bg" />
                  </div>
                </div>
                <Button variant="secondary" className="mt-2">Update Password</Button>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-md font-medium text-text mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border border-border rounded-md bg-bg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-muted" />
                    <div>
                      <div className="font-medium text-text">Authenticator App</div>
                      <div className="text-xs text-muted">Not configured</div>
                    </div>
                  </div>
                  <Button variant="secondary" className="text-xs h-8">Enable</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card className="p-6 border-border space-y-6 bg-surface">
              <div>
                <h2 className="text-lg font-bold text-text mb-1">Billing & Subscription</h2>
                <p className="text-sm text-muted">Manage your plan and payment methods.</p>
              </div>

              <div className="p-4 border border-accent/30 bg-accent/5 rounded-md flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-accent mb-1">CURRENT PLAN</div>
                  <div className="text-xl font-bold text-text">Pro Tier</div>
                  <div className="text-sm text-muted mt-1">$49.00 / month</div>
                </div>
                <Button variant="primary">Upgrade Plan</Button>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-md font-medium text-text">Payment Method</h3>
                <div className="flex items-center justify-between p-4 border border-border rounded-md bg-bg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-muted" />
                    <div>
                      <div className="font-medium text-text">Visa ending in 4242</div>
                      <div className="text-xs text-muted">Expires 12/2028</div>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-xs h-8">Edit</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
