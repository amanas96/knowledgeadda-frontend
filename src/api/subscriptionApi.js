import apiClient from "./axios";

// ── Public ──────────────────────────────────────────────────

export const getSubscriptionPlans = async () => {
  const { data } = await apiClient.get("/api/v1/subscriptions/plans");
  return data;
};

// ── Protected ────────────────────────────────────────────────

export const createSubscriptionOrder = (planId) =>
  apiClient.post("/api/v1/subscriptions/create-order", { planId });

export const verifyPayment = (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  planId,
) =>
  apiClient.post("/api/v1/subscriptions/verify-payment", {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    planId,
  });

export const getMySubscription = () =>
  apiClient.get("/api/v1/subscriptions/my-subscription");

export const getMyTransactions = () =>
  apiClient.get("/api/v1/subscriptions/transactions");
