import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Demo() {
  const { enableDemoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    enableDemoMode();
    navigate("/dashboard", { replace: true });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-accent font-mono">
      Initializing Sandbox Environment...
    </div>
  );
}
