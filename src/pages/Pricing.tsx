import { Link } from "react-router-dom";
import { Navbar, Footer } from "../components/Layout";
import { Button, Card } from "../components/ui";

export function Pricing() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar />
      
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-text mb-4">Simple. Flat. Unlimited.</h1>
            <p className="font-mono text-muted">Start free with 20 QR codes. No card required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {/* FREE */}
            <Card className="p-8 flex flex-col border-border">
              <h3 className="text-2xl font-bold mb-2">FREE</h3>
              <div className="text-4xl font-mono text-text mb-6">$0</div>
              <ul className="space-y-4 mb-8 flex-1 text-muted">
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> All features unlocked</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> 20 total QR generations (lifetime)</li>
              </ul>
              <div className="text-xs text-muted mb-4">All features. Just 20 QR codes total.</div>
              <Link to="/dashboard">
                <Button variant="secondary" className="w-full">Start Free</Button>
              </Link>
            </Card>

            {/* PRO */}
            <Card className="p-8 flex flex-col border-accent relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-bg px-3 py-1 text-xs font-bold rounded-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">PRO</h3>
              <div className="text-4xl font-mono text-text mb-6">$49.99<span className="text-lg text-muted">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-muted">
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Unlimited QR generation</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Unlimited campaigns</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> No restrictions</li>
              </ul>
              <Link to="/dashboard">
                <Button className="w-full">Go Pro</Button>
              </Link>
            </Card>

            {/* ANNUAL */}
            <Card className="p-8 flex flex-col border-border relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface border border-border text-text px-3 py-1 text-xs font-bold rounded-sm">
                Best Value
              </div>
              <h3 className="text-2xl font-bold mb-2">ANNUAL</h3>
              <div className="text-4xl font-mono text-text mb-6">$350<span className="text-lg text-muted">/yr</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-muted">
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Everything in Pro</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> ~$29.17/mo effective</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Save $249.88 vs monthly</li>
              </ul>
              <Link to="/dashboard">
                <Button variant="secondary" className="w-full">Get Annual</Button>
              </Link>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto border border-dashed border-border p-8 text-center rounded-sm mb-24">
            <h3 className="text-2xl font-bold mb-4">Want us to handle everything?</h3>
            <p className="text-muted mb-6">
              We plan, design, print, place, and report your
              entire offline campaign end to end.
            </p>
            <Button variant="secondary">Request a Campaign Quote</Button>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">FAQ</h2>
            <div className="space-y-8">
              <div>
                <h4 className="font-bold mb-2">Is QR generation really unlimited on Pro?</h4>
                <p className="text-muted">Yes. No caps, no overages, ever.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Do you charge per scan?</h4>
                <p className="text-muted">Never. Scans are always free on all plans.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">What does the Free plan's 20-QR limit mean?</h4>
                <p className="text-muted">You can generate up to 20 unique QR codes total across all campaigns. Enough to test everything. Upgrade to Pro to run real campaigns at scale.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Can I use this with a team?</h4>
                <p className="text-muted">Yes. All plans include deployment mode.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Can I cancel anytime?</h4>
                <p className="text-muted">Monthly plans cancel at end of billing period. Annual plans non-refundable after 14 days.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
