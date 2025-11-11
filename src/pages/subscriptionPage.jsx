import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Crown, BookOpen } from "lucide-react";

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user, updateSubscriptionStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isSubscribed) {
      navigate("/courses");
      return;
    }

    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const { data } = await apiClient.get("/api/v1/subscriptions");
        setPlans(data);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load subscription plans.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [user, navigate]);

  const handleSubscribe = async (planId) => {
    setIsProcessing(planId);
    setError(null);
    try {
      const { data } = await apiClient.post(
        "/api/v1/subscriptions/mock-verify",
        {
          planId,
          mockPaymentId: `mock_pay_${Date.now()}`,
        }
      );

      if (data.subscription?.status === "active") {
        updateSubscriptionStatus(true);
        setIsSuccess(true);
        toast.success("Subscription activated successfully!");
        setTimeout(() => navigate("/courses"), 3000);
      } else {
        throw new Error("Subscription verification failed.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "An error occurred during subscription. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-xl text-gray-400">
        Loading plans...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-20 text-xl text-red-500">{error}</div>
    );
  if (isSuccess) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-[80vh] text-center text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            "linear-gradient(to bottom right, #0f172a, #1e293b, #0d9488)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="bg-green-500/20 rounded-full p-6 mb-6"
        >
          <CheckCircle className="text-green-400 w-20 h-20" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Subscription Activated!</h1>
        <p className="text-gray-300 mb-4">
          You now have full access to all premium content
        </p>
        <p className="text-sm text-gray-400">Redirecting to your profile...</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen   text-white py-16 px-6">
      {/* bg-gradient-to-b from-[#0f172a] to-[#1e293b] */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center ] mb-16"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-500">
          Unlock Your Full Learning Potential 🚀
        </h1>
        <p className="text-lg text-gray-900 max-w-2xl mx-auto">
          Choose the perfect plan to accelerate your UPSC preparation. Get
          access to premium video lectures, daily current affairs, test series,
          and personalized analytics — all designed by top educators.
        </p>
      </motion.div>

      {/* Plans */}
      <div className="flex flex-wrap justify-center gap-8">
        {plans.length > 0 ? (
          plans.map((plan, idx) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative w-full md:w-[320px] bg-[#1e293b] rounded-2xl shadow-lg border border-gray-700 p-8 hover:border-blue-400 transition-all duration-300 ${
                plan.popular ? "ring-2 ring-blue-400" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-xs uppercase font-bold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
                {plan.name}{" "}
                {plan.name.toLowerCase().includes("pro") && (
                  <Crown className="text-yellow-400" size={22} />
                )}
              </h2>

              <p className="text-5xl font-bold mb-6 text-blue-400">
                ₹{plan.price}
                <span className="text-lg text-gray-400 font-medium">
                  {" "}
                  / {plan.durationInDays} days
                </span>
              </p>

              <ul className="text-left mb-8 space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Access to all premium courses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Full Test Series Library
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Daily Current Affairs & Analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Downloadable Notes & PDFs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Personalized Progress Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  24×7 Doubt Support via Chat
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe(plan._id)}
                disabled={isProcessing === plan._id}
                className={`w-full py-3 rounded-lg font-semibold text-white text-lg transition-all duration-300 ${
                  isProcessing === plan._id
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-emerald-500 hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                {isProcessing === plan._id ? "Processing..." : "Subscribe Now"}
              </button>

              <div className="mt-6 text-sm text-gray-400 text-center">
                <BookOpen className="inline mr-1 text-blue-400" size={16} />
                Start learning smarter today!
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No subscription plans available right now.
          </p>
        )}
      </div>

      {/* Trust & Feature Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-5xl mx-auto mt-24 grid md:grid-cols-3 gap-8 text-center"
      >
        <div className="bg-[#1e293b] p-6 rounded-xl shadow border border-gray-700">
          <Star className="mx-auto text-yellow-400 mb-3" size={28} />
          <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
          <p className="text-gray-400 text-sm">
            Learn directly from India’s top UPSC mentors with years of
            experience guiding successful aspirants.
          </p>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-xl shadow border border-gray-700">
          <Crown className="mx-auto text-emerald-400 mb-3" size={28} />
          <h3 className="text-xl font-semibold mb-2">All-Inclusive Content</h3>
          <p className="text-gray-400 text-sm">
            Unlimited access to live lectures, topic-wise tests, and
            downloadable notes designed for full syllabus mastery.
          </p>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-xl shadow border border-gray-700">
          <BookOpen className="mx-auto text-blue-400 mb-3" size={28} />
          <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
          <p className="text-gray-400 text-sm">
            Track your performance and identify strengths and weaknesses with
            our AI-powered dashboard.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionPage;
