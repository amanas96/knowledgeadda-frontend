import React, { useEffect, useState } from "react";

import apiClient from "../../api/quizApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const [infoMessage, setInfoMessage] = useState("");

  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [isAuthenticated, navigate]);const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data } = await apiClient.get("/api/v1/quizzes");
      setQuizzes(data);
    };

    fetchQuizzes();
  }, []);

  const handleQuizClick = (quiz) => {
    // 1. Not logged in → delay then redirect
    if (!isAuthenticated) {
      setInfoMessage("Please login to attempt quizzes.");
      setTimeout(() => {
        navigate("/login", {});
      }, 2000); // 800ms delay (change as you want)

      return;
    }

    // 2. Premium quiz but not subscribed
    if (quiz.isPremium && !user?.isSubscribed) {
      setInfoMessage("Subscribe to unlock premium quizzes.");
      setTimeout(() => {
        navigate("/subscribe");
      }, 1500);

      return;
    }

    // 3. Free or subscribed quiz → allow
    setTimeout(() => {
      navigate(`/quiz/${quiz._id}/start`);
    }, 400); // shorter delay if you prefer
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 text-gray-800 p-8">
      <h1 className="text-4xl font-bold mb-8">All Quizzes</h1>

      {infoMessage && (
        <div className="mb-6 p-4  text-gray-900 shadow text-center animate-pulse">
          {infoMessage}
        </div>
      )}

      <div className="grid md:grid-cols-3  gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            onClick={() => handleQuizClick(quiz)}
            className={`p-6 bg-white/10 border  border-purple-800 rounded-2xl shadow-lg cursor-pointer
    ${quiz.isPremium && !user?.isSubscribed ? "opacity-60" : "hover:bg-white/20"}
    transition-all`}
          >
            <h2 className="text-xl text-gray-900 font-semibold">
              {quiz.title}
            </h2>
            {quiz.category && (
              <p className="text-sm mt-1 opacity-80">{quiz.category}</p>
            )}
            {quiz.isPremium ? (
              !user?.isSubscribed ? (
                <p className="text-red-600 mt-4">🔒 Premium</p>
              ) : null
            ) : (
              <p className="text-green-400 mt-4">🆓 Free</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
