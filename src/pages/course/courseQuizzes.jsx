import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getQuizzesForCourse } from "../api/quizApi";

const CourseQuizzes = () => {
  const { courseId } = useParams();
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data } = await getQuizzesForCourse(courseId, token);
      setQuizzes(data);
    };
    fetchQuizzes();
  }, [courseId, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Available Quizzes</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Link
            to={
              quiz.isPremium && !user.isSubscribed
                ? `/subscribe` // redirect instead of start
                : `/quiz/${quiz._id}/start`
            }
            className={`p-6 rounded-2xl shadow-xl ${
              quiz.isPremium && !user.isSubscribed
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-white/20"
            } bg-white/10 transition-all`}
          >
            <h2 className="text-xl font-bold">{quiz.title}</h2>

            {quiz.isPremium && !user.isSubscribed ? (
              <p className="text-sm mt-3 text-red-200 flex items-center gap-2">
                🔒 Premium — Subscribe to Unlock
              </p>
            ) : (
              <p className="text-sm mt-3 text-green-200">🆓 Free Quiz</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseQuizzes;
