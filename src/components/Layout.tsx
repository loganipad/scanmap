import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "../components/ui";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-bold text-text">SCANMAP</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/#features" className="text-muted transition-colors hover:text-text">Features</Link>
            <Link to="/pricing" className="text-muted transition-colors hover:text-text">Pricing</Link>
            <Link to="/demo" className="text-muted transition-colors hover:text-text">Demo</Link>
            <Link to="/dashboard" className="text-muted transition-colors hover:text-text">Login</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Link to="/pricing">
            <Button variant="secondary" className="h-8 px-4">Start Free</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <span className="font-bold text-text mr-4">SCANMAP</span>
          <p className="text-center text-sm leading-loose text-muted md:text-left">
            <Link to="/#features" className="hover:text-text mr-4">Features</Link>
            <Link to="/pricing" className="hover:text-text mr-4">Pricing</Link>
            <Link to="/demo" className="hover:text-text mr-4">Demo</Link>
            <Link to="/dashboard" className="hover:text-text mr-4">Login</Link>
            <Link to="/privacy" className="hover:text-text mr-4">Privacy</Link>
            <Link to="/terms" className="hover:text-text">Terms</Link>
          </p>
        </div>
        <p className="text-center text-sm text-muted font-mono">
          © 2025 ScanMap
        </p>
      </div>
    </footer>
  );
}
