import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { getQuizQuestions, submitQuiz } from "../../api/quizApi";
import Timer from "../../components/Timer.jsx";

const QuizStart = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth(); // assuming token is in authContext

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]); // [{questionId, userAnswer}]
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  // === Fetch questions ===
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getQuizQuestions(quizId, token);
        setQuestions(res.data.questions || []);
        setQuizTitle(res.data.quizTitle || "Quiz");
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load quiz questions.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId, token]);

  // === Handle selecting an answer ===
  const handleAnswerChange = (questionId, option) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { questionId, userAnswer: option }];
    });
  };

  // === Submit quiz ===
  const handleSubmit = useCallback(async () => {
    if (submitLoading) return;

    try {
      setSubmitLoading(true);
      setError(null);

      const res = await submitQuiz(quizId, answers, token);
      navigate(`/quiz/${quizId}/result`, {
        state: { attempt: res.data.attempt },
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to submit quiz. Try again.";
      setError(message);
    } finally {
      setSubmitLoading(false);
    }
  }, [quizId, answers, token, navigate, submitLoading]);

  // === PREMIUM LOCK UI ===
  if (error === "This quiz is premium. Subscribe to unlock.") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white px-6">
        <h1 className="text-4xl font-extrabold mb-3">🔒 Premium Quiz</h1>
        <p className="text-lg mb-6 text-blue-100 text-center max-w-md">
          This quiz is available only for subscribed users. Upgrade your plan to
          unlock all premium test series and quizzes.
        </p>
        <Link
          to="/subscribe"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          Go to Subscription
        </Link>
      </div>
    );
  }

  // === Generic Error UI ===
  if (!loading && error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border border-gray-200">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Unable to Access Quiz
          </h1>

          <p className="text-gray-700 mb-6 leading-relaxed">{error}</p>

          {/* 👉 Show Review button if quiz was already attempted */}
          {error.toLowerCase().includes("already attempted") && (
            <button
              onClick={() => navigate(`/quiz/${quizId}/review`)}
              className="px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition w-full shadow"
            >
              Review Your Attempt
            </button>
          )}

          {/* 👉 Show Try Again for other errors */}
          {!error.toLowerCase().includes("already attempted") && (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition w-full shadow"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // === Loading state ===
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="mt-4 text-sm text-gray-900">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{quizTitle}</h1>
            <p className="text-sm text-gray-600">
              {totalQuestions} question{totalQuestions !== 1 ? "s" : ""} •
              Answer carefully and click Submit when done.
            </p>
          </div>
          {/* Timer – static 10 minutes for now */}
          <Timer duration={10} onEnd={handleSubmit} />
        </div>

        {/* Questions */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          {questions.map((q, index) => (
            <div
              key={q._id}
              className="bg-white/5 rounded-xl p-4 md:p-5 border border-white/10"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm md:text-base font-medium leading-relaxed">
                  {q.text}
                </p>
              </div>

              <div className="space-y-2 mt-2">
                {q.options.map((opt) => {
                  const selected = answers.find(
                    (a) => a.questionId === q._id && a.userAnswer === opt
                  );
                  return (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-800 cursor-pointer text-sm md:text-base
                        ${
                          selected
                            ? "bg-blue-600/80 text-white"
                            : "bg-white/5 text-blue-50 hover:bg-white/10"
                        }`}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={!!selected}
                        onChange={() => handleAnswerChange(q._id, opt)}
                        className="hidden"
                      />
                      <span className="inline-block w-4 h-4 rounded-full border border-gray-500 flex-shrink-0 flex items-center justify-center">
                        {selected && (
                          <span className="w-2 h-2 rounded-full bg-gray-800" />
                        )}
                      </span>
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <p className="text-center text-blue-100">
              No questions available in this quiz yet.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={submitLoading || questions.length === 0}
            className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all
              ${
                submitLoading || questions.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              }`}
          >
            {submitLoading ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizStart;
