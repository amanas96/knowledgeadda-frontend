import React, { useState, useEffect, useCallback } from "react";
import {
  getSubscriptionPlans,
  createSubscriptionOrder,
  verifyPayment,
} from "../../api/subscriptionApi";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Crown,
  BookOpen,
  Star,
  Shield,
  Zap,
  ArrowLeft,
  Loader2,
  CreditCard,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react";

/* ============================================================
   Load Razorpay checkout SDK on demand
============================================================ */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/* ============================================================
   Step indicator
============================================================ */
const STEPS = ["Choose Plan", "Review Order", "Done"];

const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-12">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
                done
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : active
                    ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.6)]"
                    : "bg-[#0f172a] border-gray-700 text-gray-500"
              }`}
            >
              {done ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span
              className={`mt-2 text-xs font-medium tracking-wide ${
                active
                  ? "text-blue-400"
                  : done
                    ? "text-emerald-400"
                    : "text-gray-600"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-20 h-[2px] mx-1 mb-5 transition-all duration-500 ${
                i < current ? "bg-emerald-500" : "bg-gray-700"
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ============================================================
   STEP 1 — Plans
============================================================ */
const PLAN_FEATURES = [
  "All premium video lectures",
  "Full test series library",
  "Daily current affairs",
  "Downloadable notes & PDFs",
  "Personalised progress dashboard",
  "24×7 doubt support",
];

const PlansStep = ({ plans, onSelect, isAdmin }) => (
  <motion.div
    key="plans"
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.35 }}
  >
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
        Unlock Premium Access
      </h1>
      <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
        One subscription. Every course, every test, every note — designed to
        take you from aspirant to officer.
      </p>
    </div>

    <div className="flex flex-wrap justify-center gap-6">
      {plans.map((plan, idx) => (
        <motion.div
          key={plan._id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`relative w-full md:w-[300px] rounded-2xl border p-7 flex flex-col transition-all duration-300 cursor-pointer
            ${
              plan.popular
                ? "bg-gradient-to-b from-[#1a2744] to-[#0f172a] border-blue-500/60 shadow-[0_0_32px_rgba(59,130,246,0.2)]"
                : "bg-[#111827] border-gray-800 hover:border-gray-600"
            }`}
          onClick={() => !isAdmin && onSelect(plan)}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg tracking-wider uppercase">
              Most Popular
            </div>
          )}

          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">{plan.name}</h2>
            {plan.name.toLowerCase().includes("pro") && (
              <Crown size={18} className="text-yellow-400" />
            )}
          </div>

          <div className="mt-3 mb-6">
            <span className="text-4xl font-extrabold text-white">
              ₹{plan.price}
            </span>
            <span className="text-gray-500 text-sm ml-2">
              / {plan.durationInDays} days
            </span>
          </div>

          <ul className="space-y-2.5 mb-8 flex-1">
            {PLAN_FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 text-sm text-gray-400"
              >
                <CheckCircle2
                  size={15}
                  className="text-emerald-400 mt-0.5 shrink-0"
                />
                {f}
              </li>
            ))}
          </ul>

          <button
            disabled={isAdmin}
            className={`w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2
              ${
                isAdmin
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : plan.popular
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-[1.02]"
                    : "bg-[#1e293b] text-white border border-gray-700 hover:border-blue-500 hover:bg-[#1a2744]"
              }`}
          >
            {isAdmin ? "Admin Access" : "Get Started"}
            {!isAdmin && <ChevronRight size={16} />}
          </button>

          {isAdmin && (
            <p className="mt-2 text-xs text-amber-400 text-center">
              Admins have full access
            </p>
          )}
        </motion.div>
      ))}
    </div>

    {/* Trust row */}
    <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
      {[
        {
          icon: <Shield size={20} />,
          label: "Secure Payment",
          sub: "256-bit SSL",
        },
        {
          icon: <Zap size={20} />,
          label: "Instant Access",
          sub: "Active in seconds",
        },
        {
          icon: <Star size={20} />,
          label: "Top Educators",
          sub: "UPSC specialists",
        },
      ].map(({ icon, label, sub }) => (
        <div key={label} className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#1e293b] border border-gray-700 text-blue-400 mb-2">
            {icon}
          </div>
          <p className="text-white text-xs font-semibold">{label}</p>
          <p className="text-gray-600 text-xs">{sub}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ============================================================
   STEP 2 — Checkout / Order review
============================================================ */
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-gray-500">
      {icon}
      {label}
    </div>
    <span className="text-white font-medium">{value}</span>
  </div>
);

const CheckoutStep = ({ plan, user, onBack, onPay, isProcessing }) => {
  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(today.getDate() + plan.durationInDays);

  const fmt = (d) =>
    d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <motion.div
      key="checkout"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35 }}
      className="max-w-lg mx-auto"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to plans
      </button>

      <h2 className="text-2xl font-bold text-white mb-8">Review your order</h2>

      {/* Order summary card */}
      <div className="rounded-2xl border border-gray-800 bg-[#111827] overflow-hidden mb-6">
        {/* Plan header */}
        <div className="bg-gradient-to-r from-blue-900/60 to-cyan-900/30 px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">
              Selected Plan
            </p>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {plan.name}
              {plan.name.toLowerCase().includes("pro") && (
                <Crown size={18} className="text-yellow-400" />
              )}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-white">₹{plan.price}</p>
            <p className="text-xs text-gray-500">one-time payment</p>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-4">
          <DetailRow
            icon={<Calendar size={15} className="text-blue-400" />}
            label="Access period"
            value={`${plan.durationInDays} days`}
          />
          <DetailRow
            icon={<Calendar size={15} className="text-blue-400" />}
            label="Valid from"
            value={fmt(today)}
          />
          <DetailRow
            icon={<Calendar size={15} className="text-blue-400" />}
            label="Expires on"
            value={fmt(expiry)}
          />
          <DetailRow
            icon={<User size={15} className="text-blue-400" />}
            label="Account"
            value={user?.email || "—"}
          />
        </div>

        {/* Features included */}
        <div className="px-6 pb-5">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">
            Includes
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PLAN_FEATURES.map((f) => (
              <div
                key={f}
                className="flex items-center gap-1.5 text-xs text-gray-400"
              >
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-800 px-6 py-4 flex items-center justify-between">
          <span className="text-gray-400 text-sm font-medium">
            Total due today
          </span>
          <span className="text-white text-xl font-extrabold">
            ₹{plan.price}
          </span>
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={() => {
          console.log("BUTTON CLICKED");
          onPay();
        }}
        disabled={isProcessing}
        className="w-full py-4 rounded-2xl font-bold text-white text-base tracking-wide bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_0_28px_rgba(59,130,246,0.5)] hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Opening payment...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Pay ₹{plan.price} securely
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-1.5">
        <Shield size={12} />
        Secured by Razorpay · SSL encrypted
      </p>
    </motion.div>
  );
};

/* ============================================================
   STEP 3 — Success
============================================================ */
const SuccessStep = ({ plan }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) return;
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center justify-center text-center py-10 max-w-md mx-auto"
    >
      {/* Animated rings */}
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
          className="w-28 h-28 rounded-full bg-emerald-500/20 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 180 }}
            className="w-20 h-20 rounded-full bg-emerald-500/30 flex items-center justify-center"
          >
            <CheckCircle2 size={48} className="text-emerald-400" />
          </motion.div>
        </motion.div>

        {/* Sparkle dots */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.div
            key={deg}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ delay: 0.4 + deg / 1800, duration: 0.8 }}
            className="absolute w-2 h-2 rounded-full bg-emerald-400"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-52px)`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-3xl font-extrabold text-white mb-3">
          You're all set! 🎉
        </h2>
        <p className="text-gray-400 mb-2 leading-relaxed">
          <span className="text-emerald-400 font-semibold">{plan?.name}</span>{" "}
          is now active on your account.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Full access unlocked for {plan?.durationInDays} days.
        </p>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Loader2 size={14} className="animate-spin text-blue-400" />
          Redirecting to courses in{" "}
          <span className="text-blue-400 font-bold tabular-nums">{count}s</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   Root — orchestrates all 3 steps
============================================================ */
const SubscriptionPage = () => {
  const [step, setStep] = useState(0); // 0: plans, 1: checkout, 2: success
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { user, updateSubscriptionStatus } = useAuth();
  const navigate = useNavigate();

  // Redirect already-subscribed users
  useEffect(() => {
    if (user?.isSubscribed) navigate("/courses");
  }, [user, navigate]);

  // Fetch plans
  useEffect(() => {
    getSubscriptionPlans()
      .then((plans) => {
        console.log("PLANS:", plans);
        setPlans(plans);
      })
      .catch((err) =>
        setFetchError(
          err.response?.plans?.message || "Failed to load subscription plans.",
        ),
      )
      .finally(() => setIsLoading(false));
  }, []);

  // Redirect after success
  useEffect(() => {
    if (step !== 2) return;
    const t = setTimeout(() => navigate("/courses"), 3000);
    return () => clearTimeout(t);
  }, [step, navigate]);

  /* ── Select a plan ──────────────────────────────────────────────────────── */
  const handleSelectPlan = useCallback((plan) => {
    setSelectedPlan(plan);
    setStep(1);
  }, []);

  /* ── Pay ────────────────────────────────────────────────────────────────── */
  const handlePay = useCallback(async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded)
        throw new Error(
          "Failed to load payment gateway. Check your connection.",
        );

      // 2. Create order on backend
      const { data: orderData } = await createSubscriptionOrder(
        selectedPlan._id,
      );
      console.log("ORDER DATA", orderData);

      // 3. Open Razorpay widget
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          name: "KnowledgeAdda",
          description: `${selectedPlan.name} — ${selectedPlan.durationInDays} days`,
          theme: { color: "#2563eb" },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          handler: async (response) => {
            try {
              // 4. Verify signature on backend
              const { data: verifyData } = await verifyPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
                selectedPlan._id,
              );

              if (verifyData.subscription?.status === "active") {
                updateSubscriptionStatus(true);
                setStep(2);
                resolve();
              } else {
                reject(new Error("Subscription verification failed."));
              }
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () =>
              reject(new Error("Payment cancelled. You can try again.")),
          },
        });

        rzp.on("payment.failed", (r) =>
          reject(
            new Error(r.error?.description || "Payment failed. Please retry."),
          ),
        );

        rzp.open();
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Something went wrong.";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPlan, user, updateSubscriptionStatus]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3 text-gray-500">
        <Loader2 size={32} className="animate-spin text-blue-500" />
        <span className="text-sm">Loading plans...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-center">
        <p className="text-red-400 text-lg">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-[#1e293b] text-white text-sm hover:bg-[#273549] transition"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white py-14 px-6">
      <div className="max-w-5xl mx-auto">
        {step < 2 && <StepBar current={step} />}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <PlansStep
              key="plans"
              plans={plans}
              onSelect={handleSelectPlan}
              isAdmin={!!user?.isAdmin}
            />
          )}
          {step === 1 && selectedPlan && (
            <CheckoutStep
              key="checkout"
              plan={selectedPlan}
              user={user}
              onBack={() => setStep(0)}
              onPay={handlePay}
              isProcessing={isProcessing}
            />
          )}
          {step === 2 && <SuccessStep key="success" plan={selectedPlan} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubscriptionPage;
