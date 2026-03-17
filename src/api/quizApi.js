import apiClient from "./axios";

// ── Public ──────────────────────────────────────────────────

export const getAllQuizzes = (limit = 6) =>
  apiClient.get(`/api/v1/quizzes?limit=${limit}`);

export const getQuizById = (quizId) =>
  apiClient.get(`/api/v1/quizzes/${quizId}`);

export const getQuizzesForCourse = (courseId) =>
  apiClient.get(`/api/v1/quizzes/course/${courseId}`);

// ── Protected (token auto-attached by apiClient) ─────────────

export const getQuizQuestions = (quizId) =>
  apiClient.get(`/api/v1/quizzes/${quizId}/questions`);

export const getQuizAttemptStatus = (quizId) =>
  apiClient.get(`/api/v1/quizzes/${quizId}/attempt-status`);

export const submitQuiz = (quizId, answers, timeTaken = 0) =>
  apiClient.post(`/api/v1/quizzes/${quizId}/submit`, { answers, timeTaken });

export const reviewQuiz = (quizId) =>
  apiClient.get(`/api/v1/quizzes/${quizId}/review`);

// ── Admin ────────────────────────────────────────────────────

export const createQuiz = (quizData) =>
  apiClient.post(`/api/v1/quizzes`, quizData);

export const updateQuiz = (quizId, payload) =>
  apiClient.put(`/api/v1/quizzes/${quizId}`, payload);

export const deleteQuiz = (quizId) =>
  apiClient.delete(`/api/v1/quizzes/${quizId}`);

export const addQuestionToQuiz = (quizId, questionData) =>
  apiClient.post(`/api/v1/quizzes/${quizId}/questions`, questionData);

export const adminGetQuizQuestions = (quizId) =>
  apiClient.get(`/api/v1/quizzes/${quizId}/questions?admin=true`);

export const updateQuestion = (quizId, questionId, payload) =>
  apiClient.put(`/api/v1/quizzes/${quizId}/questions/${questionId}`, payload);

export const deleteQuestion = (quizId, questionId) =>
  apiClient.delete(`/api/v1/quizzes/${quizId}/questions/${questionId}`);
