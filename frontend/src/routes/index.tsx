import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { HomePage } from "../pages/public/HomePage"
import { LoginPage } from "../pages/auth/LoginPage"
import { RegisterPage } from "../pages/auth/RegisterPage"
import { DashboardPage } from "../pages/dashboard/DashboardPage"
import { ProfilePage } from "../pages/dashboard/ProfilePage"
import { OrderPage } from "../pages/customer/OrderPage"
import { MyOrdersPage } from "../pages/customer/MyOrdersPage"
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage"
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage"
import { AdminPaketsPage } from "../pages/admin/AdminPaketsPage"
import { OwnerReportsPage } from "../pages/owner/OwnerReportsPage"

function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
}: {
  children: React.ReactNode
  requiredRole?: string
  allowedRoles?: string[]
}) {
  const { token, roles, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    )
  }

  if (!token) return <Navigate to="/login" replace />

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/redirect" replace />
  }

  if (allowedRoles && !allowedRoles.some((role) => roles.includes(role))) {
    return <Navigate to="/redirect" replace />
  }

  return <>{children}</>
}

function SmartRedirect() {
  const { token, roles, isLoading } = useAuth()

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>
  }

  if (!token) return <Navigate to="/login" replace />
  if (roles.includes("owner")) return <Navigate to="/owner/reports" replace />
  if (roles.includes("admin")) return <Navigate to="/admin" replace />
  return <Navigate to="/dashboard" replace />
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/redirect" element={<SmartRedirect />} />

        {/* Customer */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pakets"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPaketsPage />
            </ProtectedRoute>
          }
        />

        {/* Owner only */}
        <Route
         path="/owner/reports"
          element={
        <ProtectedRoute requiredRole="owner">
        <OwnerReportsPage />
        </ProtectedRoute>
        }
        />

        <Route path="*" element={<Navigate to="/redirect" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
