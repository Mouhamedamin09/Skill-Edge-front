import React from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "API", href: "/api" },
      { name: "Integrations", href: "/integrations" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Status", href: "/status" },
      { name: "Community", href: "/community" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/skilledge" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/company/skilledge",
    },
    { name: "GitHub", icon: Github, href: "https://github.com/skilledge" },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img
                src="/skillEdgeLogo.png"
                alt="SkillEdge Logo"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                }}
              />
            </Link>
            <p className="footer-description">
              The intelligent interview assistant that helps you master every
              interview with AI-powered real-time responses and personalized
              insights.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={16} />
                <span>mouhamedaminkraiem09@gmail.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+216 (29) 453228</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Germany, Aachen</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-section">
            <h3>Product</h3>
            <ul>
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 SkillEdge. All rights reserved.
          </p>
          <div className="footer-social">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
