import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

import { AuthContext } from "./context/AuthContext";
import AppLayout from "./layouts/AppLayout";

// ---------- PROTECTED ROUTE ----------
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return null;

  return token ? children : <Navigate to="/login" />;
};

// ---------- ADMIN ROUTE ----------
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AppLayout>
                  <Analytics />
                </AppLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
