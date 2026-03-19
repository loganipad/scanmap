/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DemoOverlay } from "./components/DemoOverlay";
import { Landing } from "./pages/Landing";
import { Pricing } from "./pages/Pricing";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { Analytics } from './pages/dashboard/Analytics';
import { MapPlanner } from './pages/dashboard/MapPlanner';
import { CampaignBuilder } from './pages/dashboard/CampaignBuilder';
import { Campaigns } from './pages/dashboard/Campaigns';
import { RouteOptimizer } from './pages/dashboard/RouteOptimizer';
import { HeatmapView } from './pages/dashboard/HeatmapView';
import { EmployeeDashboard } from './pages/dashboard/EmployeeDashboard';
import { Help } from './pages/dashboard/Help';
import { Team } from './pages/dashboard/Team';
import { Settings } from './pages/dashboard/Settings';
import { DeployMode } from './pages/DeployMode';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DemoOverlay />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/deploy/:id" element={<DeployMode />} />
          <Route path="/privacy" element={<Landing />} />
          <Route path="/terms" element={<Landing />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/new" element={<CampaignBuilder />} />
            <Route path="map" element={<MapPlanner />} />
            <Route path="route" element={<RouteOptimizer />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="heatmap" element={<HeatmapView />} />
            <Route path="employee" element={<EmployeeDashboard />} />
            <Route path="help" element={<Help />} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
