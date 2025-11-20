import apiClient from "./axios";

// Get all quizzes for a course
export const getQuizzesForCourse = (courseId, token) =>
  apiClient.get(`/api/v1/quizzes/course/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getAllQuizzes = () => apiClient.get("/api/v1/quizzes");
// Get quiz questions
export const getQuizQuestions = (quizId, token) =>
  apiClient.get(`/api/v1/quizzes/${quizId}/questions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Submit quiz
export const submitQuiz = (quizId, answers, token) =>
  apiClient.post(
    `/api/v1/quizzes/${quizId}/submit`,
    { answers },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// Review quiz
export const reviewQuiz = (quizId, token) =>
  apiClient.get(`/api/v1/quizzes/${quizId}/review`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default apiClient;

/* -------------------------------------------------------------
   ADMIN QUIZ APIS
------------------------------------------------------------- */

// Create quiz (admin)
export const createQuiz = (quizData) =>
  apiClient.post(`/api/v1/quizzes`, quizData);

// Add question to quiz (admin)
export const addQuestionToQuiz = (quizId, questionData) =>
  apiClient.post(`/api/v1/quizzes/${quizId}/questions`, questionData);

// Get questions WITH correct answers (for admin)
export const adminGetQuizQuestions = (quizId) =>
  apiClient.get(`/api/v1/quizzes/${quizId}/questions?admin=true`);

// Delete quiz (admin)
export const deleteQuiz = (quizId) =>
  apiClient.delete(`/api/v1/quizzes/${quizId}`);

// Update quiz (admin)
export const updateQuiz = (quizId, data) =>
  apiClient.put(`/api/v1/quizzes/${quizId}`, data);

// Delete a question (admin)
export const deleteQuestion = (quizId, questionId) =>
  apiClient.delete(`/api/v1/quizzes/${quizId}/questions/${questionId}`);
