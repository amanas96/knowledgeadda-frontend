import React, { useEffect, useState } from "react";
import { getAllQuizzes } from "../../api/quizApi"; // ✅ use this, not apiClient directly
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [infoMessage, setInfoMessage] = useState("");
  const { user, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getAllQuizzes(); // ✅ use the api function
        setQuizzes(res.data);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      }
    };
    fetchQuizzes();
  }, []);

  const filteredQuizzes =
    filter === "all" ? quizzes : quizzes.filter((q) => q.quizType === filter);

  const handleQuizClick = (quiz) => {
    // 1. Not logged in
    if (!isAuthenticated) {
      setInfoMessage("Please login to attempt quizzes.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    // 2. Premium but not subscribed
    if (quiz.isPremium && !user?.isSubscribed) {
      setInfoMessage("Subscribe to unlock premium quizzes.");
      setTimeout(() => navigate("/subscribe"), 1500);
      return;
    }

    // 3. ✅ Go to detail page first, not start directly
    navigate(`/quiz/${quiz.slug || quiz._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 text-gray-800 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold mb-8">All Quizzes</h1>
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
        >
          <Trophy size={16} /> Global Leaderboard
        </Link>
        <div className="flex gap-2 mb-6">
          {["all", "standalone", "course", "daily", "mock_test"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400"
              }`}
            >
              {type === "all" ? "All" : type.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      {infoMessage && (
        <div className="mb-6 p-4 text-gray-900 shadow text-center animate-pulse">
          {infoMessage}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz._id}
            onClick={() => handleQuizClick(quiz)}
            className={`p-6 bg-white border border-purple-800 rounded-2xl shadow-lg cursor-pointer
              ${
                quiz.isPremium && !user?.isSubscribed
                  ? "opacity-60"
                  : "hover:shadow-xl hover:scale-[1.01]"
              } transition-all`}
          >
            <h2 className="text-xl text-gray-900 font-semibold">
              {quiz.title}
            </h2>

            {quiz.category && (
              <p className="text-sm text-gray-500 mt-1">{quiz.category}</p>
            )}

            <div className="mt-4 flex items-center justify-between">
              {quiz.isPremium ? (
                <span className="text-red-500 text-sm font-medium">
                  🔒 Premium
                </span>
              ) : (
                <span className="text-green-500 text-sm font-medium">
                  🆓 Free
                </span>
              )}

              {quiz.totalQuestions && (
                <span className="text-xs text-gray-400">
                  {quiz.totalQuestions} questions
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
