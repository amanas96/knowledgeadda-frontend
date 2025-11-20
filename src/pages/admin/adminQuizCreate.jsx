import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import { createQuiz, addQuestionToQuiz } from "../../api/quizApi";

import apiClient from "../../api/axios"; // for loading courses only

const AdminQuizCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preSelectedCourseId = searchParams.get("courseId");

  // Quiz details state
  const [quizData, setQuizData] = useState({
    title: "",
    courseId: preSelectedCourseId || "",
    timeLimit: "",
    totalMarks: "",
    isPremium: true,
    category: "General",
  });

  // Course list for dropdown
  const [courses, setCourses] = useState([]);

  // Question builder state
  const [questions, setQuestions] = useState([]);

  const [questionForm, setQuestionForm] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: 1,
  });

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --------------------------------------------------------------------
  // Load all courses for admin dropdown
  // --------------------------------------------------------------------
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

  // --------------------------------------------------------------------
  // Handle quiz input changes
  // --------------------------------------------------------------------
  const handleQuizChange = (e) => {
    const { name, value, checked, type } = e.target;
    setQuizData({
      ...quizData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // --------------------------------------------------------------------
  // Handle question form changes
  // --------------------------------------------------------------------
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm({
      ...questionForm,
      [name]: value,
    });
  };

  // --------------------------------------------------------------------
  // Add question to list
  // --------------------------------------------------------------------
  const addQuestion = () => {
    const { text, optionA, optionB, optionC, optionD } = questionForm;

    if (!text || !optionA || !optionB || !optionC || !optionD) {
      alert("Please fill all question fields.");
      return;
    }

    const newQuestion = {
      text,
      options: [optionA, optionB, optionC, optionD],
      correctAnswer: questionForm.correctAnswer,
      marks: questionForm.marks,
    };

    setQuestions([...questions, newQuestion]);

    // Clear form
    setQuestionForm({
      text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      marks: 1,
    });
  };

  // --------------------------------------------------------------------
  // Submit quiz + all questions
  // --------------------------------------------------------------------
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
      // STEP 1 — Create Quiz
      const quizRes = await createQuiz(quizData);
      const quizId = quizRes.data._id;

      // STEP 2 — Add every question
      for (const q of questions) {
        await addQuestionToQuiz(quizId, q);
      }

      alert("Quiz created successfully!");
      navigate(`/admin/courses`);
    } catch (err) {
      console.error(err);

      const msg =
        err?.response?.data?.message || "Failed to create quiz. Try again.";

      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/admin/courses"
        className="text-blue-600 hover:underline text-sm"
      >
        &larr; Back
      </Link>

      <h1 className="text-3xl font-bold text-gray-800">Create New Quiz</h1>

      {/* --------------------------------------------------------------- */}
      {/* QUIZ DETAILS FORM */}
      {/* --------------------------------------------------------------- */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>

        {loadingCourses ? (
          <p>Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
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

            {/* Course */}
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

            {/* Category */}
            <div>
              <label className="font-medium">Category</label>
              <select
                name="category"
                value={quizData.category}
                onChange={handleQuizChange}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="General">General</option>
                <option value="Polity">Polity</option>
                <option value="Geography"> Geography</option>
                <option value="Science">Science</option>
                <option value="Economy">Economy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Time Limit */}
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

            {/* Total Marks */}
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

            {/* Premium */}
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

      {/* --------------------------------------------------------------- */}
      {/* QUESTION BUILDER FORM */}
      {/* --------------------------------------------------------------- */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">Add Question</h2>

        {/* Question Text */}
        <label className="font-medium">Question</label>
        <input
          type="text"
          name="text"
          value={questionForm.text}
          onChange={handleQuestionChange}
          className="w-full border p-2 rounded mb-4 mt-1"
        />

        {/* Options A-D */}
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

        {/* Correct Answer */}
        <div className="mt-4">
          <label className="font-medium">Correct Answer</label>
          <select
            name="correctAnswer"
            value={questionForm.correctAnswer}
            onChange={handleQuestionChange}
            className="border p-2 rounded ml-3"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <button
          onClick={addQuestion}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add Question
        </button>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* ADDED QUESTIONS PREVIEW */}
      {/* --------------------------------------------------------------- */}
      {questions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Questions Added</h2>

          <ul className="space-y-3">
            {questions.map((q, idx) => (
              <li key={idx} className="p-3 border rounded bg-gray-50">
                <strong>
                  {idx + 1}. {q.text}
                </strong>

                <ul className="list-disc ml-5 text-sm">
                  {q.options.map((o, i) => (
                    <li key={i}>
                      {String.fromCharCode(65 + i)}. {o}
                    </li>
                  ))}
                </ul>

                <p className="text-green-700 text-sm font-medium mt-1">
                  ✔ Correct: {q.correctAnswer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --------------------------------------------------------------- */}
      {/* SUBMIT BUTTON */}
      {/* --------------------------------------------------------------- */}
      <button
        onClick={handleSubmitQuiz}
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 text-lg rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
      </button>
    </div>
  );
};

export default AdminQuizCreate;
