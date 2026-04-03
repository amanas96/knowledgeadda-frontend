import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { reviewQuiz, getAttemptHistory } from "../../api/quizApi";
import {
  ChevronLeft,
  Menu,
  X,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Info,
  Clock,
  History,
} from "lucide-react";

const QuizReview = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [review, setReview] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isQuestionMapOpen, setIsQuestionMapOpen] = useState(true);
  const [isAttemptsOpen, setIsAttemptsOpen] = useState(false);

  const questionRefs = useRef([]);

  // ───────────────────────── FETCH REVIEW
  useEffect(() => {
    const attempt = searchParams.get("attempt");

    const fetchReview = async () => {
      try {
        setLoading(true);
        const res = await reviewQuiz(slug, attempt);
        setReview(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load review.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [slug, searchParams]);

  // ───────────────────────── FETCH ATTEMPT HISTORY
  useEffect(() => {
    const identifier = review?.quiz?._id || slug;

    if (!identifier) return;

    const fetchHistory = async () => {
      try {
        const res = await getAttemptHistory(identifier);
        setHistory(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [review?.quiz?._id, slug]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} navigate={navigate} />;

  const { quizTitle, score, totalQuestions, answers = [] } = review;

  const percentage = Math.round((score / totalQuestions) * 100);

  // ───────────────────────── SCROLL FUNCTION
  const scrollToQuestion = (index) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  // ───────────────────────── FILTER
  const filteredAnswers = answers.filter((ans) => {
    if (filter === "all") return true;
    if (filter === "correct") return ans.isCorrect;
    if (filter === "wrong") return !ans.isCorrect && ans.userAnswer;
    if (filter === "skipped") return !ans.userAnswer;
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ───────────────────────── SIDEBAR */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200
        transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">Navigation</h2>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* QUESTION MAP */}
            <div className="border-b">
              <button
                onClick={() => setIsQuestionMapOpen(!isQuestionMapOpen)}
                className="w-full px-6 py-4 flex justify-between items-center font-semibold text-slate-700"
              >
                Question Map
                <ChevronLeft
                  size={18}
                  className={`transition-transform ${
                    isQuestionMapOpen ? "-rotate-90" : "rotate-180"
                  }`}
                />
              </button>

              {isQuestionMapOpen && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-5 gap-3">
                    {answers.map((ans, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToQuestion(idx)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border-2
                        ${
                          ans.isCorrect
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : !ans.userAnswer
                              ? "bg-slate-100 border-slate-200 text-slate-400"
                              : "bg-rose-50 border-rose-200 text-rose-600"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 space-y-2 text-xs font-semibold text-slate-500">
                    <Legend color="bg-emerald-500" label="Correct" />
                    <Legend color="bg-rose-500" label="Incorrect" />
                    <Legend color="bg-slate-300" label="Skipped" />
                  </div>
                </div>
              )}
            </div>

            {/* ATTEMPT HISTORY */}
            <div>
              <button
                onClick={() => setIsAttemptsOpen(!isAttemptsOpen)}
                className="w-full px-6 py-4 flex justify-between items-center font-semibold text-slate-700"
              >
                Other Attempts
                <ChevronLeft
                  size={18}
                  className={`transition-transform ${
                    isAttemptsOpen ? "-rotate-90" : "rotate-180"
                  }`}
                />
              </button>

              {isAttemptsOpen && (
                <div className="px-6 pb-6 space-y-3">
                  {history.map((att, idx) => {
                    const attemptNo = history.length - idx;

                    return (
                      <button
                        key={att._id}
                        onClick={() => {
                          setSearchParams({ attempt: attemptNo });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full p-3 bg-slate-50 rounded-lg flex justify-between items-center hover:bg-slate-100"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <History size={14} />
                          Attempt #{attemptNo}
                        </span>

                        <span
                          className={`text-xs font-bold ${
                            att.score >= att.totalQuestions / 2
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {att.score}/{att.totalQuestions}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* EXIT BUTTON */}
          <div className="p-6 border-t">
            <button
              onClick={() => navigate(`/quiz/${slug}`)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800"
            >
              <ChevronLeft size={18} />
              Exit Review
            </button>
          </div>
        </div>
      </aside>

      {/* ───────────────────────── MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-slate-100 rounded"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="font-bold text-slate-900 text-lg">{quizTitle}</h1>

              <p className="text-xs uppercase tracking-widest text-slate-400">
                Performance Review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-xs uppercase text-slate-400 font-bold">
                Score
              </p>
              <p className="text-lg font-bold">
                {score}/{totalQuestions}
              </p>
            </div>

            <div
              className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold
              ${
                percentage >= 50
                  ? "border-emerald-500 text-emerald-500"
                  : "border-rose-500 text-rose-500"
              }`}
            >
              {percentage}%
            </div>
          </div>
        </header>

        {/* FILTER BAR */}
        <div className="bg-white border-b px-6 py-3 flex gap-2 overflow-x-auto">
          <FilterTab
            label="All"
            active={filter === "all"}
            onClick={() => setFilter("all")}
            count={answers.length}
          />

          <FilterTab
            label="Correct"
            active={filter === "correct"}
            onClick={() => setFilter("correct")}
            count={answers.filter((a) => a.isCorrect).length}
          />

          <FilterTab
            label="Wrong"
            active={filter === "wrong"}
            onClick={() => setFilter("wrong")}
            count={answers.filter((a) => !a.isCorrect && a.userAnswer).length}
          />

          <FilterTab
            label="Skipped"
            active={filter === "skipped"}
            onClick={() => setFilter("skipped")}
            count={answers.filter((a) => !a.userAnswer).length}
          />
        </div>

        {/* QUESTIONS */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {filteredAnswers.map((ans, idx) => {
              const realIndex = answers.indexOf(ans);

              return (
                <div
                  key={idx}
                  ref={(el) => (questionRefs.current[realIndex] = el)}
                  className="bg-white border rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* STATUS BAR */}
                  <div
                    className={`px-6 py-3 text-xs font-bold uppercase flex justify-between
                    ${
                      ans.isCorrect
                        ? "bg-emerald-50 text-emerald-600"
                        : !ans.userAnswer
                          ? "bg-slate-100 text-slate-500"
                          : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    <span>Question {realIndex + 1}</span>

                    {ans.isCorrect ? (
                      <CheckCircle2 size={14} />
                    ) : !ans.userAnswer ? (
                      <MinusCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                  </div>

                  {/* QUESTION BODY */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-6">
                      {ans.question}
                    </h3>

                    <div className="grid gap-3">
                      {ans.options.map((opt, i) => {
                        const isUser = opt === ans.userAnswer;
                        const isCorrect = opt === ans.correctAnswer;

                        let style = "border-slate-200 bg-white text-slate-700";

                        if (isCorrect)
                          style =
                            "border-emerald-500 bg-emerald-50 text-emerald-900";

                        if (isUser && !isCorrect)
                          style = "border-rose-500 bg-rose-50 text-rose-900";

                        return (
                          <div
                            key={i}
                            className={`p-4 border-2 rounded-xl flex justify-between items-center ${style}`}
                          >
                            <span>{opt}</span>

                            {isCorrect && (
                              <span className="text-xs font-bold text-emerald-600">
                                Correct
                              </span>
                            )}

                            {isUser && !isCorrect && (
                              <span className="text-xs font-bold text-rose-600">
                                Your Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {ans.explanation && (
                      <div className="mt-6 p-5 bg-blue-50 border rounded-xl">
                        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold mb-2">
                          <Info size={14} />
                          Explanation
                        </div>

                        <p className="text-sm text-blue-900">
                          {ans.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

/* ───────────────────────── HELPERS */

const FilterTab = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-xs font-bold border
    ${
      active
        ? "bg-slate-900 border-slate-900 text-white"
        : "bg-white border-slate-200 text-slate-500"
    }`}
  >
    {label} ({count})
  </button>
);

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    {label}
  </div>
);

const LoadingState = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

const ErrorState = ({ error, navigate }) => (
  <div className="h-screen flex flex-col items-center justify-center text-center">
    <h2 className="text-xl font-bold mb-4">{error}</h2>
    <button
      onClick={() => navigate("/quizzes")}
      className="text-blue-600 font-bold"
    >
      Return Home
    </button>
  </div>
);

export default QuizReview;
