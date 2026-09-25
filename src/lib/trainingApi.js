import api from './api';

const trainingApi = {
  // Get all active lessons
  getLessons: async () => {
    const response = await api.get('/training/lessons');
    return response.data;
  },

  // Get a specific lesson
  getLesson: async (lessonId) => {
    const response = await api.get(`/training/lessons/${lessonId}`);
    return response.data;
  },

  // Get caregiver's progress for all lessons
  getProgress: async () => {
    const response = await api.get('/training/progress');
    return response.data;
  },

  // Get progress for a specific lesson
  getLessonProgress: async (lessonId) => {
    const response = await api.get(`/training/progress/${lessonId}`);
    return response.data;
  },

  // Start a lesson
  startLesson: async (lessonId) => {
    const response = await api.post(`/training/progress/${lessonId}/start`);
    return response.data;
  },

  // Submit assessment
  submitAssessment: async (lessonId, answers, timeSpent) => {
    const response = await api.post(`/training/progress/${lessonId}/submit`, {
      answers,
      timeSpent
    });
    return response.data;
  },

  // Get caregiver's certificates
  getCertificates: async () => {
    const response = await api.get('/training/certificates');
    return response.data;
  },

  // Get a specific certificate
  getCertificate: async (certificateId) => {
    const response = await api.get(`/training/certificates/${certificateId}`);
    return response.data;
  },

  // Verify certificate by number
  verifyCertificate: async (certificateNumber) => {
    const response = await api.get(`/training/verify/${certificateNumber}`);
    return response.data;
  },

  // Admin: Get all lessons
  adminGetLessons: async () => {
    const response = await api.get('/training/admin/lessons');
    return response.data;
  },

  // Admin: Get training statistics
  adminGetStats: async () => {
    const response = await api.get('/training/admin/stats');
    return response.data;
  },

  // Admin: Get caregiver training progress
  adminGetCaregiverProgress: async (caregiverId) => {
    const response = await api.get(`/training/admin/caregiver/${caregiverId}/progress`);
    return response.data;
  }
};

export default trainingApi;
