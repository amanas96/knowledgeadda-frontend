// utils/quizStorage.js

const QUIZ_KEY = (quizId) => `quiz_progress_${quizId}`;
const PENDING_KEY = "quiz_pending_submissions";

// ── Save progress ────────────────────────────────────────────────────────
export const saveProgress = (quizId, data) => {
  try {
    localStorage.setItem(
      QUIZ_KEY(quizId),
      JSON.stringify({
        ...data,
        savedAt: Date.now(),
      }),
    );
  } catch (err) {
    console.error("Failed to save progress", err);
  }
};

// ── Load progress ────────────────────────────────────────────────────────
export const loadProgress = (quizId) => {
  try {
    const data = localStorage.getItem(QUIZ_KEY(quizId));
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// ── Clear progress ───────────────────────────────────────────────────────
export const clearProgress = (quizId) => {
  localStorage.removeItem(QUIZ_KEY(quizId));
};

// ── Save pending submission (network failed) ─────────────────────────────
export const savePendingSubmission = (quizId, payload) => {
  try {
    const pending = getPendingSubmissions();
    pending[quizId] = { ...payload, savedAt: Date.now() };
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch (err) {
    console.error("Failed to save pending submission", err);
  }
};

// ── Get all pending submissions ──────────────────────────────────────────
export const getPendingSubmissions = () => {
  try {
    const data = localStorage.getItem(PENDING_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// ── Remove pending submission ────────────────────────────────────────────
export const removePendingSubmission = (quizId) => {
  try {
    const pending = getPendingSubmissions();
    delete pending[quizId];
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch (err) {
    console.error("Failed to remove pending submission", err);
  }
};
