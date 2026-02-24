import api from '../utils/axios';

export const quizService = {
  // Lấy đề bài quiz đang hoạt động
  getQuestions: async () => {
    return await api.get('/skin-quiz/active');
  },
  
  // Nộp bài quiz (Chỉ gửi danh sách Answer IDs)
  submitQuiz: async (payload: { answerIds: string[] }) => {
    return await api.post('/skin-quiz/submit', payload);
  },

  // Lấy thông tin hồ sơ da sau khi phân tích
  getMyProfile: async () => {
    return await api.get('/skin-profile');
  }
};