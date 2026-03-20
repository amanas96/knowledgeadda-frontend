import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getQuizById, getQuizAttemptStatus } from "../../api/quizApi";
import {
  Clock,
  FileText,
  Tag,
  Star,
  BookOpen,
  Award,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Eye,
} from "lucide-react";

const QuizDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attemptStatus, setAttemptStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const urlParam = quiz?.slug || slug;

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const [quizRes, statusRes] = await Promise.all([
          getQuizById(slug),
          getQuizAttemptStatus(slug),
        ]);
        setQuiz(quizRes.data);
        setAttemptStatus(statusRes.data);
      } catch (err) {
        console.error("Failed to fetch quiz details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <AlertCircle size={48} className="text-red-400" />
          <p className="text-lg font-medium">Quiz not found.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: <FileText size={22} className="text-blue-500" />,
      label: "Total Questions",
      value: quiz.totalQuestions || 0,
      bg: "bg-blue-50 border-blue-100",
    },
    {
      icon: <Clock size={22} className="text-orange-500" />,
      label: "Time Limit",
      value: `${quiz.timeLimit} mins`,
      bg: "bg-orange-50 border-orange-100",
    },
    {
      icon: <Award size={22} className="text-green-500" />,
      label: "Total Marks",
      value: quiz.totalMarks,
      bg: "bg-green-50 border-green-100",
    },
    {
      icon: <Tag size={22} className="text-purple-500" />,
      label: "Category",
      value: quiz.category,
      bg: "bg-purple-50 border-purple-100",
    },
  ];

  const hasAttempted = attemptStatus?.hasAttempted;
  const allowRetry = attemptStatus?.allowMultipleAttempts;
  const lastAttempt = attemptStatus?.lastAttempt;

  return (
    <div className="min-h-screen bg-gray-50  md:py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8  items-start">
        {/* ── LEFT COLUMN (Laptop: 7/12 width) ─────────────────────── */}
        <div className="lg:col-span-7 space-y-7">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {quiz.course?.title && (
                    <p className="text-sm font-medium text-blue-600 mb-2 flex items-center gap-1">
                      <BookOpen size={14} />
                      {quiz.course.title}
                    </p>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {quiz.title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {quiz.category}
                    </span>
                    {quiz.isPremium ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                        <Star size={11} fill="currentColor" /> Premium
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        Free
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={32} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`bg-white rounded-xl border p-4 flex flex-col items-center text-center shadow-sm ${stat.bg}`}
              >
                <div className="mb-2">{stat.icon}</div>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN (Laptop: 5/12 width) ────────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Already Attempted Card */}
          {hasAttempted && (
            <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={24} className="text-green-500" />
                <h2 className="text-lg font-bold text-gray-800">
                  Already Attempted
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-xl font-bold text-green-600">
                    {lastAttempt?.score}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                    Score
                  </p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xl font-bold text-blue-600">
                    {lastAttempt?.totalQuestions}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                    Questions
                  </p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-xl font-bold text-purple-600">
                    {lastAttempt?.percentage}%
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                    Ratio
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/quiz/${urlParam}/review`, { replace: true })
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  <Eye size={16} /> View
                </button>
                {allowRetry && (
                  <button
                    onClick={() =>
                      navigate(`/quiz/${urlParam}/start?retry=true`)
                    }
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition"
                  >
                    <RotateCcw size={16} /> Retry
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Instructions Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 font-sans">
              Before You Begin
            </h2>
            <ul className="space-y-4">
              {[
                `This quiz has ${quiz.totalQuestions || 0} questions worth ${quiz.totalMarks} marks total.`,
                `You have ${quiz.timeLimit} minutes to complete the test.`,
                "Do not refresh or navigate away once you start.",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          {(!hasAttempted || allowRetry) && (
            <button
              onClick={() => navigate(`/quiz/${urlParam}/start`)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {hasAttempted ? "Start Again" : "Start Quiz"}
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
