import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  adminUpdateQuiz,
  adminDeleteQuiz,
  adminDeleteQuestion,
  adminGetQuizDetails,
  adminGetQuizQuestions,
  adminAddQuestion,
} from "../../api/adminApi";

import apiClient from "../../api/axios";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Loader2,
  ChevronDown,
  Star,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const CATEGORIES = [
  "General",
  "Polity",
  "Geography",
  "History",
  "Science",
  "Economy",
  "Other",
];

// ── Reusable components ───────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      bg-white transition-all ${className}`}
    {...props}
  />
);

const Select = ({ children, className = "", ...props }) => (
  <select
    className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none
      bg-white transition-all ${className}`}
    {...props}
  >
    {children}
  </select>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminQuizEdit = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const [quizForm, setQuizForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "General",
    customCategory: "",
    timeLimit: "",
    totalMarks: "",
    isPremium: false,
    allowMultipleAttempts: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: 1,
    explanation: "",
  });
  // ── Fetch quiz + questions ────────────────────────────────────────────────
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await adminGetQuizDetails(quizId);
        setQuiz(data);
        setQuizForm({
          title: data.title || "",
          slug: data.slug || "",
          description: data.description || "",
          category: data.category || "General",
          customCategory: data.customCategory || "",
          timeLimit: data.timeLimit || "",
          totalMarks: data.totalMarks || "",
          isPremium: data.isPremium ?? false,
          allowMultipleAttempts: data.allowMultipleAttempts ?? true,
        });

        const questionsRes = await adminGetQuizQuestions(quizId);
        setQuestions(questionsRes.data?.questions || questionsRes.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // ── Handle field changes ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    // Auto-update slug from title (only if not manually edited)
    if (name === "title") {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setQuizForm((prev) => ({
        ...prev,
        title: value,
        slug: slugEdited ? prev.slug : autoSlug,
      }));
      return;
    }

    // Clean slug as admin types
    if (name === "slug") {
      setSlugEdited(true);
      const cleanSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/\s+/g, "-");
      setQuizForm((prev) => ({ ...prev, slug: cleanSlug }));
      return;
    }

    // Clear customCategory when switching away from Other
    if (name === "category" && value !== "Other") {
      setQuizForm((prev) => ({ ...prev, category: value, customCategory: "" }));
      return;
    }

    setQuizForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Save quiz ─────────────────────────────────────────────────────────────
  const saveQuiz = async () => {
    if (!quizForm.title.trim()) return alert("Title is required.");
    if (!quizForm.slug.trim()) return alert("Slug is required.");
    if (quizForm.category === "Other" && !quizForm.customCategory.trim()) {
      return alert("Please enter a custom category.");
    }

    setSaving(true);
    setSaveSuccess(false);
    try {
      const payload = {
        ...quizForm,
        timeLimit: Number(quizForm.timeLimit) || 0,
        totalMarks: Number(quizForm.totalMarks) || 0,
        customCategory:
          quizForm.category === "Other" ? quizForm.customCategory : null,
      };
      await adminUpdateQuiz(quizId, payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update quiz.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete quiz ───────────────────────────────────────────────────────────
  const handleDeleteQuiz = async () => {
    if (!window.confirm("Delete entire quiz? This cannot be undone.")) return;
    try {
      await adminDeleteQuiz(quizId);
      navigate("/admin/courses");
    } catch (err) {
      alert("Failed to delete quiz.");
      console.error(err);
    }
  };

  // ── Delete question ───────────────────────────────────────────────────────
  const handleDeleteQuestion = async (questionId) => {
    // 1. Confirm with user
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    // 2. Save a backup of the current questions (in case of server failure)
    const previousQuestions = [...questions];

    // 3. OPTIMISTIC UPDATE: Remove from UI immediately
    setQuestions((prev) => prev.filter((q) => q._id !== questionId));

    try {
      // 4. Send request to backend
      await adminDeleteQuestion(quizId, questionId);

      // Optional: Show a silent success notification
      console.log("Question deleted from server successfully.");
    } catch (err) {
      // 5. ROLLBACK: If server fails, put the question back
      setQuestions(previousQuestions);

      alert(
        "Server error: Could not delete the question. It has been restored to your list.",
      );
      console.error("Delete failed:", err);
    }
  };

  // - Add question
  const handleAddQuestion = async () => {
    if (!newQuestion.text.trim()) return alert("Question text is required.");

    try {
      const options = [
        newQuestion.optionA,
        newQuestion.optionB,
        newQuestion.optionC,
        newQuestion.optionD,
      ];

      // Convert 'A' to the actual text value
      const correctAnswerText =
        options[newQuestion.correctAnswer.charCodeAt(0) - 65];

      const payload = {
        text: newQuestion.text,
        options,
        correctAnswer: correctAnswerText,
        marks: Number(newQuestion.marks),
        explanation: newQuestion.explanation,
      };
      console.log("DEBUG: Payload being sent:", payload);
      const { data } = await adminAddQuestion(quizId, payload);
      console.log("DEBUG: Backend Response received:", data);

      // 🚀 Update local list instantly
      setQuestions((prev) => [...prev, data]);

      // Reset and Close
      setIsModalOpen(false);
      setNewQuestion({
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        marks: 1,
        explanation: "",
      });

      alert("Question added successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add question.");
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading quiz...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div>
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft size={15} /> Back to Courses
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
          {quiz?.slug && (
            <p className="text-sm text-gray-400 mt-1">
              URL: <span className="text-blue-500">/quiz/{quiz.slug}</span>
            </p>
          )}
        </div>

        {/* ── Quiz Details ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-gray-800">Quiz Details</h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2">
              <Label required>Title</Label>
              <Input
                name="title"
                value={quizForm.title}
                onChange={handleChange}
                placeholder="Quiz title"
              />
            </div>

            {/* Slug */}
            <div className="md:col-span-2">
              <Label required>
                Slug
                <span className="text-xs font-normal text-gray-400 ml-2">
                  (SEO-friendly URL)
                </span>
              </Label>
              <Input
                name="slug"
                value={quizForm.slug}
                onChange={handleChange}
                placeholder="e.g. indian-polity-basics"
              />
              {quizForm.slug && (
                <p className="text-xs text-gray-400 mt-1.5">
                  Preview:{" "}
                  <span className="text-blue-500 font-medium">
                    /quiz/{quizForm.slug}
                  </span>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label>Description</Label>
              <textarea
                name="description"
                value={quizForm.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <div className="relative">
                <Select
                  name="category"
                  value={quizForm.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Custom Category */}
            {quizForm.category === "Other" && (
              <div>
                <Label required>Custom Category</Label>
                <Input
                  name="customCategory"
                  value={quizForm.customCategory}
                  onChange={handleChange}
                  placeholder="e.g. Art, Music, Sports..."
                />
              </div>
            )}

            {/* Time Limit */}
            <div>
              <Label>Time Limit (minutes)</Label>
              <Input
                type="number"
                name="timeLimit"
                value={quizForm.timeLimit}
                onChange={handleChange}
                placeholder="0 = no limit"
                min={0}
              />
            </div>

            {/* Total Marks */}
            <div>
              <Label>Total Marks</Label>
              <Input
                type="number"
                name="totalMarks"
                value={quizForm.totalMarks}
                onChange={handleChange}
                min={0}
              />
            </div>

            {/* Toggles */}
            <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
              {/* isPremium */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isPremium"
                    checked={quizForm.isPremium}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${quizForm.isPremium ? "bg-amber-400" : "bg-gray-200"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${quizForm.isPremium ? "translate-x-5" : "translate-x-1"}`}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Star size={14} className="text-amber-400" /> Premium Quiz
                </span>
              </label>

              {/* allowMultipleAttempts */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="allowMultipleAttempts"
                    checked={quizForm.allowMultipleAttempts}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${quizForm.allowMultipleAttempts ? "bg-green-400" : "bg-gray-200"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${quizForm.allowMultipleAttempts ? "translate-x-5" : "translate-x-1"}`}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Allow Multiple Attempts
                </span>
              </label>
            </div>
          </div>

          {/* Save / Delete buttons */}
          <div className="px-6 pb-6 flex items-center gap-3">
            <button
              onClick={saveQuiz}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                disabled:bg-gray-300 disabled:cursor-not-allowed
                text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={15} /> Save Changes
                </>
              )}
            </button>

            {/* Success message */}
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle size={15} /> Saved successfully
              </span>
            )}

            <button
              onClick={handleDeleteQuiz}
              className="flex items-center gap-2 ml-auto bg-red-50 hover:bg-red-100
                text-red-600 border border-red-200 px-5 py-2.5 rounded-lg text-sm
                font-semibold transition-colors"
            >
              <Trash2 size={15} /> Delete Quiz
            </button>
          </div>
        </div>

        {/* ── Questions ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-800">Questions</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus size={15} /> Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={20} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No questions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add your first question above
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {questions.map((q, idx) => (
                <li
                  key={q._id}
                  className="px-6 py-4 flex items-start justify-between gap-4 group hover:bg-gray-50/50"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {q.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Correct:{" "}
                        <span className="text-green-600 font-medium">
                          {q.correctAnswer}
                        </span>
                        {q.marks && (
                          <span className="ml-3">Marks: {q.marks}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link
                      to={`/admin/quizzes/${quizId}/questions/${q._id}/edit`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteQuestion(q._id)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
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

      {/* Modal View*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-800">Add New Question</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <Label required>Question Text</Label>
                <Input
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                  placeholder="What is the capital of..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["A", "B", "C", "D"].map((opt) => (
                  <div key={opt}>
                    <Label required>Option {opt}</Label>
                    <Input
                      value={newQuestion[`option${opt}`]}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          [`option${opt}`]: e.target.value,
                        })
                      }
                      placeholder={`Option ${opt}`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Correct Option</Label>
                  <Select
                    value={newQuestion.correctAnswer}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        correctAnswer: e.target.value,
                      })
                    }
                  >
                    {["A", "B", "C", "D"].map((o) => (
                      <option key={o} value={o}>
                        Option {o}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, marks: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Explanation (Optional)</Label>
                <Input
                  value={newQuestion.explanation}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      explanation: e.target.value,
                    })
                  }
                  placeholder="Explain why this answer is correct..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddQuestion}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Save Question
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizEdit;
