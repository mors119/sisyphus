import api from '@/services/route';

// 더미 API 호출
export const fetchDummyApi = () => api.post('/dev/note/seed');
