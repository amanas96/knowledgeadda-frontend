import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reviewQuiz } from "../../api/quizApi";
import {
  ChevronLeft,
  Menu,
  X,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Info,
} from "lucide-react";

const QuizReview = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Refs for auto-scrolling to questions
  const questionRefs = useRef([]);

  useEffect(() => {
    if (!slug) return;
    const fetchReview = async () => {
      try {
        const res = await reviewQuiz(slug);
        setReview(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load review.");
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [slug]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} navigate={navigate} />;

  const { quizTitle, score, totalQuestions, answers = [] } = review;
  const percentage = Math.round((score / totalQuestions) * 100);

  const scrollToQuestion = (index) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    if (window.innerWidth < 1024) setIsSidebarOpen(false); // Close sidebar on mobile after click
  };

  const filteredAnswers = answers.filter((ans) => {
    if (filter === "all") return true;
    if (filter === "correct") return ans.isCorrect;
    if (filter === "wrong") return !ans.isCorrect && ans.userAnswer;
    if (filter === "skipped") return !ans.userAnswer;
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ── SIDEBAR NAVIGATION ────────────────────────────────────────── */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 tracking-tight text-lg">
              Question Map
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-5 gap-3">
              {answers.map((ans, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToQuestion(idx)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border-2
                    ${
                      ans.isCorrect
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                        : !ans.userAnswer
                          ? "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
                          : "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100"
                    }
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <LegendItem color="bg-emerald-500" label="Correct" />
              <LegendItem color="bg-rose-500" label="Incorrect" />
              <LegendItem color="bg-slate-300" label="Skipped" />
            </div>
          </div>

          <div className="p-6 border-t border-slate-100">
            <button
              onClick={() => navigate(`/quiz/${slug}`)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft size={18} /> Exit Review
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">
                {quizTitle}
              </h1>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Performance Review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Total Score
              </p>
              <p className="text-lg font-black text-slate-900">
                {score}/{totalQuestions}
              </p>
            </div>
            <div
              className={`h-10 w-10 md:h-12 md:w-12 rounded-full border-4 flex items-center justify-center font-bold text-sm
              ${percentage >= 50 ? "border-emerald-500 text-emerald-500" : "border-rose-500 text-rose-500"}
            `}
            >
              {percentage}%
            </div>
          </div>
        </header>

        {/* Filter Toolbar */}
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <FilterTab
            active={filter === "all"}
            label="All"
            count={answers.length}
            onClick={() => setFilter("all")}
          />
          <FilterTab
            active={filter === "correct"}
            label="Correct"
            count={answers.filter((a) => a.isCorrect).length}
            onClick={() => setFilter("correct")}
          />
          <FilterTab
            active={filter === "wrong"}
            label="Wrong"
            count={answers.filter((a) => !a.isCorrect && a.userAnswer).length}
            onClick={() => setFilter("wrong")}
          />
          <FilterTab
            active={filter === "skipped"}
            label="Skipped"
            count={answers.filter((a) => !a.userAnswer).length}
            onClick={() => setFilter("skipped")}
          />
        </div>

        {/* Scrollable Questions Review */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="max-w-3xl mx-auto space-y-6">
            {filteredAnswers.map((ans, idx) => (
              <div
                key={idx}
                ref={(el) => (questionRefs.current[answers.indexOf(ans)] = el)}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden scroll-mt-6"
              >
                {/* Question Status Banner */}
                <div
                  className={`px-6 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider
                  ${ans.isCorrect ? "bg-emerald-50 text-emerald-600" : !ans.userAnswer ? "bg-slate-100 text-slate-500" : "bg-rose-50 text-rose-600"}
                `}
                >
                  <span>Question {answers.indexOf(ans) + 1}</span>
                  <div className="flex items-center gap-1">
                    {ans.isCorrect ? (
                      <CheckCircle2 size={14} />
                    ) : !ans.userAnswer ? (
                      <MinusCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {ans.isCorrect
                      ? "Correct"
                      : !ans.userAnswer
                        ? "Skipped"
                        : "Incorrect"}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
                    {ans.question}
                  </h3>

                  <div className="grid gap-3">
                    {ans.options.map((opt, i) => {
                      const isUser = opt === ans.userAnswer;
                      const isCorrect = opt === ans.correctAnswer;

                      let stateStyle =
                        "border-slate-200 bg-white text-slate-600";
                      if (isCorrect)
                        stateStyle =
                          "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500";
                      if (isUser && !isCorrect)
                        stateStyle =
                          "border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500";

                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border-2 font-medium flex justify-between items-center transition-all ${stateStyle}`}
                        >
                          <span className="text-sm md:text-base">{opt}</span>
                          {isCorrect && (
                            <span className="text-[10px] font-black uppercase text-emerald-600">
                              Correct Answer
                            </span>
                          )}
                          {isUser && !isCorrect && (
                            <span className="text-[10px] font-black uppercase text-rose-600">
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {ans.explanation && (
                    <div className="mt-6 p-5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-900">
                      <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase text-blue-600">
                        <Info size={14} /> Explanation
                      </div>
                      <p className="text-sm leading-relaxed italic">
                        {ans.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// ─── HELPER COMPONENTS ────────────────────────────────────────

const FilterTab = ({ active, label, count, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border
    ${active ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}
  `}
  >
    {label} ({count})
  </button>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    {label}
  </div>
);

const LoadingState = () => (
  <div className="h-screen flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

const ErrorState = ({ error, navigate }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
    <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">{error}</h2>
      <button
        onClick={() => navigate("/quizzes")}
        className="text-blue-600 font-bold hover:underline"
      >
        Return to Home
      </button>
    </div>
  </div>
);

export default QuizReview;
