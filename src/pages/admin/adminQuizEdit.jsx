import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  updateQuiz,
  getQuizQuestions,
  deleteQuiz,
  deleteQuestion,
} from "../../api/quizApi";

import apiClient from "../../api/axios";

const AdminQuizEdit = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable quiz fields
  const [quizForm, setQuizForm] = useState({
    title: "",
    category: "General",
    timeLimit: "",
    totalMarks: "",
    isPremium: true,
  });

  // Load quiz details + questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await apiClient.get(`/api/v1/quizzes/${quizId}`);
        setQuiz(data);

        setQuizForm({
          title: data.title,
          category: data.category,
          timeLimit: data.timeLimit,
          totalMarks: data.totalMarks,
          isPremium: data.isPremium,
        });

        const questionsRes = await getQuizQuestions(quizId);
        setQuestions(questionsRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Form Change
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setQuizForm({
      ...quizForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Save Quiz
  const saveQuiz = async () => {
    setSaving(true);
    try {
      await updateQuiz(quizId, quizForm);
      alert("Quiz updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update quiz.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Quiz
  const handleDeleteQuiz = async () => {
    if (!window.confirm("Delete entire quiz?")) return;
    try {
      await deleteQuiz(quizId);
      alert("Quiz deleted");
      navigate("/admin/courses");
    } catch (err) {
      alert("Failed to delete");
      console.error(err);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await deleteQuestion(quizId, questionId);
      setQuestions(questions.filter((q) => q._id !== questionId));
    } catch (err) {
      alert("Failed to delete question");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <Link
        to="/admin/courses"
        className="text-blue-600 hover:underline text-sm"
      >
        &larr; Back to Courses
      </Link>

      <h1 className="text-3xl font-bold text-gray-800">Edit Quiz</h1>

      {/* QUIZ FORM */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Title</label>
            <input
              name="title"
              value={quizForm.title}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Category</label>
            <select
              name="category"
              value={quizForm.category}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="General">General</option>
              <option value="Polity">Polity</option>
              <option value="Geography">Geography</option>
              <option value="Science">Science</option>
              <option value="Economy">Economy</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Time Limit (minutes)</label>
            <input
              type="number"
              name="timeLimit"
              value={quizForm.timeLimit}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Total Marks</label>
            <input
              type="number"
              name="totalMarks"
              value={quizForm.totalMarks}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              name="isPremium"
              checked={quizForm.isPremium}
              onChange={handleChange}
            />
            <label>Premium Quiz?</label>
          </div>
        </div>

        <button
          onClick={saveQuiz}
          disabled={saving}
          className="mt-5 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Quiz"}
        </button>

        <button
          onClick={handleDeleteQuiz}
          className="mt-5 ml-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Delete Quiz
        </button>
      </div>

      {/* QUESTIONS LIST */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Questions</h2>

          <Link
            to={`/admin/quizzes/${quizId}/questions/new`}
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          >
            + Add Question
          </Link>
        </div>

        {questions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No questions yet.</div>
        ) : (
          <ul className="divide-y">
            {questions.map((q) => (
              <li key={q._id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{q.text}</p>
                </div>

                <div className="flex gap-4">
                  <Link
                    to={`/admin/quizzes/${quizId}/questions/${q._id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDeleteQuestion(q._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminQuizEdit;
