import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(raw));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="px-4 py-4 border-b border-slate-800">
          <h1 className="text-lg font-semibold tracking-tight">QR Dine</h1>
          <p className="text-xs text-slate-500">Restaurant Panel</p>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          <NavLink to="/app/orders" className={navItemClass}>
            <span>📦</span>
            <span>Orders</span>
          </NavLink>
          <NavLink to="/app/menu" className={navItemClass}>
            <span>📋</span>
            <span>Menu</span>
          </NavLink>
          <NavLink to="/app/tables" className={navItemClass}>
            <span>🪑</span>
            <span>Tables</span>
          </NavLink>
          <NavLink to="/app/qr-codes" className={navItemClass}>
            <span>📱</span>
            <span>Table QR Codes</span>
          </NavLink>
        </nav>

        <div className="mt-auto px-4 py-4 text-xs text-slate-500">
          <div className="mb-2">
            <p className="font-medium text-slate-300">{user.name}</p>
            <p className="capitalize text-slate-500">{user.role.toLowerCase()}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-slate-400 hover:text-red-400 text-xs"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/60 backdrop-blur">
          <h2 className="text-sm font-medium text-slate-200">
            {user.role === "OWNER"
              ? "Owner Dashboard"
              : user.role === "STAFF"
              ? "Staff Dashboard"
              : user.role === "KITCHEN"
              ? "Kitchen Dashboard"
              : "Dashboard"}
          </h2>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
