import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { adminCreateQuiz, adminAddQuestion } from "../../api/adminApi";
import apiClient from "../../api/axios";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Tag,
  Clock,
  Star,
  ChevronDown,
  FileJson,
  PenLine,
  Loader2,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "General",
  "Polity",
  "Geography",
  "History",
  "Economy",
  "Science",
  "Other",
];

const JSON_EXAMPLE = `[
  {
    "text": "What is the capital of India?",
    "options": ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    "correctAnswer": "Delhi",
    "marks": 1,
    "explanation": "Delhi is the capital and largest city of India."
  },
  {
    "text": "Who wrote the Indian Constitution?",
    "options": ["Nehru", "Gandhi", "Ambedkar", "Patel"],
    "correctAnswer": "Ambedkar",
    "marks": 1,
    "explanation": "Dr. B.R. Ambedkar was the chief architect of the Indian Constitution."
  }
]`;
// ─── Small reusable components ────────────────────────────────────────────────
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
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      bg-white transition-all appearance-none ${className}`}
    {...props}
  >
    {children}
  </select>
);

const SectionCard = ({ title, icon: Icon, children, accent = "blue" }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div
      className={`px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-${accent}-50/50`}
    >
      {Icon && <Icon size={18} className={`text-${accent}-600`} />}
      <h2 className="font-bold text-gray-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminQuizCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCourseId = searchParams.get("courseId");

  // ── Quiz form state ──────────────────────────────────────────────────────
  const [quizData, setQuizData] = useState({
    title: "",
    slug: "",
    description: "",
    courseId: preSelectedCourseId || "",
    category: "General",
    customCategory: "",
    quizType: "standalone",
    timeLimit: "",
    totalMarks: "",
    isPremium: false,
    allowMultipleAttempts: true,
  });

  // ── Questions state ──────────────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
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

  // ── JSON state ───────────────────────────────────────────────────────────
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [showJsonExample, setShowJsonExample] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  // ── UI state ─────────────────────────────────────────────────────────────
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  // ── Load courses ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await apiClient.get("/api/v1/courses");
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // ── Handle quiz field changes ─────────────────────────────────────────────
  const handleQuizChange = (e) => {
    const { name, value, checked, type } = e.target;

    // Auto-generate slug from title (only if admin hasn't manually edited slug)
    if (name === "title") {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      setQuizData((prev) => ({
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
      setQuizData((prev) => ({ ...prev, slug: cleanSlug }));
      return;
    }

    // Clear customCategory when switching away from Other
    if (name === "category" && value !== "Other") {
      setQuizData((prev) => ({ ...prev, category: value, customCategory: "" }));
      return;
    }

    setQuizData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Handle question field changes ─────────────────────────────────────────
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Add question manually ─────────────────────────────────────────────────
  const addQuestion = () => {
    const { text, optionA, optionB, optionC, optionD, correctAnswer } =
      questionForm;
    if (!text || !optionA || !optionB || !optionC || !optionD) {
      alert("Please fill all question fields.");
      return;
    }
    const options = [optionA, optionB, optionC, optionD];
    const correctAnswerText = options[correctAnswer.charCodeAt(0) - 65];

    setQuestions((prev) => [
      ...prev,
      {
        text,
        options,
        correctAnswer: correctAnswerText,
        marks: Number(questionForm.marks),
        explanation: questionForm.explanation,
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

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Import JSON questions ─────────────────────────────────────────────────
  const handleImportJson = () => {
    setJsonError("");
    let parsed;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setJsonError("Invalid JSON format. Please check your syntax.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setJsonError("JSON must be an array: [ { ... }, { ... } ]");
      return;
    }

    const validated = [];
    for (let i = 0; i < parsed.length; i++) {
      const q = parsed[i];
      if (!q.text) {
        setJsonError(`Question ${i + 1} missing "text"`);
        return;
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        setJsonError(`Question ${i + 1} needs exactly 4 options`);
        return;
      }
      if (!q.correctAnswer) {
        setJsonError(`Question ${i + 1} missing "correctAnswer"`);
        return;
      }
      if (!q.options.includes(q.correctAnswer)) {
        setJsonError(
          `Question ${i + 1}: correctAnswer must match one of the options exactly`,
        );
        return;
      }
      validated.push({
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks || 1,
        explanation: q.explanation || "",
      });
    }

    setQuestions((prev) => [...prev, ...validated]);
    setJsonInput("");
    setActiveTab("manual");
  };

  // ── Submit quiz ───────────────────────────────────────────────────────────
  const handleSubmitQuiz = async () => {
    if (!quizData.title.trim()) return alert("Quiz title is required.");
    if (!quizData.slug.trim()) return alert("Quiz slug is required.");
    if (quizData.quizType === "course" && !quizData.courseId) {
      return alert("Please select a course.");
    }
    if (quizData.category === "Other" && !quizData.customCategory.trim()) {
      return alert("Please enter a custom category.");
    }
    if (questions.length === 0) return alert("Add at least one question.");

    setIsSubmitting(true);
    try {
      const payload = {
        title: quizData.title,
        slug: quizData.slug,
        description: quizData.description,
        course: quizData.courseId,
        category: quizData.category,
        customCategory:
          quizData.category === "Other" ? quizData.customCategory : null,
        timeLimit: Number(quizData.timeLimit) || 0,
        courseId: quizData.quizType === "course" ? quizData.courseId : null,
        quizType: quizData.quizType,
        totalMarks: Number(quizData.totalMarks) || 0,
        isPremium: quizData.isPremium,
        allowMultipleAttempts: quizData.allowMultipleAttempts,
      };

      const quizRes = await adminCreateQuiz(payload);
      const quizId = quizRes.data._id;

      for (const q of questions) {
        await adminAddQuestion(quizId, q);
      }

      navigate("/admin/courses");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pb-4 space-y-6">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Quiz{" "}
            <span className="text-sm font-normal text-gray-400">
              (Fill in quiz details, add questions, then publish.)
            </span>
          </h1>
        </div>

        {/* ── Quiz Details ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  items-start">
          <SectionCard title="Quiz Details" icon={BookOpen}>
            {loadingCourses ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" /> Loading
                courses...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="md:col-span-2">
                  <Label required>Quiz Title</Label>
                  <Input
                    name="title"
                    value={quizData.title}
                    onChange={handleQuizChange}
                    placeholder="e.g. Indian Polity Basics"
                  />
                </div>

                {/* Slug */}
                <div className="md:col-span-2">
                  <Label required>
                    Slug
                    <span className="text-xs font-normal text-gray-400 ml-2">
                      (SEO-friendly URL identifier)
                    </span>
                  </Label>
                  <Input
                    name="slug"
                    value={quizData.slug}
                    onChange={handleQuizChange}
                    placeholder="e.g. indian-polity-basics"
                  />
                  {quizData.slug && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      URL preview:{" "}
                      <span className="text-blue-500 font-medium">
                        /quiz/{quizData.slug}
                      </span>
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <textarea
                    name="description"
                    value={quizData.description}
                    onChange={handleQuizChange}
                    rows={3}
                    placeholder="Brief description of this quiz..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quiz Type
                  </label>
                  <select
                    name="quizType"
                    value={quizData.quizType}
                    onChange={handleQuizChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="standalone">Standalone</option>
                    <option value="course">Course Quiz</option>
                    <option value="daily">Daily Quiz</option>
                    <option value="mock_test">Mock Test</option>
                  </select>
                </div>
                {/* Course */}
                {quizData.quizType === "course" && (
                  <div>
                    <Label required>Course</Label>
                    <div className="relative">
                      <Select
                        name="courseId"
                        value={quizData.courseId}
                        onChange={handleQuizChange}
                      >
                        <option value="">Select a course</option>
                        {courses.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.title}
                          </option>
                        ))}
                      </Select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                )}

                {/* Category */}
                <div>
                  <Label>Category</Label>
                  <div className="relative">
                    <Select
                      name="category"
                      value={quizData.category}
                      onChange={handleQuizChange}
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

                {/* Custom Category — only when Other */}
                {quizData.category === "Other" && (
                  <div className="md:col-span-2">
                    <Label required>Custom Category</Label>
                    <Input
                      name="customCategory"
                      value={quizData.customCategory}
                      onChange={handleQuizChange}
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
                    value={quizData.timeLimit}
                    onChange={handleQuizChange}
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
                    value={quizData.totalMarks}
                    onChange={handleQuizChange}
                    placeholder="e.g. 10"
                    min={0}
                  />
                </div>

                {/* Toggles */}
                <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isPremium"
                        checked={quizData.isPremium}
                        onChange={handleQuizChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-6 rounded-full transition-colors ${quizData.isPremium ? "bg-amber-400" : "bg-gray-200"}`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${quizData.isPremium ? "translate-x-5" : "translate-x-1"}`}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Star size={14} className="text-amber-400" /> Premium Quiz
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="allowMultipleAttempts"
                        checked={quizData.allowMultipleAttempts}
                        onChange={handleQuizChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-6 rounded-full transition-colors ${quizData.allowMultipleAttempts ? "bg-green-400" : "bg-gray-200"}`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${quizData.allowMultipleAttempts ? "translate-x-5" : "translate-x-1"}`}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Allow Multiple Attempts
                    </span>
                  </label>
                </div>
              </div>
            )}
          </SectionCard>

          {/* ── Add Questions ────────────────────────────────────────────────── */}
          <div className="order-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Tab Header */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("manual")}
                  className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors
                ${
                  activeTab === "manual"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                >
                  <PenLine size={15} /> Add Manually
                </button>
                <button
                  onClick={() => setActiveTab("json")}
                  className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors
                ${
                  activeTab === "json"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                >
                  <FileJson size={15} /> Paste JSON
                </button>
              </div>

              {/* Manual Tab */}
              {activeTab === "manual" && (
                <div className="p-6 space-y-4">
                  <div>
                    <Label required>Question</Label>
                    <Input
                      name="text"
                      value={questionForm.text}
                      onChange={handleQuestionChange}
                      placeholder="Enter your question here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["A", "B", "C", "D"].map((opt) => (
                      <div key={opt}>
                        <Label>Option {opt}</Label>
                        <Input
                          name={`option${opt}`}
                          value={questionForm[`option${opt}`]}
                          onChange={handleQuestionChange}
                          placeholder={`Option ${opt}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Correct Answer</Label>
                      <div className="relative">
                        <Select
                          name="correctAnswer"
                          value={questionForm.correctAnswer}
                          onChange={handleQuestionChange}
                        >
                          {["A", "B", "C", "D"].map((o) => (
                            <option key={o} value={o}>
                              Option {o}
                            </option>
                          ))}
                        </Select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Marks</Label>
                      <Input
                        type="number"
                        name="marks"
                        value={questionForm.marks}
                        onChange={handleQuestionChange}
                        min={1}
                      />
                    </div>
                    <div>
                      <Label>Explanation (optional)</Label>
                      <Input
                        name="explanation"
                        value={questionForm.explanation}
                        onChange={handleQuestionChange}
                        placeholder="Why is this correct?"
                      />
                    </div>
                  </div>

                  <button
                    onClick={addQuestion}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white
                  px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Plus size={16} /> Add Question
                  </button>
                </div>
              )}

              {/* JSON Tab */}
              {activeTab === "json" && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Paste an array of question objects.
                    </p>
                    <button
                      onClick={() => setShowJsonExample(!showJsonExample)}
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                    >
                      {showJsonExample ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                      {showJsonExample ? "Hide" : "Show"} Example
                    </button>
                  </div>

                  {showJsonExample && (
                    <div className="bg-gray-900 text-green-400 text-xs p-4 rounded-xl overflow-auto max-h-64 font-mono">
                      <p className="text-gray-500 mb-2">// Expected format:</p>
                      <pre>{JSON_EXAMPLE}</pre>
                    </div>
                  )}

                  <textarea
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      setJsonError("");
                    }}
                    rows={10}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder='[{ "text": "Question?", "options": ["A","B","C","D"], "correctAnswer": "A", "explanation": "Text" }]'
                  />

                  {jsonError && (
                    <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                      <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                      {jsonError}
                    </div>
                  )}

                  <button
                    onClick={handleImportJson}
                    disabled={!jsonInput.trim()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                  px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors
                  disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Upload size={15} /> Import Questions
                  </button>
                </div>
              )}
            </div>

            {/* ── Questions Preview ────────────────────────────────────────────── */}
            {questions.length > 0 && (
              <SectionCard
                title={`Questions Added (${questions.length})`}
                icon={Tag}
                accent="green"
              >
                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-xl p-4 bg-gray-50 relative group"
                    >
                      <button
                        onClick={() => removeQuestion(idx)}
                        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>

                      <p className="font-semibold text-gray-800 text-sm pr-8">
                        <span className="text-gray-400 mr-2">{idx + 1}.</span>
                        {q.text}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 mt-3">
                        {q.options.map((o, i) => (
                          <div
                            key={i}
                            className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5
                          ${
                            o === q.correctAnswer
                              ? "bg-green-100 text-green-700 font-semibold"
                              : "bg-white text-gray-500 border border-gray-100"
                          }`}
                          >
                            {o === q.correctAnswer && <CheckCircle size={11} />}
                            {String.fromCharCode(65 + i)}. {o}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400">
                          Marks: {q.marks}
                        </span>
                        {q.explanation && (
                          <span className="text-xs text-gray-400 truncate">
                            💡 {q.explanation}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setQuestions([])}
                  className="mt-4 text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Clear All Questions
                </button>
              </SectionCard>
            )}

            {/* ── Submit Button ────────────────────────────────────────────────── */}
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300
            disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold
            text-base transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Creating
                  Quiz...
                </>
              ) : (
                <>Create Quiz ({questions.length} Questions)</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuizCreate;
