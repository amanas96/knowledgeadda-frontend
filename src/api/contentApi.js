// api/contentApi.js
import apiClient from "./axios";

export const getSignedUrl = (courseId, contentId) =>
  apiClient.get(`/api/v1/courses/${courseId}/content/${contentId}/signed-url`);
