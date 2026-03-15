import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getQuizById } from "../../api/quizApi";
import {
  Clock,
  FileText,
  Tag,
  Star,
  BookOpen,
  Award,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const QuizDetail = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const res = await getQuizById(quizId);
        setQuiz(res.data);
      } catch (err) {
        console.error("Failed to fetch quiz details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizDetails();
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ── Header Card ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Top color bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

          <div className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Course name */}
                {quiz.course?.title && (
                  <p className="text-sm font-medium text-blue-600 mb-2 flex items-center gap-1">
                    <BookOpen size={14} />
                    {quiz.course.title}
                  </p>
                )}

                {/* Quiz title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {quiz.title}
                </h1>

                {/* Badges */}
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

              {/* Big icon */}
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <BookOpen size={32} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* ── Instructions Card ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Before You Begin
          </h2>
          <ul className="space-y-3">
            {[
              `This quiz has ${quiz.totalQuestions || 0} questions worth ${quiz.totalMarks} marks total.`,
              `You have ${quiz.timeLimit} minutes to complete the quiz. The timer starts when you click Start.`,
              "Each question has only one correct answer. Choose carefully.",
              "Do not refresh or navigate away — your progress may be lost.",
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

        {/* ── Start Button ──────────────────────────────────────────── */}
        <button
          onClick={() => navigate(`/quiz/${quizId}/start`)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
        >
          Start Quiz
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default QuizDetail;
