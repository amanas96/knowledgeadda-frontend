import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { reviewQuiz } from "../../api/quizApi";
import { useAuth } from "../../context/authContext";

const QuizReview = () => {
  const { quizId } = useParams();
  const { token } = useAuth();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await reviewQuiz(quizId, token);
        setReview(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load review. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [quizId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500 mb-3">{error}</h1>
        <Link
          to="/quizzes"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          Go to Quizzes
        </Link>
      </div>
    );
  }

  const { quizTitle, score, totalQuestions, answers } = review;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 px-6 py-10 text-white">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-6 md:p-10 rounded-2xl shadow-2xl">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          Review: {quizTitle}
        </h1>
        <p className="text-center text-blue-100 mb-8">
          You scored {score} out of {totalQuestions}
        </p>

        {/* Questions */}
        <div className="space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar pr-2">
          {answers.map((ans, index) => (
            <div
              key={index}
              className="bg-white/5 p-5 rounded-xl border border-white/10"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="font-medium">{ans.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {ans.options.map((opt, idx) => {
                  const isUser = opt === ans.userAnswer;
                  const isCorrect = opt === ans.correctAnswer;

                  return (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded-lg text-sm md:text-base border 
                        ${
                          isCorrect
                            ? "bg-green-600/80 border-green-300 text-white"
                            : isUser
                              ? "bg-red-500/70 border-red-300 text-white"
                              : "bg-white/10 border-white/20 text-blue-100"
                        }
                      `}
                    >
                      {opt}
                      {isCorrect && <span className="ml-2">✔</span>}
                      {isUser && !isCorrect && <span className="ml-2">✖</span>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {ans.explanation && (
                <div className="mt-4 bg-white/10 p-4 rounded-xl border border-white/20">
                  <p className="text-sm md:text-base">
                    <span className="font-semibold text-blue-200">
                      Explanation:
                    </span>{" "}
                    {ans.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/quizzes"
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizReview;
