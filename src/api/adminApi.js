import apiClient from "./axios";

// Analytics
export const getAnalytics = () => apiClient.get("/api/admin/analytics");

// Tickets
export const adminGetAllTickets = () => apiClient.get("/api/admin/tickets");
export const adminReplyToTicket = (id, message) =>
  apiClient.post(`/api/admin/tickets/reply/${id}`, { message });
export const adminCloseTicket = (id) =>
  apiClient.put(`/api/admin/tickets/close/${id}`);

// Courses
export const adminCreateCourse = (data) =>
  apiClient.post("/api/admin/courses", data);
export const adminUpdateCourse = (courseId, data) =>
  apiClient.put(`/api/admin/courses/${courseId}`, data);
export const adminDeleteCourse = (courseId) =>
  apiClient.delete(`/api/admin/courses/${courseId}`);

// Content
export const adminAddContent = (courseId, formData) =>
  apiClient.post(`/api/admin/courses/${courseId}/content`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const adminDeleteContent = (courseId, contentId) =>
  apiClient.delete(`/api/admin/courses/${courseId}/content/${contentId}`);

// Quizzes
export const adminCreateQuiz = (data) =>
  apiClient.post("/api/admin/quizzes", data);
export const adminUpdateQuiz = (quizId, data) =>
  apiClient.put(`/api/admin/quizzes/${quizId}`, data);
export const adminDeleteQuiz = (quizId) =>
  apiClient.delete(`/api/admin/quizzes/${quizId}`);
export const adminGetQuizzesByCourse = (courseId) =>
  apiClient.get(`/api/admin/quizzes/course/${courseId}`);

// Questions
export const adminAddQuestion = (quizId, data) =>
  apiClient.post(`/api/admin/quizzes/${quizId}/questions`, data);
export const adminUpdateQuestion = (quizId, questionId, data) =>
  apiClient.put(`/api/admin/quizzes/${quizId}/questions/${questionId}`, data);
export const adminDeleteQuestion = (quizId, questionId) =>
  apiClient.delete(`/api/admin/quizzes/${quizId}/questions/${questionId}`);

export const adminGetAllUsers = () => apiClient.get("/api/admin/users");

export const adminGetSubscribedUsers = () =>
  apiClient.get("/api/admin/subscriptions");
