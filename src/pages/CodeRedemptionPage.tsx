import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Zap,
  Crown,
} from "lucide-react";

const CodeRedemptionPage: React.FC = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPlan = location.state?.selectedPlan;

  useEffect(() => {
    if (!selectedPlan) {
      navigate("/pricing");
    }
  }, [selectedPlan, navigate]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCode(value);
    setError("");
    setSuccess("");
    setValidationResult(null);
  };

  const validateCode = async () => {
    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(
        `${API_BASE_URL}/subscription-codes/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: code.trim() }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setValidationResult(data);
        setSuccess("Code is valid! Click 'Activate Plan' to proceed.");
      } else {
        setError(data.error || "Invalid code");
        setValidationResult(null);
      }
    } catch (error) {
      setError("Network error. Please try again.");
      setValidationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const redeemCode = async () => {
    if (!validationResult) {
      setError("Please validate the code first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(
        `${API_BASE_URL}/subscription-codes/redeem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ code: code.trim() }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Plan activated successfully!");

        // Update user context
        if (data.user) {
          setUser(data.user);
        }

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard", {
            state: {
              planActivated: true,
              selectedPlan: data.planType,
              message: `Welcome to SkillEdge! Your ${data.planType.toUpperCase()} plan has been activated.`,
            },
          });
        }, 2000);
      } else {
        setError(data.error || "Failed to activate plan");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPlanInfo = (planType: string) => {
    switch (planType) {
      case "pro":
        return {
          name: "Pro Plan",
          icon: Zap,
          color: "var(--primary-500)",
          bgColor: "var(--primary-50)",
          features: [
            "3 hours/month",
            "GPT-4 responses",
            "Priority support",
            "Analytics",
          ],
        };
      case "pro+":
        return {
          name: "Pro+ Plan",
          icon: Crown,
          color: "var(--accent-500)",
          bgColor: "var(--accent-50)",
          features: [
            "Unlimited usage",
            "GPT-4 Turbo",
            "24/7 support",
            "All features",
          ],
        };
      default:
        return {
          name: "Plan",
          icon: CreditCard,
          color: "var(--secondary-500)",
          bgColor: "var(--secondary-50)",
          features: [],
        };
    }
  };

  const planInfo = validationResult
    ? getPlanInfo(validationResult.planType)
    : null;

  return (
    <div className="code-redemption-page">
      <div className="code-redemption-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="code-redemption-card"
        >
          <div className="code-redemption-header">
            <div className="header-icon">
              <CreditCard size={32} />
            </div>
            <h1 className="header-title">Activate Your Plan</h1>
            <p className="header-subtitle">
              Enter your subscription code to activate your{" "}
              {selectedPlan?.toUpperCase()} plan
            </p>
          </div>

          <div className="code-redemption-form">
            <div className="form-group">
              <label htmlFor="code" className="form-label">
                Subscription Code
              </label>
              <div className="code-input-container">
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="Enter your code (e.g., SKP-1234-5678)"
                  className={`code-input ${error ? "error" : ""} ${
                    success ? "success" : ""
                  }`}
                  maxLength={14}
                />
                <button
                  type="button"
                  onClick={validateCode}
                  disabled={!code.trim() || loading}
                  className="validate-btn"
                >
                  {loading ? "Validating..." : "Validate"}
                </button>
              </div>
              <p className="form-hint">
                Code format: SKP-XXXX-XXXX (Pro) or SKPP-XXXX-XXXX (Pro+)
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                <XCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="success-message"
              >
                <CheckCircle size={20} />
                <span>{success}</span>
              </motion.div>
            )}

            {validationResult && planInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="plan-preview"
              >
                <div className="plan-preview-header">
                  <div
                    className="plan-icon"
                    style={{
                      backgroundColor: planInfo.bgColor,
                      color: planInfo.color,
                    }}
                  >
                    <planInfo.icon size={24} />
                  </div>
                  <div className="plan-details">
                    <h3 className="plan-name">{planInfo.name}</h3>
                    <p className="plan-expiry">
                      Expires:{" "}
                      {new Date(
                        validationResult.expiresAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="plan-features">
                  {planInfo.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <CheckCircle size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="form-actions">
              <button
                onClick={redeemCode}
                disabled={!validationResult || loading}
                className="activate-btn"
              >
                {loading ? "Activating..." : "Activate Plan"}
              </button>
              <button onClick={() => navigate("/pricing")} className="back-btn">
                Back to Pricing
              </button>
            </div>
          </div>

          <div className="code-redemption-footer">
            <div className="help-section">
              <h4>Need Help?</h4>
              <p>
                If you don't have a code, please contact us to purchase a
                subscription. Codes are valid for 30 days from generation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodeRedemptionPage;
