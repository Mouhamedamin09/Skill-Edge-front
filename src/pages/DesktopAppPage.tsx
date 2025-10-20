import React from "react";
import { motion } from "framer-motion";
import {
  Download,
  Shield,
  Zap,
  Eye,
  Monitor,
  CheckCircle,
  AlertCircle,
  MonitorSpeaker,
  HardDrive,
  Wifi,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DesktopAppPage: React.FC = () => {
  const features = [
    {
      icon: <Shield size={32} />,
      title: "Undetectable AI",
      description:
        "Advanced technology that prevents interviewers from detecting AI assistance during screen sharing sessions",
      color: "#3b82f6",
    },
    {
      icon: <Eye size={32} />,
      title: "Screen Share Safe",
      description:
        "Works seamlessly during screen sharing without being detected by standard monitoring tools",
      color: "#10b981",
    },
    {
      icon: <Zap size={32} />,
      title: "Real-time Assistance",
      description:
        "Get instant AI-powered responses and suggestions during live interview sessions",
      color: "#f59e0b",
    },
    {
      icon: <Users size={32} />,
      title: "Pro/Pro+ Required",
      description:
        "Access to desktop app features requires an active Pro or Pro+ subscription",
      color: "#8b5cf6",
    },
  ];

  const systemRequirements = [
    {
      icon: <MonitorSpeaker size={24} />,
      requirement: "Windows 10 or later",
      description: "Compatible with Windows 10, 11, and future versions",
    },
    {
      icon: <HardDrive size={24} />,
      requirement: "4GB RAM minimum",
      description: "8GB recommended for optimal performance",
    },
    {
      icon: <HardDrive size={24} />,
      requirement: "100MB free disk space",
      description: "Additional space for temporary files and updates",
    },
    {
      icon: <Wifi size={24} />,
      requirement: "Internet connection",
      description: "Required for AI processing and account verification",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Download & Install",
      description:
        "Download the SkillEdge Desktop installer and follow the simple installation process",
    },
    {
      number: "02",
      title: "Sign In",
      description:
        "Launch the app and sign in with your Pro or Pro+ SkillEdge account credentials",
    },
    {
      number: "03",
      title: "Start Interviewing",
      description:
        "Begin your interview with undetectable AI assistance and real-time support",
    },
  ];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href =
      "https://skilledgespace.fra1.digitaloceanspaces.com/SkillEdge%20Desktop%20Setup%201.0.0.exe";
    link.download = "SkillEdge Desktop Setup 1.0.0.exe";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="desktop-app-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <div className="hero-text">
              <h1 className="hero-title">
                SkillEdge <span className="text-primary">Desktop App</span>
              </h1>
              <p className="hero-description">
                Download our undetectable desktop application for seamless AI
                assistance during screen sharing interviews. Professional-grade
                technology that works invisibly in the background.
              </p>
              <div className="hero-actions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="btn-primary"
                >
                  <Download size={20} />
                  Download Desktop App
                </motion.button>
                <div className="download-info">
                  <p>File size: ~80MB • Version 1.0.0</p>
                  <p className="access-note">
                    Pro/Pro+ account required to use
                  </p>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="app-preview">
                <div className="app-icon">
                  <Monitor size={80} />
                </div>
                <h3>SkillEdge Desktop</h3>
                <p>Version 1.0.0</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-header"
          >
            <h2 className="section-title">Powerful Desktop Features</h2>
            <p className="section-subtitle">
              Advanced AI technology designed for professional interview
              assistance
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="feature-card"
              >
                <div
                  className="feature-icon"
                  style={{
                    backgroundColor: feature.color + "20",
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="section-header"
          >
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Get started with SkillEdge Desktop in three simple steps
            </p>
          </motion.div>

          <div className="steps-container">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="step-item"
              >
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements Section */}
      <section className="requirements-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">System Requirements</h2>
            <p className="section-subtitle">
              Ensure your system meets the minimum requirements for optimal
              performance
            </p>
          </motion.div>

          <div className="requirements-grid">
            {systemRequirements.map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="requirement-card"
              >
                <div className="requirement-icon">{req.icon}</div>
                <div className="requirement-content">
                  <h3 className="requirement-title">{req.requirement}</h3>
                  <p className="requirement-description">{req.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Notice Section */}
      <section className="security-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="security-card"
          >
            <div className="security-icon">
              <AlertCircle size={32} />
            </div>
            <div className="security-content">
              <h3 className="security-title">Security & Privacy</h3>
              <p className="security-description">
                SkillEdge Desktop uses advanced encryption and privacy
                protection. Your interview data is never stored locally, and the
                AI assistance is completely undetectable by standard screen
                sharing tools. We prioritize your privacy and security above all
                else.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="cta-content"
          >
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Download SkillEdge Desktop and unlock the power of undetectable AI
              assistance
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="btn-primary btn-large"
            >
              <Download size={24} />
              Download Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DesktopAppPage;
