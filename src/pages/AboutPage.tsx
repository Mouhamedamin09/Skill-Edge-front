import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Target,
  Zap,
  Shield,
  Heart,
  Award,
  Globe,
  Lightbulb,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "We're committed to democratizing interview preparation and helping everyone succeed.",
    },
    {
      icon: Users,
      title: "User-Centric",
      description:
        "Every feature we build is designed with our users' success in mind.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We constantly push the boundaries of what's possible with AI technology.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data and privacy are our top priorities, always.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description:
        "Former Google engineer with 10+ years in AI and machine learning.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description:
        "Expert in natural language processing and real-time systems.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      description:
        "UX designer passionate about making technology accessible to everyone.",
    },
    {
      name: "David Kim",
      role: "Lead Engineer",
      description:
        "Full-stack developer specializing in scalable web applications.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Users Helped" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="hero-title">About SkillEdge</h1>
            <p className="hero-subtitle">
              We're on a mission to revolutionize interview preparation through
              cutting-edge AI technology and personalized assistance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="story-text"
            >
              <h2 className="section-title">Our Story</h2>
              <p className="story-paragraph">
                SkillEdge was born from a simple observation: traditional
                interview preparation methods are outdated, expensive, and often
                ineffective. We saw talented professionals struggling to
                showcase their skills due to lack of proper preparation and
                real-time guidance.
              </p>
              <p className="story-paragraph">
                Our founders, having experienced the challenges of technical
                interviews firsthand, decided to create a solution that combines
                the power of artificial intelligence with personalized coaching
                to help everyone succeed in their dream roles.
              </p>
              <p className="story-paragraph">
                Today, SkillEdge serves thousands of professionals worldwide,
                helping them land their dream jobs through intelligent,
                real-time interview assistance.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="story-visual"
            >
              <div className="visual-card">
                <Zap size={48} className="visual-icon" />
                <h3>AI-Powered</h3>
                <p>
                  Advanced machine learning algorithms provide intelligent
                  responses
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="section-header"
          >
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="values-grid">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="value-card"
                >
                  <div className="value-icon">
                    <Icon size={32} />
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="stats-grid"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="stat-item"
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="section-header"
          >
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              The passionate people behind SkillEdge
            </p>
          </motion.div>

          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="team-card"
              >
                <div className="member-avatar">
                  <Users size={32} />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-description">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mission-content"
          >
            <div className="mission-icon">
              <Heart size={48} />
            </div>
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-text">
              To democratize interview preparation by providing accessible,
              intelligent, and personalized assistance that helps every
              professional showcase their true potential and land their dream
              job.
            </p>
            <div className="mission-stats">
              <div className="mission-stat">
                <Globe size={24} />
                <span>Global Impact</span>
              </div>
              <div className="mission-stat">
                <Award size={24} />
                <span>Proven Results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
