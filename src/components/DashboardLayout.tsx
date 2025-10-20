import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Mic,
  CreditCard,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Monitor,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { skillEdgeLogo } from "../assets/logos";
import ThemeToggle from "./ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect mobile to control sidebar behavior
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 768px)").matches;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Interview", href: "/dashboard/interview", icon: Mic },
    { name: "Desktop App", href: "/dashboard/desktop", icon: Monitor },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile sidebar backdrop */}
      {isMobile && (
        <div
          className={`sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobile && sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src={skillEdgeLogo}
              alt="SkillEdge Logo"
              style={{ width: "150px", height: "75px", objectFit: "contain" }}
            />
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <div className="user-name">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="user-plan">
                {user?.subscription.plan.toUpperCase()} Plan
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Top navbar */}
        <header className="dashboard-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="page-title">
              {navigation.find((item) => item.href === location.pathname)
                ?.name || "Dashboard"}
            </h1>
          </div>

          <div className="header-right">
            <ThemeToggle />
            <div className="plan-badge">
              {user?.subscription.plan.toUpperCase()}
            </div>
            <div className="usage-indicator">
              <span className="usage-text">
                {user?.usage.minutesUsed || 0} /{" "}
                {user?.usage.minutesLimit === -1
                  ? "∞"
                  : user?.usage.minutesLimit || 0}{" "}
                min
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
