import React, { useEffect, useState, useCallback } from "react";
import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { getQuizQuestions, submitQuiz } from "../../api/quizApi";
import Timer from "../../components/Timer.jsx";
import {
  AlertCircle,
  CheckCircle,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Flag,
  Send,
  Menu,
  X,
} from "lucide-react";

// ─── LocalStorage Utilities ───────────────────────────────────────────────────
const QUIZ_KEY = (id) => `quiz_progress_${id}`;
const PENDING_KEY = "quiz_pending_submissions";

const saveProgress = (quizId, data) => {
  try {
    localStorage.setItem(
      QUIZ_KEY(quizId),
      JSON.stringify({ ...data, savedAt: Date.now() }),
    );
  } catch {}
};
const loadProgress = (quizId) => {
  try {
    const d = localStorage.getItem(QUIZ_KEY(quizId));
    return d ? JSON.parse(d) : null;
  } catch {
    return null;
  }
};
const clearProgress = (id) => {
  try {
    localStorage.removeItem(QUIZ_KEY(id));
  } catch {}
};

const getPendingSubmissions = () => {
  try {
    const d = localStorage.getItem(PENDING_KEY);
    return d ? JSON.parse(d) : {};
  } catch {
    return {};
  }
};
const savePendingSubmission = (quizId, payload) => {
  try {
    const p = getPendingSubmissions();
    p[quizId] = { ...payload, savedAt: Date.now() };
    localStorage.setItem(PENDING_KEY, JSON.stringify(p));
  } catch {}
};
const removePendingSubmission = (quizId) => {
  try {
    const p = getPendingSubmissions();
    delete p[quizId];
    localStorage.setItem(PENDING_KEY, JSON.stringify(p));
  } catch {}
};

// ─── Component ────────────────────────────────────────────────────────────────
const QuizStart = () => {
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRetry = searchParams.get("retry") === "true";

  // ── State ────────────────────────────────────────────────────────────────
  const [quizTitle, setQuizTitle] = useState("");
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizTimeLimit, setQuizTimeLimit] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [wasRestored, setWasRestored] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [markedReview, setMarkedReview] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const totalQuestions = questions.length;
  const answeredCount = answers.length;
  const currentQ = questions[currentIndex];

  // ── Override layout styles (remove padding from parent Layout) ────────────
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      main.style.padding = "0";
      main.style.overflow = "hidden";
      main.style.height = "calc(100vh - 64px)";
    }
    document.body.style.overflow = "hidden";

    return () => {
      if (main) {
        main.style.padding = "";
        main.style.overflow = "";
        main.style.height = "";
      }
      document.body.style.overflow = "";
    };
  }, []);

  // ── Fetch questions + restore ─────────────────────────────────────────────
  useEffect(() => {
    const fetchQ = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await getQuizQuestions(slug);
        const qs = res.data.questions || [];
        const qid = res.data.quizId;

        setQuestions(qs);
        setQuizTitle(res.data.quizTitle || "Quiz");
        setQuizTimeLimit(res.data.timeLimit || 0);
        setQuizId(qid);

        // Restore saved progress
        const saved = loadProgress(qid);
        if (saved?.answers?.length) {
          setAnswers(saved.answers);
          setWasRestored(true);
        }
        if (saved?.markedReview) {
          setMarkedReview(new Set(saved.markedReview));
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load quiz questions.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchQ();
  }, [slug]);

  // ── Auto-save on every answer change ─────────────────────────────────────
  useEffect(() => {
    if (!quizId || loading || totalQuestions === 0) return;
    saveProgress(quizId, {
      answers,
      slug,
      quizTitle,
      markedReview: [...markedReview],
    });
  }, [answers, markedReview, quizId]);

  // ── Block browser refresh/close only (NO pushState) ──────────────────────
  useEffect(() => {
    const onUnload = (e) => {
      if (!isBlocking && totalQuestions > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [isBlocking, totalQuestions]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAnswerChange = (questionId, option) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { questionId, userAnswer: option }];
    });
  };

  const toggleMarkReview = (qId) => {
    if (!qId) return;
    setMarkedReview((prev) => {
      const next = new Set(prev);
      next.has(qId) ? next.delete(qId) : next.add(qId);
      return next;
    });
  };

  const goTo = (i) =>
    setCurrentIndex(Math.max(0, Math.min(i, totalQuestions - 1)));
  const goNext = () => goTo(currentIndex + 1);
  const goPrev = () => goTo(currentIndex - 1);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (skipConfirm = false) => {
      if (submitLoading || !quizId) return;

      // Confirm if unanswered questions
      const unanswered = totalQuestions - answers.length;
      if (!skipConfirm && unanswered > 0) {
        const ok = window.confirm(
          `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Submit anyway?`,
        );
        if (!ok) return;
      }

      try {
        setSubmitLoading(true);
        setError(null);
        setNetworkError(false);

        const res = await submitQuiz(quizId, answers);

        // Clean up storage
        clearProgress(quizId);
        removePendingSubmission(quizId);
        localStorage.removeItem(`quiz_timer_${quizId}`);

        setIsBlocking(true);

        const attemptData = res.data.attempt
          ? { ...res.data.attempt, isRetry: false }
          : { ...res.data, isRetry: true };
        navigate(`/quiz/${slug}/result`, {
          state: { attempt: attemptData, isRetry, quizTitle },
          replace: true, // ✅ replaces /start — back button goes to /detail not /start
        });
      } catch (err) {
        if (!err.response) {
          // Network error — save to queue
          setNetworkError(true);
          savePendingSubmission(quizId, { quizId, answers, slug });
          setError(
            "No internet — answers saved, will auto-submit on reconnect.",
          );
        } else {
          setError(err.response?.data?.message || "Failed to submit quiz.");
        }
      } finally {
        setSubmitLoading(false);
      }
    },
    [quizId, slug, answers, navigate, submitLoading, totalQuestions],
  );

  // ── Question status for sidebar ───────────────────────────────────────────
  const getStatus = (q) => {
    const answered = answers.find((a) => a.questionId === q._id);
    const marked = markedReview.has(q._id);
    if (answered && marked) return "answered-marked";
    if (answered) return "answered";
    if (marked) return "marked";
    return "unattempted";
  };

  const statusStyle = {
    answered: "bg-blue-600 text-white border-blue-600",
    "answered-marked": "bg-purple-600 text-white border-purple-600",
    marked: "bg-orange-400 text-white border-orange-400",
    unattempted: "bg-white text-gray-500 border-gray-300 hover:border-blue-400",
  };

  // ── Error screen ──────────────────────────────────────────────────────────
  if (!loading && error && !networkError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center border border-gray-100">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Unable to Load Quiz
          </h2>
          <p className="text-gray-500 mb-6 text-sm">{error}</p>
          {error.toLowerCase().includes("already attempted") ? (
            <button
              onClick={() => navigate(`/quiz/${slug}/review`)}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Review Attempt
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // ─── Main Layout ──────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-100">
      {/* ── Top Navbar ───────────────────────────────────────────────────── */}
      <header
        className="flex-shrink-0 bg-[#1a2e4a] text-white flex items-center
        justify-between px-4 md:px-6 h-14 shadow-lg z-30"
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition flex-shrink-0"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-sm md:text-base font-semibold truncate">
            {quizTitle}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {quizTimeLimit > 0 && quizId && (
            <Timer
              duration={quizTimeLimit}
              onEnd={() => handleSubmit(true)} // skip confirm on timer end
              quizId={quizId}
            />
          )}
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitLoading || totalQuestions === 0}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400
              disabled:bg-gray-500 disabled:cursor-not-allowed
              text-white font-bold px-4 py-2 rounded-lg text-sm transition shadow-md"
          >
            <Send size={14} />
            {submitLoading ? "Submitting..." : "SUBMIT"}
          </button>
        </div>
      </header>

      {/* ── Banners ───────────────────────────────────────────────────────── */}
      {(isRetry || wasRestored || networkError) && (
        <div className="flex-shrink-0">
          {isRetry && (
            <div className="flex items-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-700">
              <AlertCircle size={13} className="flex-shrink-0" />
              Retry attempt — score will not be saved.
            </div>
          )}
          {wasRestored && (
            <div className="flex items-center gap-2 bg-blue-50 border-b border-blue-200 px-4 py-2 text-xs text-blue-700">
              <CheckCircle size={13} className="flex-shrink-0" />
              Previous answers restored. Continue where you left off.
              <button
                onClick={() => setWasRestored(false)}
                className="ml-auto hover:text-blue-900 font-bold"
              >
                ✕
              </button>
            </div>
          )}
          {networkError && (
            <div className="flex items-center gap-2 bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-700">
              <WifiOff size={13} className="flex-shrink-0" />
              No internet — answers saved locally.
              <button
                onClick={() => handleSubmit(true)}
                className="ml-auto bg-red-600 text-white px-2 py-0.5 rounded text-xs hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside
          className={`bg-white border-r border-gray-200 flex flex-col flex-shrink-0
          transition-all duration-300 overflow-hidden
          ${sidebarOpen ? "w-56 md:w-64" : "w-0"}`}
        >
          {/* Sidebar top */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Questions
            </p>
          </div>

          {/* Question grid */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, i) => {
                const status = getStatus(q);
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={q._id}
                    onClick={() => goTo(i)}
                    title={`Question ${i + 1}`}
                    className={`aspect-square rounded-full text-xs font-bold border-2 transition-all
                      ${statusStyle[status]}
                      ${
                        isCurrent
                          ? "ring-2 ring-offset-1 ring-blue-500 scale-110 shadow-md"
                          : "hover:scale-105"
                      }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="px-3 py-2 border-t border-gray-100 space-y-1.5 flex-shrink-0">
            {[
              { color: "bg-blue-600", label: `Answered (${answeredCount})` },
              {
                color: "bg-orange-400",
                label: `Marked (${markedReview.size})`,
              },
              { color: "bg-purple-600", label: "Answered + Marked" },
              {
                color: "bg-gray-200",
                label: `Unattempted (${totalQuestions - answeredCount})`,
              },
            ].map(({ color, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs text-gray-500"
              >
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`}
                />
                {label}
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: totalQuestions
                    ? `${(answeredCount / totalQuestions) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-center">
              {answeredCount} / {totalQuestions} answered
            </p>
          </div>
        </aside>

        {/* ── Main Question Panel ───────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable question area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-5">
            {currentQ ? (
              <div className="max-w-4xl mx-auto h-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                  {/* Question header */}
                  <div
                    className="bg-slate-50 border-b border-gray-200 px-6 py-3
                    flex items-center justify-between flex-shrink-0"
                  >
                    <span className="text-sm font-semibold text-gray-500">
                      Question{" "}
                      <span className="text-gray-800">{currentIndex + 1}</span>
                      <span className="text-gray-300 mx-1">/</span>
                      <span className="text-gray-400">{totalQuestions}</span>
                    </span>
                    <button
                      onClick={() => toggleMarkReview(currentQ._id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
                        rounded-lg border-2 transition-all
                        ${
                          markedReview.has(currentQ._id)
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-orange-500 border-orange-300 hover:bg-orange-50"
                        }`}
                    >
                      <Flag size={12} />
                      {markedReview.has(currentQ._id)
                        ? "MARKED"
                        : "MARK FOR REVIEW"}
                    </button>
                  </div>

                  {/* Question text */}
                  <div className="px-6 pt-6 pb-4 flex-shrink-0">
                    <p className="text-gray-800 text-base md:text-lg leading-relaxed font-medium whitespace-pre-line">
                      {currentQ.text}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="px-6 pb-6 space-y-3 flex-1">
                    {currentQ.options.map((opt, i) => {
                      const selected = answers.find(
                        (a) =>
                          a.questionId === currentQ._id && a.userAnswer === opt,
                      );
                      const letter = String.fromCharCode(65 + i);
                      return (
                        <button
                          key={opt}
                          onClick={() => handleAnswerChange(currentQ._id, opt)}
                          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2
                            text-left transition-all duration-150 group
                            ${
                              selected
                                ? "bg-blue-50 border-blue-500 shadow-sm"
                                : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"
                            }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center
                            text-sm font-bold flex-shrink-0 transition-all
                            ${
                              selected
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                            }`}
                          >
                            {letter}
                          </span>
                          <span
                            className={`text-sm md:text-base font-medium flex-1
                            ${selected ? "text-blue-800" : "text-gray-700"}`}
                          >
                            {opt}
                          </span>
                          {selected && (
                            <CheckCircle
                              size={18}
                              className="text-blue-500 flex-shrink-0"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No questions available.
              </div>
            )}
          </div>

          {/* ── Bottom Navigation Bar ─────────────────────────────────────── */}
          <div
            className="flex-shrink-0 bg-white border-t border-gray-200
            px-4 md:px-8 py-3 flex items-center justify-between gap-2 shadow-md z-10"
          >
            {/* Skip */}
            <button
              onClick={goNext}
              disabled={currentIndex === totalQuestions - 1}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2.5 bg-gray-100
                hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed
                text-gray-600 font-bold text-xs md:text-sm rounded-xl transition"
            >
              <SkipForward size={14} /> SKIP
            </button>

            {/* Mark for Review & Next */}
            <button
              onClick={() => {
                toggleMarkReview(currentQ?._id);
                goNext();
              }}
              disabled={!currentQ || currentIndex === totalQuestions - 1}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2.5 bg-[#1a2e4a]
                hover:bg-[#243d5f] disabled:opacity-40 disabled:cursor-not-allowed
                text-white font-bold text-xs md:text-sm rounded-xl transition"
            >
              <Flag size={14} />
              <span className="hidden sm:inline">
                MARK FOR REVIEW &amp;
              </span>{" "}
              NEXT
            </button>

            {/* Prev / Next */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-3 md:px-4 py-2.5 bg-blue-600
                  hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
                  text-white font-bold text-xs md:text-sm rounded-xl transition"
              >
                <ChevronLeft size={15} /> PREV
              </button>
              <button
                onClick={goNext}
                disabled={currentIndex === totalQuestions - 1}
                className="flex items-center gap-1 px-3 md:px-4 py-2.5 bg-blue-600
                  hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
                  text-white font-bold text-xs md:text-sm rounded-xl transition"
              >
                NEXT <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizStart;
