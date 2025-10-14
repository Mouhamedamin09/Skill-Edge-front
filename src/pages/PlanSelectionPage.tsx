import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  CreditCard,
  Shield,
  Zap,
  Crown,
  Clock,
  Users,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const PlanSelectionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get the pre-selected plan from navigation state
  const preselectedPlan = location.state?.selectedPlan || "free";

  useEffect(() => {
    setSelectedPlan(preselectedPlan);
  }, [preselectedPlan]);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "month",
      description: "Perfect for getting started",
      icon: Users,
      color: "blue",
      features: [
        "15 minutes per month",
        "GPT-3.5 responses",
        "Basic interview types",
        "Email support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "month",
      description: "For serious job seekers",
      icon: Zap,
      color: "purple",
      popular: true,
      features: [
        "3 hours per month",
        "GPT-4 responses",
        "All interview types",
        "Priority support",
        "Advanced analytics",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For teams and organizations",
      icon: Crown,
      color: "gold",
      features: [
        "Unlimited usage",
        "GPT-4 Turbo responses",
        "All features included",
        "24/7 priority support",
        "Team management",
        "Custom integrations",
      ],
    },
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleActivatePlan = async () => {
    if (!selectedPlan) {
      setError("Please select a plan");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // For free plan, activate immediately
      if (selectedPlan === "free") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/dashboard", {
          state: {
            planActivated: true,
            selectedPlan: selectedPlan,
            message: `Welcome to SkillEdge! Your ${
              plans.find((p) => p.id === selectedPlan)?.name
            } plan has been activated.`,
          },
        });
        return;
      }

      // For paid plans, redirect to code redemption
      navigate("/code-redemption", {
        state: {
          selectedPlan: selectedPlan,
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to activate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);

  return (
    <div className="plan-selection-page">
      <Navbar />

      <div className="plan-selection-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="plan-selection-hero"
        >
          <h1>Choose Your Plan</h1>
          <p>Select the perfect plan for your interview preparation journey</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="plan-selection-error"
          >
            {error}
          </motion.div>
        )}

        <div className="plan-selection-grid">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 * plans.indexOf(plan),
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlanSelect(plan.id)}
                className={`plan-selection-card ${
                  isSelected ? "selected" : ""
                } ${plan.popular ? "popular" : ""}`}
              >
                {plan.popular && (
                  <div className="plan-selection-popular-badge">
                    Most Popular
                  </div>
                )}

                <div className="plan-selection-card-header">
                  <div
                    className={`plan-selection-card-icon ${
                      plan.color === "blue"
                        ? "blue"
                        : plan.color === "purple"
                        ? "purple"
                        : "gold"
                    }`}
                  >
                    <IconComponent size={32} />
                  </div>
                  <h3 className="plan-selection-card-name">{plan.name}</h3>
                  <p className="plan-selection-card-description">
                    {plan.description}
                  </p>
                  <div className="plan-selection-card-pricing">
                    <span className="plan-selection-card-price">
                      {plan.price}
                    </span>
                    <span className="plan-selection-card-period">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <div className="plan-selection-card-features">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="plan-selection-feature-item">
                      <CheckCircle
                        size={20}
                        className="plan-selection-feature-icon"
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="plan-selection-card-selector">
                  <div
                    className={`plan-selection-radio ${
                      isSelected ? "selected" : ""
                    }`}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="plan-selection-activation"
          >
            <div className="plan-selection-activation-header">
              <h3 className="plan-selection-activation-title">
                Ready to Get Started?
              </h3>
              <p className="plan-selection-activation-subtitle">
                You've selected the <strong>{selectedPlanData?.name}</strong>{" "}
                plan
              </p>
            </div>

            <div className="plan-selection-activation-actions">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleActivatePlan}
                disabled={loading}
                className="plan-selection-activate-btn btn-primary"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Activating Plan...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    {selectedPlan === "free" ? "Activate" : "Subscribe to"}{" "}
                    {selectedPlanData?.name} Plan
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/dashboard")}
                className="plan-selection-skip-btn btn-outline"
              >
                <Clock size={20} />
                Skip for Now
              </motion.button>
            </div>

            <div className="plan-selection-security">
              <p className="plan-selection-security-text">
                <Shield size={16} />
                Secure payment processing • Cancel anytime
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlanSelectionPage;
