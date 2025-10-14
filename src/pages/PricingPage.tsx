import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Crown,
  Zap,
  Clock,
  ArrowRight,
  Star,
  Users,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (planId: string) => {
    // Navigate to signup with the selected plan ID
    navigate("/signup", {
      state: {
        selectedPlan: planId,
        fromPricing: true,
      },
    });
  };

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
        "Basic analytics",
      ],
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
        "Advanced analytics",
        "Custom preferences",
        "Export transcripts",
      ],
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
        "API access",
      ],
      popular: false,
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Real-time AI Assistance",
      description: "Get instant, intelligent responses during your interviews",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance for your data",
    },
    {
      icon: Star,
      title: "Proven Results",
      description: "Join thousands who've improved their interview success",
    },
  ];

  return (
    <div className="pricing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="hero-title">Simple, Transparent Pricing</h1>
            <p className="hero-subtitle">
              Choose the plan that fits your interview preparation needs. No
              hidden fees, cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pricing-plans">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`plan-card ${plan.popular ? "popular" : ""}`}
                >
                  {plan.popular && (
                    <div className="popular-badge">Most Popular</div>
                  )}

                  <div className="plan-header">
                    <div
                      className="plan-icon"
                      style={{
                        backgroundColor: plan.bgColor,
                        color: plan.color,
                      }}
                    >
                      <Icon size={32} />
                    </div>
                    <h3 className="plan-name">{plan.name}</h3>
                    <p className="plan-description">{plan.description}</p>
                  </div>

                  <div className="plan-pricing">
                    <div className="price">
                      <span className="amount">{plan.price}</span>
                      <span className="period">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="plan-features">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="feature-item">
                        <CheckCircle size={16} className="feature-icon" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`plan-button ${
                      plan.popular ? "primary" : "secondary"
                    }`}
                  >
                    {plan.id === "free"
                      ? "Get Started Free"
                      : `Choose ${plan.name}`}
                    <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pricing-features">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="section-header"
          >
            <h2 className="section-title">Why Choose SkillEdge?</h2>
            <p className="section-subtitle">
              Powerful features designed to help you succeed in any interview
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="feature-card"
                >
                  <div className="feature-icon">
                    <Icon size={32} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-faq">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="section-header"
          >
            <h2 className="section-title">Frequently Asked Questions</h2>
          </motion.div>

          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I change my plan anytime?</h4>
              <p>
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>
            <div className="faq-item">
              <h4>Is there a free trial?</h4>
              <p>
                Yes, our Free plan gives you 15 minutes per month to try out all
                features.
              </p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>
                We accept all major credit cards, PayPal, and bank transfers for
                annual plans.
              </p>
            </div>
            <div className="faq-item">
              <h4>Can I cancel anytime?</h4>
              <p>
                Absolutely. You can cancel your subscription at any time with no
                cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
