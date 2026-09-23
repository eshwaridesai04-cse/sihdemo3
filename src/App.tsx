import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { VoiceProvider } from './context/VoiceContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationToast } from './components/NotificationToast';
import { ProtectedRoute } from './components/ProtectedRoute';

// Authentication Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// Complete Application Pages
import { HomePage } from './pages/HomePage';
import { AIScannerPage } from './pages/AIScannerPage';
import { LivePricesPage } from './pages/LivePricesPage';
import { RequestPickupPage } from './pages/RequestPickupPage';
import { TrackPickupPage } from './pages/TrackPickupPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';
import { CollectorDashboardPage } from './pages/CollectorDashboardPage';
import { AggregatorDashboardPage } from './pages/AggregatorDashboardPage';
import { RecyclerDashboardPage } from './pages/RecyclerDashboardPage';
import { EarningsDashboardPage } from './pages/EarningsDashboardPage';
import { TraceabilityDashboardPage } from './pages/TraceabilityDashboardPage';
import { CollectorDigitalPassportPage } from './pages/CollectorDigitalPassportPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpSafetyPage } from './pages/HelpSafetyPage';

export function App() {
  return (
    <LanguageProvider>
      <VoiceProvider>
        <AuthProvider>
          <AppProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-[#0B1310] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
                <Navbar />
                <NotificationToast />

                <main className="flex-grow">
                  <Routes>
                    {/* Public Landing Page */}
                    <Route path="/" element={<HomePage />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* AI Material Scanner */}
                    <Route path="/scanner" element={<AIScannerPage />} />

                    {/* Live Material Price Dashboard */}
                    <Route path="/prices" element={<LivePricesPage />} />

                    {/* Request Pickup */}
                    <Route path="/request-pickup" element={<RequestPickupPage />} />

                    {/* Track Pickup */}
                    <Route path="/track-pickup" element={<TrackPickupPage />} />

                    {/* Protected Dashboards: Direct Routes */}
                    <Route
                      path="/citizen-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['citizen']}>
                          <CitizenDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/collector-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['collector']}>
                          <CollectorDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/aggregator-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['aggregator']}>
                          <AggregatorDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/recycler-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['recycler']}>
                          <RecyclerDashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Aliases for /dashboard/:role */}
                    <Route
                      path="/dashboard/citizen"
                      element={
                        <ProtectedRoute allowedRoles={['citizen']}>
                          <CitizenDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/collector"
                      element={
                        <ProtectedRoute allowedRoles={['collector']}>
                          <CollectorDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/aggregator"
                      element={
                        <ProtectedRoute allowedRoles={['aggregator']}>
                          <AggregatorDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/recycler"
                      element={
                        <ProtectedRoute allowedRoles={['recycler']}>
                          <RecyclerDashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Earnings Dashboard (Collector Protected) */}
                    <Route
                      path="/earnings"
                      element={
                        <ProtectedRoute allowedRoles={['collector', 'aggregator']}>
                          <EarningsDashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* QR Traceability Dashboard */}
                    <Route path="/traceability" element={<TraceabilityDashboardPage />} />

                    {/* Collector Digital Passport */}
                    <Route
                      path="/passport"
                      element={
                        <ProtectedRoute allowedRoles={['collector']}>
                          <CollectorDigitalPassportPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Settings */}
                    <Route path="/settings" element={<SettingsPage />} />

                    {/* Help & Safety */}
                    <Route path="/help" element={<HelpSafetyPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </Router>
          </AppProvider>
        </AuthProvider>
      </VoiceProvider>
    </LanguageProvider>
  );
}

export default App;
