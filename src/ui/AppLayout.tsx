import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiHeart, FiUsers, FiBook, FiMessageCircle, FiVideo, FiMenu, FiX, FiMoon, FiSun, FiLogOut } from "react-icons/fi";
import { useDarkMode } from "@/context/DarkModeContext";
import { useAuth } from "@/context/useAuth";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: FiHome },
  { path: "/health", label: "Health", icon: FiHeart },
  { path: "/community", label: "Community", icon: FiUsers },
  { path: "/resources", label: "Resources", icon: FiBook },
  { path: "/ai", label: "AI Support", icon: FiMessageCircle },
  { path: "/consultation", label: "Consult", icon: FiVideo },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed h-full z-30">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl shecare-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">S</span>
            <span className="text-xl font-bold text-foreground">SheCare</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <div className="px-4 py-2 text-sm text-muted-foreground">
            Signed in as <span className="text-foreground font-medium">{user?.name || "User"}</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full"
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full"
          >
            <FiLogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg shecare-gradient flex items-center justify-center text-primary-foreground font-bold text-xs">S</span>
          <span className="text-lg font-bold text-foreground">SheCare</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Sign out"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
          <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-14 left-0 right-0 bg-card border-b border-border p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
