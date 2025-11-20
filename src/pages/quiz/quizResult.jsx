import React from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";

const QuizResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();

  const attempt = state?.attempt;

  // If page was refreshed; no data → redirect to quizzes
  if (!attempt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Result data missing
        </h1>
        <p className="text-gray-600 mb-4">Please attempt the quiz again.</p>
        <Link
          to="/quizzes"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go to Quizzes
        </Link>
      </div>
    );
  }

  const { score, totalQuestions, percentage } = attempt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-6 md:p-10 rounded-2xl shadow-2xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          🎉 Quiz Completed!
        </h1>
        <p className="text-center text-blue-100 mb-8">
          You have successfully completed this quiz.
        </p>

        {/* Score Card */}
        <div className="flex justify-center mb-10">
          <div className="w-48 h-48 rounded-full bg-white/10 border-4 border-white/30 flex flex-col items-center justify-center shadow-xl">
            <span className="text-5xl font-extrabold">{score}</span>
            <span className="text-lg text-blue-100">
              out of {totalQuestions}
            </span>
            <span className="mt-2 text-xl font-semibold">
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="bg-white/10 rounded-xl p-5 border border-white/20">
            <h3 className="text-lg font-semibold mb-1">Correct</h3>
            <p className="text-2xl font-bold text-green-300">
              {attempt.answers.filter((a) => a.isCorrect).length}
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-5 border border-white/20">
            <h3 className="text-lg font-semibold mb-1">Incorrect</h3>
            <p className="text-2xl font-bold text-red-300">
              {attempt.answers.filter((a) => !a.isCorrect).length}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => navigate(`/quiz/${quizId}/review`)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl font-semibold transition-all text-white"
          >
            Review Answers
          </button>

          <Link
            to="/quizzes"
            className="px-6 py-3 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-xl font-semibold transition-all text-center"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
