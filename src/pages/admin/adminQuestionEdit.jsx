import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { adminUpdateQuestion, adminDeleteQuestion } from "../../api/adminApi"; // ✅
import apiClient from "../../api/axios";

const AdminQuestionEdit = () => {
  const { quizId, questionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: 1,
    explanation: "",
  });

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const { data } = await apiClient.get(
          `/api/v1/quizzes/${quizId}/questions`,
        ); // ✅ student route fine here
        const q = data.find((x) => x._id === questionId);
        if (!q) {
          alert("Question not found");
          navigate(-1);
          return;
        }
        setForm({
          text: q.text,
          optionA: q.options[0],
          optionB: q.options[1],
          optionC: q.options[2] ?? "",
          optionD: q.options[3] ?? "",
          correctAnswer: q.correctAnswer,
          marks: q.marks,
          explanation: q.explanation || "",
        });
      } catch (err) {
        alert("Failed to load question");
      } finally {
        setLoading(false);
      }
    };
    loadQuestion();
  }, [quizId, questionId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveQuestion = async () => {
    try {
      const options = [form.optionA, form.optionB, form.optionC, form.optionD];
      const payload = {
        text: form.text,
        options,
        correctAnswer:
          options[["A", "B", "C", "D"].indexOf(form.correctAnswer)],
        marks: form.marks,
        explanation: form.explanation,
      };
      await adminUpdateQuestion(quizId, questionId, payload); // ✅
      alert("Question updated!");
      navigate(`/admin/quizzes/${quizId}/edit`);
    } catch (err) {
      console.error(err);
      alert("Failed to save question.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete question?")) return;
    try {
      await adminDeleteQuestion(quizId, questionId); // ✅
      navigate(`/admin/quizzes/${quizId}/edit`);
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <Link
        to={`/admin/quizzes/${quizId}/edit`}
        className="text-blue-600 hover:underline text-sm"
      >
        &larr; Back to Quiz
      </Link>
      <h1 className="text-3xl font-bold">Edit Question</h1>
      <div className="bg-white p-6 shadow rounded border space-y-4">
        <div>
          <label className="font-medium">Question Text</label>
          <input
            name="text"
            value={form.text}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        {["A", "B", "C", "D"].map((opt) => (
          <div key={opt}>
            <label className="font-medium">Option {opt}</label>
            <input
              name={`option${opt}`}
              value={form[`option${opt}`]}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        ))}
        <div>
          <label className="font-medium">Correct Answer</label>
          <select
            name="correctAnswer"
            value={form.correctAnswer}
            onChange={handleChange}
            className="border p-2 rounded mt-1"
          >
            {["A", "B", "C", "D"].map((o) => (
              <option key={o} value={o}>
                Option {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-medium">Marks</label>
          <input
            type="number"
            name="marks"
            value={form.marks}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="font-medium">Explanation (optional)</label>
          <textarea
            name="explanation"
            value={form.explanation}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <button
          onClick={saveQuestion}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Question
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 ml-4"
        >
          Delete Question
        </button>
      </div>
    </div>
  );
};

export default AdminQuestionEdit;
