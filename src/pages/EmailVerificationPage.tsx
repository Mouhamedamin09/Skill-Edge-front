import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Mail,
  Clock,
} from "lucide-react";
import { authAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const EmailVerificationPage: React.FC = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { email, message, selectedPlan, fromPricing } = location.state || {};
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    } else {
      // Auto-focus the input when component mounts
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // Start initial cooldown
      setResendCooldown(60);
      setTimeLeft(60);
    }
  }, [email, navigate]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.verifyEmail(email, code);
      setSuccess(true);

      // Automatically log in the user
      if (response.user) {
        setUser(response.user);
        // Store token if provided
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
      }

      setTimeout(() => {
        // After any successful signup verification, always go to plan selection
        navigate("/plan-selection", {
          state: { selectedPlan: selectedPlan || "free" },
        });
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || timeLeft > 0) return;

    setResendLoading(true);
    setResendMessage("");
    setError("");

    try {
      await authAPI.resendVerification(email);
      setResendMessage("Verification code sent! Check your email.");
      setResendCooldown(60);
      setTimeLeft(60);
    } catch (err: any) {
      setResendMessage(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="auth-card success"
          >
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h1 className="auth-title">Email Verified!</h1>
            <p className="auth-subtitle">
              Your email has been successfully verified.{" "}
              {fromPricing && selectedPlan
                ? "Redirecting to plan selection..."
                : "Redirecting to dashboard..."}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="auth-card"
        >
          <div className="auth-header">
            <div className="verification-icon">
              <Mail size={48} />
            </div>
            <h1 className="auth-title">Verify Your Email</h1>
            <p className="auth-subtitle">
              {message ||
                "We've sent a verification code to your email address"}
            </p>
            {email && (
              <div className="email-address">
                <Mail size={16} />
                <strong>{email}</strong>
              </div>
            )}
          </div>

          <form onSubmit={handleVerify} className="auth-form">
            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input
                ref={inputRef}
                type="text"
                id="code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(value);
                  setError("");
                }}
                placeholder="000000"
                maxLength={6}
                className="code-input"
                autoComplete="one-time-code"
              />
              <div className="code-hint">
                Enter the 6-digit code sent to your email
              </div>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              className="auth-button"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Verifying..." : "Verify Email"}
              <ArrowRight size={20} />
            </motion.button>
          </form>

          <div className="verification-footer">
            <p>Didn't receive the code?</p>
            <motion.button
              onClick={handleResend}
              disabled={resendLoading || timeLeft > 0}
              className="resend-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {resendLoading ? (
                <>
                  <RefreshCw size={16} className="spinning" />
                  Sending...
                </>
              ) : timeLeft > 0 ? (
                <>
                  <Clock size={16} />
                  Resend in {formatTime(timeLeft)}
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Resend Code
                </>
              )}
            </motion.button>
            {resendMessage && (
              <div
                className={`resend-message ${
                  resendMessage.includes("sent") ? "success" : "error"
                }`}
              >
                {resendMessage}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
