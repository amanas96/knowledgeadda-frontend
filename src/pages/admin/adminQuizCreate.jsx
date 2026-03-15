import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { adminCreateQuiz, adminAddQuestion } from "../../api/adminApi"; // ✅
import apiClient from "../../api/axios";

// ─── JSON Format Example shown to admin ──────────────────────────────────────
const JSON_EXAMPLE = `[
  {
    "text": "What is the capital of India?",
    "options": ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    "correctAnswer": "Delhi",
    "marks": 1
  },
  {
    "text": "Who wrote the Indian Constitution?",
    "options": ["Nehru", "Gandhi", "Ambedkar", "Patel"],
    "correctAnswer": "Ambedkar",
    "marks": 1
  }
]`;

const AdminQuizCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCourseId = searchParams.get("courseId");

  const [quizData, setQuizData] = useState({
    title: "",
    courseId: preSelectedCourseId || "",
    timeLimit: "",
    totalMarks: "",
    isPremium: true,
    category: "General",
  });

  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Single question form state ───────────────────────────────────────────
  const [questionForm, setQuestionForm] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: 1,
    explanation: "",
  });

  // ─── JSON import state ────────────────────────────────────────────────────
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [showJsonPanel, setShowJsonPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("manual"); // "manual" | "json"

  // ─── Load courses ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await apiClient.get("/api/v1/courses");
        setCourses(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load courses");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleQuizChange = (e) => {
    const { name, value, checked, type } = e.target;
    setQuizData({ ...quizData, [name]: type === "checkbox" ? checked : value });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm({ ...questionForm, [name]: value });
  };

  // ─── Add single question manually ────────────────────────────────────────
  const addQuestion = () => {
    const { text, optionA, optionB, optionC, optionD, correctAnswer } =
      questionForm;
    if (!text || !optionA || !optionB || !optionC || !optionD) {
      alert("Please fill all question fields.");
      return;
    }

    const options = [optionA, optionB, optionC, optionD];
    const correctAnswerText = options[correctAnswer.charCodeAt(0) - 65];

    setQuestions([
      ...questions,
      {
        text,
        options,
        correctAnswer: correctAnswerText,
        marks: Number(questionForm.marks),
      },
    ]);

    setQuestionForm({
      text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      marks: 1,
      explanation: "",
    });
  };

  // ─── Remove a question ────────────────────────────────────────────────────
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // ─── Parse and import JSON questions ─────────────────────────────────────
  const handleImportJson = () => {
    setJsonError("");

    let parsed;
    try {
      parsed = JSON.parse(jsonInput);
    } catch (err) {
      setJsonError("❌ Invalid JSON format. Please check your syntax.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setJsonError(
        "❌ JSON must be an array of questions [ { ... }, { ... } ]",
      );
      return;
    }

    const validated = [];
    for (let i = 0; i < parsed.length; i++) {
      const q = parsed[i];

      if (!q.text) {
        setJsonError(`❌ Question ${i + 1} is missing "text" field.`);
        return;
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        setJsonError(
          `❌ Question ${i + 1} must have an "options" array with exactly 4 items.`,
        );
        return;
      }
      if (!q.correctAnswer) {
        setJsonError(`❌ Question ${i + 1} is missing "correctAnswer" field.`);
        return;
      }
      if (!q.options.includes(q.correctAnswer)) {
        setJsonError(
          `❌ Question ${i + 1}: "correctAnswer" ("${q.correctAnswer}") must exactly match one of the options.`,
        );
        return;
      }

      validated.push({
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks || 1,
      });
    }

    setQuestions([...questions, ...validated]);
    setJsonInput("");
    setActiveTab("manual"); // switch to preview after import
    alert(`✅ ${validated.length} questions imported successfully!`);
  };

  // ─── Submit quiz ──────────────────────────────────────────────────────────

  // ✅  handleSubmitQuiz
  const handleSubmitQuiz = async () => {
    if (!quizData.title || !quizData.courseId) {
      alert("Please fill quiz title and choose a course.");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }
    setIsSubmitting(true);
    try {
      const quizRes = await adminCreateQuiz(quizData); // ✅
      const quizId = quizRes.data._id;
      for (const q of questions) {
        await adminAddQuestion(quizId, q); // ✅
      }
      alert("Quiz created successfully!");
      navigate("/admin/courses");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message || "Failed to create quiz. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <Link
        to="/admin/courses"
        className="text-blue-600 hover:underline text-sm"
      >
        &larr; Back
      </Link>

      <h1 className="text-3xl font-bold text-gray-800">Create New Quiz</h1>

      {/* ── Quiz Details ─────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
        {loadingCourses ? (
          <p>Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={handleQuizChange}
                className="w-full border p-2 rounded mt-1"
                placeholder="e.g. React Basics Quiz"
              />
            </div>
            <div>
              <label className="font-medium">Select Course</label>
              <select
                name="courseId"
                value={quizData.courseId}
                onChange={handleQuizChange}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium">Category</label>
              <select
                name="category"
                value={quizData.category}
                onChange={handleQuizChange}
                className="w-full border p-2 rounded mt-1"
              >
                {[
                  "General",
                  "Polity",
                  "Geography",
                  "Science",
                  "Economy",
                  "Other",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium">Time Limit (minutes)</label>
              <input
                type="number"
                name="timeLimit"
                value={quizData.timeLimit}
                onChange={handleQuizChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="font-medium">Total Marks</label>
              <input
                type="number"
                name="totalMarks"
                value={quizData.totalMarks}
                onChange={handleQuizChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                name="isPremium"
                checked={quizData.isPremium}
                onChange={handleQuizChange}
              />
              <label>Premium Quiz?</label>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Questions — Tab switcher ──────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "manual"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ✏️ Add Manually
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "json"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📋 Paste JSON
          </button>
        </div>

        {/* Manual Tab */}
        {activeTab === "manual" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add Question</h2>
            <label className="font-medium">Question</label>
            <input
              type="text"
              name="text"
              value={questionForm.text}
              onChange={handleQuestionChange}
              className="w-full border p-2 rounded mb-4 mt-1"
              placeholder="Enter your question"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["A", "B", "C", "D"].map((opt) => (
                <div key={opt}>
                  <label className="font-medium">Option {opt}</label>
                  <input
                    type="text"
                    name={`option${opt}`}
                    value={questionForm[`option${opt}`]}
                    onChange={handleQuestionChange}
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="font-medium">Correct Answer</label>
              <select
                name="correctAnswer"
                value={questionForm.correctAnswer}
                onChange={handleQuestionChange}
                className="border p-2 rounded ml-3"
              >
                {["A", "B", "C", "D"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={addQuestion}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Add Question
            </button>
          </div>
        )}

        {/* JSON Tab */}
        {activeTab === "json" && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Paste Questions as JSON</h2>
              <button
                onClick={() => setShowJsonPanel(!showJsonPanel)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showJsonPanel ? "Hide Example" : "Show Example Format"}
              </button>
            </div>

            {/* Example format */}
            {showJsonPanel && (
              <div className="bg-gray-900 text-green-400 text-xs p-4 rounded-lg overflow-auto max-h-64 font-mono">
                <p className="text-gray-400 mb-2">// Expected JSON format:</p>
                <pre>{JSON_EXAMPLE}</pre>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Paste an array of questions. Each question needs:
              <span className="font-medium text-gray-700"> text</span>,
              <span className="font-medium text-gray-700"> options</span> (array
              of 4),
              <span className="font-medium text-gray-700">
                {" "}
                correctAnswer
              </span>{" "}
              (must match one option exactly), and optionally
              <span className="font-medium text-gray-700"> marks</span> (default
              1).
            </p>

            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError("");
              }}
              rows={12}
              className="w-full border border-gray-300 p-3 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder='[{ "text": "Question?", "options": ["A","B","C","D"], "correctAnswer": "A", "marks": 1 }]'
            />

            {jsonError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded">
                {jsonError}
              </p>
            )}

            <button
              onClick={handleImportJson}
              disabled={!jsonInput.trim()}
              className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Import Questions
            </button>
          </div>
        )}
      </div>

      {/* ── Questions Preview ─────────────────────────────────────────────── */}
      {questions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Questions Added
              <span className="ml-2 bg-blue-100 text-blue-700 text-sm px-2 py-0.5 rounded-full">
                {questions.length}
              </span>
            </h2>
            <button
              onClick={() => setQuestions([])}
              className="text-sm text-red-500 hover:underline"
            >
              Clear All
            </button>
          </div>

          <ul className="space-y-3">
            {questions.map((q, idx) => (
              <li
                key={idx}
                className="p-4 border rounded-lg bg-gray-50 relative"
              >
                <button
                  onClick={() => removeQuestion(idx)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xs"
                >
                  ✕ Remove
                </button>
                <p className="font-semibold text-gray-800 pr-16">
                  {idx + 1}. {q.text}
                </p>
                <ul className="mt-2 space-y-1">
                  {q.options.map((o, i) => (
                    <li
                      key={i}
                      className={`text-sm px-2 py-1 rounded ${
                        o === q.correctAnswer
                          ? "bg-green-100 text-green-700 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. {o}
                      {o === q.correctAnswer && " ✓"}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-2">Marks: {q.marks}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <button
        onClick={handleSubmitQuiz}
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 text-lg rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting
          ? "Creating Quiz..."
          : `Create Quiz (${questions.length} Questions)`}
      </button>
    </div>
  );
};

export default AdminQuizCreate;
