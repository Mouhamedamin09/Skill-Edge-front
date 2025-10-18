import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Zap,
  TrendingUp,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Target,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showInterviewTypes, setShowInterviewTypes] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if user came from plan activation
    if (location.state?.planActivated && location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowSuccessMessage(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (!user) return null;

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
      color: "var(--success-500)",
      bgColor: "var(--success-50)",
    },
  ];

  const handleInterviewTypeSelect = (typeId: string) => {
    // Navigate to interview session with the selected type
    navigate("/dashboard/interview/session", {
      state: {
        userName: user.firstName,
        meetingPurpose: "Interview Practice",
        generalInfo: "",
        interviewType: typeId,
        selectedLanguage: "en",
      },
    });
  };

  // Calculate days until billing
  const getDaysUntilBilling = () => {
    if (!user.subscription.endDate) return null;
    const endDate = new Date(user.subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysUntilBilling = getDaysUntilBilling();

  // Derive minutes and plan cap safely
  const rawMinutesLeft = Number(user.subscription.minutesLeft ?? 0);
  const isUnlimited =
    rawMinutesLeft === -1 || user.subscription.plan === "pro+";
  const minutesLeft = isUnlimited ? -1 : Math.max(0, rawMinutesLeft);
  const minutesUsed = Math.max(0, Number(user.usage.totalMinutesUsed || 0));
  const minutesLimit = isUnlimited
    ? -1
    : user.subscription.plan === "free"
    ? 5
    : minutesLeft + minutesUsed; // Pro supports top-ups, so cap is dynamic

  const usagePercentage =
    minutesLimit === -1 || minutesLimit === 0
      ? 0
      : Math.min(100, Math.round((minutesUsed / minutesLimit) * 100));

  const displayedUsed =
    minutesLimit === -1 ? minutesUsed : Math.min(minutesUsed, minutesLimit);

  const stats = [
    {
      title: "Minutes Used",
      value: displayedUsed,
      total: minutesLimit === -1 ? "∞" : minutesLimit,
      unit: "min",
      icon: Clock,
      color: "var(--primary-500)",
      percentage: usagePercentage,
    },
    {
      title: "Days Until Billing",
      value: daysUntilBilling || "N/A",
      unit: daysUntilBilling ? "days" : "",
      icon: Calendar,
      color: "var(--accent-500)",
    },
    {
      title: "Success Rate",
      value: "95%",
      icon: TrendingUp,
      color: "var(--success-500)",
    },
  ];

  return (
    <div className="dashboard-home">
      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6 mx-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-3 text-green-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-600 hover:text-green-800 ml-4"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="welcome-section"
      >
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome back, {user.firstName}! 👋</h1>
          <p className="welcome-subtitle">
            Ready to ace your next interview? Let's get started!
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard/interview")}
          className="start-interview-btn"
        >
          <Zap size={20} />
          <span>Start Interview</span>
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="stat-header">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: stat.color + "20",
                  color: stat.color,
                }}
              >
                <stat.icon size={24} />
              </div>
              <div className="stat-title">{stat.title}</div>
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {stat.value}
                {stat.unit && <span className="stat-unit">{stat.unit}</span>}
                {stat.total && stat.total !== "∞" && (
                  <span className="stat-total">/ {stat.total}</span>
                )}
              </div>
              {stat.percentage !== undefined && (
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${stat.percentage}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                  <span className="progress-text">{stat.percentage}%</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Usage Alert */}
      {usagePercentage > 80 && user.usage.minutesLimit !== -1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="usage-alert"
        >
          <AlertCircle size={20} />
          <div className="alert-content">
            <h4>Usage Alert</h4>
            <p>
              You've used {usagePercentage}% of your monthly minutes.
              {user.subscription.plan === "free"
                ? " Consider upgrading to Pro for more minutes."
                : " Your usage will reset next billing cycle."}
            </p>
          </div>
          {user.subscription.plan === "free" && (
            <button
              onClick={() => navigate("/dashboard/billing")}
              className="alert-action"
            >
              Upgrade Now
            </button>
          )}
        </motion.div>
      )}

      {/* Interview Type Selection Modal */}
      {showInterviewTypes && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="interview-setup"
        >
          <div className="setup-header">
            <h3>Choose Interview Type</h3>
            <button
              onClick={() => setShowInterviewTypes(false)}
              className="close-btn"
            >
              <X size={20} />
            </button>
          </div>
          <div className="interview-types">
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
                    className="type-icon"
                    style={{ backgroundColor: type.bgColor, color: type.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="type-content">
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;
