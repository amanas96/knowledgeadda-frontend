import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { getAllQuizzes } from "../../api/quizApi";
import {
  Clock,
  Award,
  Tag,
  ChevronRight,
  BookOpen,
  Star,
  ArrowRight,
} from "lucide-react";

// ─── Category color map ───────────────────────────────────────────────────────
const categoryColors = {
  General: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
  Polity: { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-400" },
  Geography: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-400" },
  History: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
  Economy: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-400" },
  Science: { bg: "bg-cyan-50", text: "text-cyan-600", dot: "bg-cyan-400" },
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
    <div className="flex gap-3">
      <div className="h-8 bg-gray-200 rounded-full w-20" />
      <div className="h-8 bg-gray-200 rounded-full w-20" />
    </div>
    <div className="h-10 bg-gray-200 rounded-xl mt-6" />
  </div>
);

// ─── Quiz Card ────────────────────────────────────────────────────────────────
const QuizCard = ({ quiz, onClick }) => {
  const color = categoryColors[quiz.category] || categoryColors["General"];

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col overflow-hidden group cursor-pointer"
      onClick={onClick}
    >
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${color.dot}`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}
          >
            {quiz.category}
          </span>
          {quiz.isPremium && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Premium
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 flex-1">
          {quiz.title}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-gray-400" />
            {quiz.totalQuestions || "—"} Qs
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-400" />
            {quiz.timeLimit} min
          </span>
          <span className="flex items-center gap-1.5">
            <Award size={14} className="text-gray-400" />
            {quiz.totalMarks} marks
          </span>
        </div>

        {/* Button */}
        <button
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${color.bg} ${color.text} group-hover:opacity-90`}
        >
          View Quiz
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ─── Main QuizSection ─────────────────────────────────────────────────────────
const QuizSection = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await getAllQuizzes();
        console.log(data);
        setQuizzes(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* ── Section Header ──────────────────────────────────────── */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Practice Tests
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Test Your Knowledge
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Practice with UPSC-style quizzes crafted by experts and track your
            performance over time.
          </p>
        </div>

        {/* ── Quiz Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : quizzes.map((quiz) => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  onClick={() => navigate(`/quiz/${quiz.slug || quiz._id}`)}
                />
              ))}
        </div>

        {/* ── Empty state ─────────────────────────────────────────── */}
        {!loading && quizzes.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No quizzes available yet.</p>
          </div>
        )}

        {/* ── View All Button ─────────────────────────────────────── */}
        {!loading && quizzes.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/quizzes")}
              className="inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
            >
              View All Quizzes
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizSection;
