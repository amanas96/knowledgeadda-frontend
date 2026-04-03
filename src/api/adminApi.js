import apiClient from "./axios";

// Analytics
export const getAnalytics = () => apiClient.get("/api/admin/analytics");

// Tickets
export const adminGetAllTickets = () => apiClient.get("/api/admin/tickets");
export const adminReplyToTicket = (ticketId, text) =>
  apiClient.post(`/api/admin/tickets/reply/${ticketId}`, { text });
export const adminCloseTicket = (id) =>
  apiClient.put(`/api/admin/tickets/close/${id}`);

// Courses
// export const adminCreateCourse = (data) =>
//   apiClient.post("/api/admin/courses", data);
export const adminCreateCourse = async (payload) => {
  const { data } = await apiClient.post("/api/admin/courses", payload);
  return data;
};

// export const adminUpdateCourse = (courseId, data) =>
//   apiClient.put(`/api/admin/courses/${courseId}`, data);
export const adminUpdateCourse = async (courseId, payload) => {
  const { data } = await apiClient.put(
    `/api/admin/courses/${courseId}`,
    payload,
  );
  return data;
};
// export const adminDeleteCourse = (courseId) =>
//   apiClient.delete(`/api/admin/courses/${courseId}`);
export const adminDeleteCourse = async (courseId) => {
  const { data } = await apiClient.delete(`/api/admin/courses/${courseId}`);
  return data;
};

// Content
export const adminAddContent = (courseId, formData) =>
  apiClient.post(`/api/admin/courses/${courseId}/content`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const adminDeleteContent = (courseId, contentId) =>
  apiClient.delete(`/api/admin/courses/${courseId}/content/${contentId}`);
export const adminAddAttachment = (courseId, contentId, formData) =>
  apiClient.post(
    `/api/admin/courses/${courseId}/content/${contentId}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

export const adminDeleteAttachment = (courseId, contentId, attachmentId) =>
  apiClient.delete(
    `/api/admin/courses/${courseId}/content/${contentId}/attachments/${attachmentId}`,
  );

// Quizzes

export const adminGetAllQuizzes = () => apiClient.get("/api/admin/quizzes");
export const adminGetSingleQuestion = (quizId, questionId) =>
  apiClient.get(`/api/admin/quizzes/${quizId}/questions/${questionId}`);
export const adminGetQuizDetails = (quizId) =>
  apiClient.get(`/api/admin/quizzes/${quizId}`);
export const adminGetQuizQuestions = (quizId) =>
  apiClient.get(`/api/admin/quizzes/${quizId}/questions?admin=true`);
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
export const adminAddQuestionToExistingQuiz = (quizId, data) =>
  apiClient.post(`/api/admin/quizzes/${quizId}/questions`, data);
export const adminUpdateQuestion = (quizId, questionId, data) =>
  apiClient.put(`/api/admin/quizzes/${quizId}/questions/${questionId}`, data);
export const adminDeleteQuestion = (quizId, questionId) =>
  apiClient.delete(`/api/admin/quizzes/${quizId}/questions/${questionId}`);

export const adminGetAllUsers = () => apiClient.get("/api/admin/users");

export const adminGetSubscribedUsers = () =>
  apiClient.get("/api/admin/subscriptions");
