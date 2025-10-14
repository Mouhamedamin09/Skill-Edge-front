import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mic,
  Brain,
  Shield,
  Zap,
  Users,
  BarChart3,
  Target,
  CheckCircle,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [showInterviewTypes, setShowInterviewTypes] = useState(false);

  const interviewTypes = [
    {
      id: "technical",
      name: "Technical Interview",
      description: "Coding challenges, system design, algorithms",
      icon: Target,
      color: "var(--primary-500)",
      bgColor: "var(--primary-50)",
    },
    {
      id: "behavioral",
      name: "Behavioral Interview",
      description: "STAR method, leadership, teamwork questions",
      icon: Zap,
      color: "var(--accent-500)",
      bgColor: "var(--accent-50)",
    },
    {
      id: "general",
      name: "General Interview",
      description: "Mixed questions, company culture, role fit",
      icon: CheckCircle,
      color: "var(--secondary-600)",
      bgColor: "var(--secondary-100)",
    },
  ];

  const handleInterviewTypeSelect = (typeId: string) => {
    // Navigate to interview session with the selected type
    navigate("/dashboard/interview/session", {
      state: {
        userName: "User",
        meetingPurpose: "Interview Practice",
        generalInfo: "",
        interviewType: typeId,
        selectedLanguage: "en",
      },
    });
  };

  const features = [
    {
      icon: Mic,
      title: "Real-time Transcription",
      description:
        "Advanced speech-to-text with 99%+ accuracy for seamless interview experiences.",
    },
    {
      icon: Brain,
      title: "AI-Powered Responses",
      description:
        "Context-aware suggestions based on your skills, experience, and interview type.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "End-to-end encryption and compliance-ready for sensitive interview data.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Instant AI responses and real-time processing for smooth interview flow.",
    },
    {
      icon: Users,
      title: "Personalized Profiles",
      description:
        "Tailored assistance based on your skills, experience, and career goals.",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Detailed insights and metrics to help you improve interview performance.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Successful Interviews" },
    { number: "95%", label: "User Satisfaction" },
    { number: "50+", label: "Countries Served" },
    { number: "24/7", label: "AI Support" },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="hero-title">
                Master Every
                <span className="primary-text"> Interview</span>
              </h1>
              <p className="hero-subtitle">
                The intelligent interview assistant that listens, transcribes,
                and provides real-time AI-powered responses to help you excel in
                any interview.
              </p>
              <div className="hero-buttons">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/pricing")}
                  className="btn-primary"
                >
                  <span>Start Your First Interview</span>
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline"
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="stat-item"
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">
                Everything you need to ace your interviews
              </h2>
              <p className="section-subtitle">
                SkillEdge combines cutting-edge AI technology with intuitive
                design to revolutionize how you prepare for and navigate
                interviews.
              </p>
            </motion.div>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">How SkillEdge Works</h2>
              <p className="section-subtitle">
                Three simple steps to interview success
              </p>
            </motion.div>
          </div>

          <div className="steps-grid">
            {[
              {
                step: "01",
                title: "Set Up Your Profile",
                description:
                  "Tell us about your skills, experience, and career goals for personalized assistance.",
              },
              {
                step: "02",
                title: "Start Your Interview",
                description:
                  "Begin recording and let our AI listen in real-time to provide instant suggestions.",
              },
              {
                step: "03",
                title: "Get Real-time Help",
                description:
                  "Receive AI-powered responses and insights to help you answer questions confidently.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="step-item"
              >
                <div className="step-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to transform your interview experience?</h2>
            <p>
              Join thousands of professionals who have already mastered their
              interviews with SkillEdge.
            </p>
            <div className="hero-buttons">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
                onClick={() => navigate("/pricing")}
              >
                <span>Get Started Free</span>
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline-white"
                onClick={() => navigate("/pricing")}
              >
                View Pricing
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Interview Type Selection Modal */}
      {showInterviewTypes && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="modal-overlay"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Choose Interview Type</h3>
              <button
                onClick={() => setShowInterviewTypes(false)}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="interview-types-grid">
              {interviewTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInterviewTypeSelect(type.id)}
                    className="interview-type-card"
                  >
                    <div
                      className="interview-type-icon"
                      style={{
                        backgroundColor: type.bgColor,
                        color: type.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="interview-type-content">
                      <h4 className="interview-type-name">{type.name}</h4>
                      <p className="interview-type-description">
                        {type.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
