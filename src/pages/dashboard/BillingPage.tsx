// Force rebuild - test plan removed
import React, { useState, useEffect } from "react";
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
  Loader2,
  QrCode,
  Banknote,
  Monitor,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../../services/api";
import { QRCodeSVG } from "qrcode.react";

const BillingPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentLinkUrl, setPaymentLinkUrl] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    // Check for success or cancel from Stripe Checkout
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const canceled = searchParams.get("canceled");

    if (success && sessionId) {
      // Verify and activate subscription
      const verifySession = async () => {
        setVerifyingPayment(true);
        try {
          const response = await fetch(
            `${API_BASE_URL}/stripe/verify-session`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ sessionId }),
            }
          );

          const data = await response.json();

          if (response.ok && data.success) {
            setSuccessMessage(
              "Payment successful! Your subscription is now active."
            );

            // Fetch updated user data
            try {
              const userResponse = await authAPI.getUser();
              setUser(userResponse.user);
            } catch (err) {
              console.error("Failed to refresh user data:", err);
            }

            // Clear URL parameters after updating
            setTimeout(() => {
              navigate("/dashboard/billing", { replace: true });
              setVerifyingPayment(false);
            }, 1500);
          } else {
            setErrorMessage(
              data.error ||
                "Failed to activate subscription. Please contact support."
            );
            setVerifyingPayment(false);
            setTimeout(() => {
              navigate("/dashboard/billing", { replace: true });
            }, 3000);
          }
        } catch (error) {
          console.error("Session verification error:", error);
          setErrorMessage("Failed to verify payment. Please contact support.");
          setVerifyingPayment(false);
          setTimeout(() => {
            navigate("/dashboard/billing", { replace: true });
          }, 3000);
        }
      };

      verifySession();
    } else if (canceled) {
      setErrorMessage(
        "Payment was canceled. Please try again if you'd like to upgrade."
      );
      setTimeout(() => {
        navigate("/dashboard/billing", { replace: true });
      }, 3000);
    }
  }, [searchParams, navigate, API_BASE_URL, setUser]);

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
        "5 minutes per month",
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
        "90 minutes per month",
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

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return; // Can't "upgrade" to free

    try {
      setLoading(planId);
      setErrorMessage("");

      const response = await fetch(
        `${API_BASE_URL}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ planId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setErrorMessage(error.message || "Failed to start checkout process");
      setLoading(null);
    }
  };

  const handleCashPayment = async (planId: string) => {
    if (planId === "free") return;

    try {
      setLoading(planId);
      setErrorMessage("");

      const response = await fetch(
        `${API_BASE_URL}/stripe/create-payment-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ planId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment link");
      }

      // Show QR code modal
      if (data.url) {
        setPaymentLinkUrl(data.url);
        setShowQRCode(true);
      }
    } catch (error: any) {
      console.error("Payment link error:", error);
      setErrorMessage(error.message || "Failed to generate payment QR code");
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      setPortalLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_BASE_URL}/stripe/create-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session");
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Portal error:", error);
      setErrorMessage(error.message || "Failed to open billing portal");
      setPortalLoading(false);
    }
  };

  return (
    <div className="billing-page">
      {/* Loading Overlay */}
      {verifyingPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            gap: "1.5rem",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={56} style={{ color: "#6366f1" }} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              color: "#fff",
              fontSize: "1.25rem",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Activating your subscription...
          </motion.p>
        </motion.div>
      )}

      {/* QR Code Modal - Clean Design */}
      {showQRCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowQRCode(false)}
          className="qr-modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="qr-modal-content"
          >
            <div className="qr-modal-header">
              <QrCode size={32} className="qr-icon" />
              <h2>Show QR Code at Store</h2>
              <p>The store owner will scan and pay</p>
            </div>

            <div className="qr-code-container">
              <QRCodeSVG
                value={paymentLinkUrl}
                size={240}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="qr-instructions">
              <strong>How it works:</strong>
              <ol>
                <li>Show this QR code at any store owner</li>
                <li>Store owner scans with their phone</li>
                <li>They pay → Your plan activates instantly!</li>
              </ol>
            </div>

            <div className="qr-modal-actions">
              <button
                onClick={() => window.open(paymentLinkUrl, "_blank")}
                className="btn-primary"
              >
                Open Link
              </button>
              <button
                onClick={() => setShowQRCode(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

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

      {/* Success/Error Messages */}
      {successMessage && !verifyingPayment && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="message success"
          style={{ marginBottom: "2rem", padding: "1rem", borderRadius: "8px" }}
        >
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {errorMessage && !verifyingPayment && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="message error"
          style={{ marginBottom: "2rem", padding: "1rem", borderRadius: "8px" }}
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Current Plan Section */}
      {currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="current-plan-section"
        >
          <div className="current-plan-card">
            <div
              className="card-icon"
              style={{ backgroundColor: currentPlan.bgColor }}
            >
              {React.createElement(currentPlan.icon, {
                size: 32,
                color: currentPlan.color,
              })}
            </div>
            <div className="card-content">
              <div className="plan-info">
                <h3>{currentPlan.name} Plan</h3>
                <p>{currentPlan.description}</p>
              </div>
              <div className="plan-stats">
                {user.subscription.plan !== "free" &&
                  daysUntilBilling !== null && (
                    <div className="stat-item">
                      <Calendar size={20} />
                      <div className="stat-content">
                        <span className="stat-label">Next Billing</span>
                        <span className="stat-value">
                          {daysUntilBilling} days
                        </span>
                      </div>
                    </div>
                  )}
                <div className="stat-item">
                  <TrendingUp size={20} />
                  <div className="stat-content">
                    <span className="stat-label">Minutes Used</span>
                    <span className="stat-value">
                      {user.usage.totalMinutesUsed || 0} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Desktop App Promotion - Only for Pro/Pro+ users */}
      {(user.subscription.plan === "pro" ||
        user.subscription.plan === "pro+") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="desktop-app-promotion"
        >
          <div className="promotion-card">
            <div className="promotion-content">
              <div className="promotion-icon">
                <Monitor size={32} />
              </div>
              <div className="promotion-text">
                <h3>SkillEdge Desktop App</h3>
                <p>
                  Download our undetectable desktop application for seamless AI
                  assistance during screen sharing interviews.
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard/desktop")}
                className="promotion-button"
              >
                Download Now
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Method Selector - Clean Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="payment-method-section"
      >
        <h3 className="payment-method-title">Payment Method</h3>
        <div className="payment-method-options">
          <label
            className={`payment-option ${
              paymentMethod === "card" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            <div className="payment-option-content">
              <CreditCard size={20} />
              <span>Credit / Debit Card</span>
            </div>
          </label>
          <label
            className={`payment-option ${
              paymentMethod === "cash" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            <div className="payment-option-content">
              <Banknote size={20} />
              <span>Cash (QR Code)</span>
            </div>
          </label>
        </div>
        {paymentMethod === "cash" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="payment-info-box"
          >
            <p>
              <strong>💡 How it works:</strong> Get a QR code, show it to any
              store owner (tabacchi, edicola), they scan and pay. Your
              subscription activates instantly!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Plans Grid */}
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
                  {plan.current && plan.id !== "pro" ? (
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
                      onClick={() => {
                        if (paymentMethod === "card") {
                          handleUpgrade(plan.id);
                        } else {
                          handleCashPayment(plan.id);
                        }
                      }}
                      disabled={loading !== null || plan.id === "free"}
                    >
                      {loading === plan.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          {plan.id === "free"
                            ? "Free Plan"
                            : plan.current && plan.id === "pro"
                            ? "Add 90 More Minutes"
                            : `Upgrade to ${plan.name}`}
                          {plan.id !== "free" && <ArrowRight size={16} />}
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Billing Information */}
      {user.subscription.plan !== "free" && (
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
                Your subscription is managed securely through Stripe. You can
                update your billing information, payment methods, view invoices,
                and manage your subscription at any time.
              </p>
              <div className="info-actions">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      <span>Manage Billing</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BillingPage;
