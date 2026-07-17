import { Navigate, Route, Routes, Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Login from "./pages/Login.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductEdit from "./pages/ProductEdit.jsx";
import PartnersList from "./pages/PartnersList.jsx";
import PartnerEdit from "./pages/PartnerEdit.jsx";

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

const NAV = [
  { to: "/", label: "Продукты", end: true },
  { to: "/partners", label: "Партнёры" },
];

function Shell({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-extrabold text-ink">
              Albatros <span className="font-medium text-soft">/ Панель управления</span>
            </Link>
            <nav className="flex flex-wrap gap-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    "rounded-lg px-3 py-1.5 text-sm font-medium " +
                    (isActive ? "bg-panel text-clinical" : "text-soft hover:text-ink")
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
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

function guard(el) {
  return (
    <RequireAuth>
      <Shell>{el}</Shell>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={guard(<ProductList />)} />
      <Route path="/products/new" element={guard(<ProductEdit mode="new" />)} />
      <Route path="/products/:slug" element={guard(<ProductEdit mode="edit" />)} />
      <Route path="/partners" element={guard(<PartnersList />)} />
      <Route path="/partners/new" element={guard(<PartnerEdit mode="new" />)} />
      <Route path="/partners/:id" element={guard(<PartnerEdit mode="edit" />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
