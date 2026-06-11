// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, LocationProvider } from './context';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer'; // optional; we'll create a simple one
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RouteAnalysis from './pages/RouteAnalysis';
import LiveTracking from './pages/LiveTracking';
import Emergency from './pages/Emergency';
import AdminAnalytics from './pages/AdminAnalytics';
import NotFound from './pages/NotFound';

// Simple protective wrapper (checks if user is logged in)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-gray-950">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/route-analysis"
                      element={
                        <PrivateRoute>
                          <RouteAnalysis />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/live-tracking"
                      element={
                        <PrivateRoute>
                          <LiveTracking />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/emergency"
                      element={
                        <PrivateRoute>
                          <Emergency />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <PrivateRoute>
                          <AdminAnalytics />
                        </PrivateRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;