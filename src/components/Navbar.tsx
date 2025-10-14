import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, User, Mic } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", current: location.pathname === "/" },
    {
      name: "Pricing",
      href: "/pricing",
      current: location.pathname === "/pricing",
    },
    {
      name: "About Us",
      href: "/about",
      current: location.pathname === "/about",
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <img
            src="/skillEdgeLogo.png"
            alt="SkillEdge Logo"
            className="navbar-logo-img"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-nav">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`navbar-link ${item.current ? "active" : ""}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="navbar-actions">
          <Link to="/login" className="btn-nav outline">
            <LogIn size={16} />
            Login
          </Link>
          <Link to="/signup" className="btn-nav primary">
            <User size={16} />
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-content">
          <ul className="mobile-nav-links">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`mobile-nav-link ${item.current ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-auth">
            <Link
              to="/login"
              className="btn-nav outline"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn size={16} />
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-nav primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={16} />
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
