import apiClient from "../api/axios";

// ===============================
// GET ALL COURSES (Pagination)
// ===============================
export const getCourses = async ({ page = 1, limit = 6, signal }) => {
  const { data } = await apiClient.get("/api/v1/courses", {
    signal,
    params: {
      page,
      limit,
      sortBy: "createdAt",
      order: "desc",
    },
  });

  return data;
};

// ===============================
// GET SINGLE COURSE
// ===============================
export const getCourseById = async (courseId, signal) => {
  const { data } = await apiClient.get(`/api/v1/courses/${courseId}`, {
    signal,
  });
  return data;
};

export const getCourseByIdforCourse = (courseId) =>
  apiClient.get(`/api/v1/courses/${courseId}`);

export const getCourseContent = (courseId) =>
  apiClient.get(`/api/v1/courses/${courseId}/content`);

export const getCourseQuizzes = (courseId) =>
  apiClient.get(`/api/v1/quizzes/course/${courseId}`);

// ===============================
// CREATE COURSE (Admin)
// ===============================
export const adminCreateCourse = async (payload) => {
  const { data } = await apiClient.post("/api/admin/courses", payload);
  return data;
};

// ===============================
// UPDATE COURSE
// ===============================
export const updateCourse = async (courseId, payload) => {
  const { data } = await apiClient.put(
    `/api/admin/courses/${courseId}`,
    payload,
  );
  return data;
};

// ===============================
// DELETE COURSE
// ===============================
export const adminDeleteCourse = async (courseId) => {
  const { data } = await apiClient.delete(`/api/admin/courses/${courseId}`);
  return data;
};
