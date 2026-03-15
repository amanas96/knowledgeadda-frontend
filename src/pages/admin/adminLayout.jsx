import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  MessageSquare,
  BarChart2,
  LogOut,
  Globe,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: <LayoutDashboard size={18} />,
    exact: true,
  },
  {
    label: "Manage Courses",
    to: "/admin/courses",
    icon: <BookOpen size={18} />,
  },
  {
    label: "Create Course",
    to: "/admin/courses/new",
    icon: <PlusCircle size={18} />,
  },
  {
    label: "Create Quiz",
    to: "/admin/quizzes/new",
    icon: <PlusCircle size={18} />,
  },
  {
    label: "Contact Messages",
    to: "/admin/contacts",
    icon: <MessageSquare size={18} />,
  },
  { label: "Analytics", to: "/admin/analytics", icon: <BarChart2 size={18} /> },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ open by default on desktop

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* ── Mobile Overlay ───────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/50 flex-shrink-0">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              KnowledgeAdda
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin Info */}
        <div className="px-6 py-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() =>
                setSidebarOpen(window.innerWidth >= 1024 ? true : false)
              }
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${
                  isActive(item)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
            >
              {item.icon}
              {item.label}
              {isActive(item) && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-4 border-t border-gray-700/50 space-y-1 flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <Globe size={18} />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Hamburger — works on ALL screen sizes */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Breadcrumb */}
            <div className="text-sm text-gray-900 hidden sm:flex items-center gap-1">
              <Link
                to="/admin"
                className="hover:text-blue-600 transition-colors text-xl"
              >
                Admin
              </Link>
              {location.pathname !== "/admin" && (
                <>
                  <ChevronRight size={14} />
                  <span className="text-gray-800 font-medium capitalize">
                    {location.pathname
                      .split("/")
                      .filter(Boolean)
                      .slice(1)
                      .join(" › ")}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Globe size={15} />
              View Site
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
