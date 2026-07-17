import { Navigate, Route, Routes, Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Login from "./pages/Login.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductEdit from "./pages/ProductEdit.jsx";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div className="p-10 text-center text-soft">Загрузка...</div>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function Shell({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="text-lg font-extrabold text-ink">
            Albatros <span className="font-medium text-soft">/ Панель управления</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-soft">
              {user.name} ({user.email})
            </span>
            <button className="btn-ghost" onClick={logout}>
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Shell>
              <ProductList />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/products/new"
        element={
          <RequireAuth>
            <Shell>
              <ProductEdit mode="new" />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/products/:slug"
        element={
          <RequireAuth>
            <Shell>
              <ProductEdit mode="edit" />
            </Shell>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
