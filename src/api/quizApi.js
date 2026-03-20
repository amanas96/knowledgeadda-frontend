import apiClient from "./axios";

// ── Public ──────────────────────────────────────────────────

export const getAllQuizzes = (limit = 6) =>
  apiClient.get(`/api/v1/quizzes?limit=${limit}`);

// Renamed and updated to handle the generic slugOrId
export const getQuizBySlugOrId = (slugOrId) =>
  apiClient.get(`/api/v1/quizzes/slug/${slugOrId}`);

// Updated quizId -> slugOrId
export const getQuizById = (slugOrId) =>
  apiClient.get(`/api/v1/quizzes/${slugOrId}`);

export const getQuizzesForCourse = (courseId) =>
  apiClient.get(`/api/v1/quizzes/course/${courseId}`);

// ── Protected (token auto-attached by apiClient) ─────────────

export const getQuizQuestions = (slugOrId) =>
  apiClient.get(`/api/v1/quizzes/${slugOrId}/questions`);

export const getQuizAttemptStatus = (slugOrId) =>
  apiClient.get(`/api/v1/quizzes/${slugOrId}/attempt-status`);

export const submitQuiz = (slugOrId, answers, timeTaken = 0) =>
  apiClient.post(`/api/v1/quizzes/${slugOrId}/submit`, { answers, timeTaken });

// Fixed the 404 error syntax here
export const reviewQuiz = (slugOrId) =>
  apiClient.get(`/api/v1/quizzes/${slugOrId}/review`);

// ── Admin ────────────────────────────────────────────────────

export const createQuiz = (quizData) =>
  apiClient.post(`/api/v1/quizzes`, quizData);

export const updateQuiz = (slugOrId, payload) =>
  apiClient.put(`/api/v1/quizzes/${slugOrId}`, payload);

export const deleteQuiz = (slugOrId) =>
  apiClient.delete(`/api/v1/quizzes/${slugOrId}`);

export const addQuestionToQuiz = (slugOrId, questionData) =>
  apiClient.post(`/api/v1/quizzes/${slugOrId}/questions`, questionData);

export const adminGetQuizQuestions = (slugOrId) =>
  apiClient.get(`/api/v1/quizzes/${slugOrId}/questions?admin=true`);

export const updateQuestion = (slugOrId, questionId, payload) =>
  apiClient.put(`/api/v1/quizzes/${slugOrId}/questions/${questionId}`, payload);

export const deleteQuestion = (slugOrId, questionId) =>
  apiClient.delete(`/api/v1/quizzes/${slugOrId}/questions/${questionId}`);
