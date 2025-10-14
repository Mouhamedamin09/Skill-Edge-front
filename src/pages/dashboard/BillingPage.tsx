import React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  Crown,
  Zap,
  Clock,
  ArrowRight,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "month",
      description: "Perfect for getting started",
      icon: Clock,
      color: "var(--secondary-500)",
      bgColor: "var(--secondary-50)",
      features: [
        "15 minutes per month",
        "GPT-3.5 responses",
        "Basic interview types",
        "Email support",
      ],
      current: user.subscription.plan === "free",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "month",
      description: "For serious interview preparation",
      icon: Zap,
      color: "var(--primary-500)",
      bgColor: "var(--primary-50)",
      features: [
        "3 hours per month",
        "GPT-4 responses",
        "All interview types",
        "Priority support",
        "Performance analytics",
        "Custom preferences",
      ],
      current: user.subscription.plan === "pro",
      popular: true,
    },
    {
      id: "pro+",
      name: "Pro+",
      price: "$99",
      period: "month",
      description: "Unlimited everything",
      icon: Crown,
      color: "var(--accent-500)",
      bgColor: "var(--accent-50)",
      features: [
        "Unlimited usage",
        "GPT-4 Turbo responses",
        "All features included",
        "24/7 priority support",
        "Advanced analytics",
        "Custom integrations",
        "White-label options",
      ],
      current: user.subscription.plan === "pro+",
      popular: false,
    },
  ];

  const currentPlan = plans.find((plan) => plan.current);

  const getDaysUntilBilling = () => {
    if (!user.subscription.endDate) return null;
    const endDate = new Date(user.subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysUntilBilling = getDaysUntilBilling();
  const isPro = user.subscription.plan === "pro";

  return (
    <div className="billing-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="billing-header"
      >
        <div className="header-content">
          <h1 className="page-title">Billing & Plans</h1>
          <p className="page-subtitle">
            Manage your subscription and billing information
          </p>
        </div>
      </motion.div>

      {/* Current Plan Section */}
      {currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="current-plan-section"
        >
          <div className="current-plan-card">
            <div className="plan-header">
              <div
                className="plan-icon"
                style={{
                  backgroundColor: currentPlan.bgColor,
                  color: currentPlan.color,
                }}
              >
                <currentPlan.icon size={32} />
              </div>
              <div className="plan-info">
                <h3 className="plan-name">{currentPlan.name} Plan</h3>
                <p className="plan-description">{currentPlan.description}</p>
              </div>
              <div className="plan-status">
                <span className="status-badge current">Current Plan</span>
              </div>
            </div>

            <div className="plan-details">
              <div className="detail-item">
                <Calendar size={20} />
                <div>
                  <span className="detail-label">Next Billing Date</span>
                  <span className="detail-value">
                    {user.subscription.endDate
                      ? new Date(user.subscription.endDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
              {daysUntilBilling !== null && (
                <div className="detail-item">
                  <TrendingUp size={20} />
                  <div>
                    <span className="detail-label">Days Until Billing</span>
                    <span className="detail-value">
                      {daysUntilBilling} days
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Removed extra top-up section per request */}
        </motion.div>
      )}

      {/* Available Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="plans-section"
      >
        <div className="section-header">
          <h2 className="section-title">Available Plans</h2>
          <p className="section-subtitle">
            Choose the plan that best fits your interview preparation needs
          </p>
        </div>

        <div className="plans-grid">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className={`plan-card ${plan.popular ? "popular" : ""} ${
                  plan.current ? "current" : ""
                }`}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                {plan.current && (
                  <div className="current-badge">Current Plan</div>
                )}

                <div className="card-header">
                  <div
                    className="card-icon"
                    style={{
                      backgroundColor: plan.bgColor,
                      color: plan.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="card-title">
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                  </div>
                </div>

                <div className="card-pricing">
                  <div className="price">
                    <span className="amount">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                </div>

                <div className="card-features">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="feature-item">
                      <div className="feature-bullet">
                        <CheckCircle size={16} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="card-actions">
                  {plan.current && plan.id === "pro" ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-upgrade primary"
                      onClick={() =>
                        navigate("/code-redemption", {
                          state: { selectedPlan: "pro" },
                        })
                      }
                    >
                      Add more hours
                      <ArrowRight size={16} />
                    </motion.button>
                  ) : plan.current ? (
                    <button className="btn-current" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`btn-upgrade ${
                        plan.popular ? "primary" : "secondary"
                      }`}
                      onClick={() =>
                        navigate("/code-redemption", {
                          state: { selectedPlan: plan.id },
                        })
                      }
                    >
                      {plan.id === "pro+"
                        ? "Upgrade to Pro+"
                        : `Upgrade to ${plan.name}`}
                      <ArrowRight size={16} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Billing Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="billing-info-section"
      >
        <div className="billing-info-card">
          <div className="info-header">
            <CreditCard size={24} />
            <h3>Billing Information</h3>
          </div>
          <div className="info-content">
            <p>
              Your subscription is managed securely through our payment
              processor. You can update your billing information and payment
              methods at any time.
            </p>
            <div className="info-actions">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                Update Payment Method
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline"
              >
                Download Invoice
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BillingPage;
