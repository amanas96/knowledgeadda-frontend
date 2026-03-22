import apiClient from "./axios";

export const enrollInCourse = (courseId) =>
  apiClient.post(`/api/v1/courses/${courseId}/enroll`);

export const unenrollFromCourse = (courseId) =>
  apiClient.delete(`/api/v1/courses/${courseId}/enroll`);

export const getEnrollmentStatus = (courseId) =>
  apiClient.get(`/api/v1/courses/${courseId}/enroll`);

export const getMyEnrollments = () =>
  apiClient.get(`/api/v1/users/my-enrollments`);
