import api from '@/services/route';

export const searchApi = async (query: string) => {
  const res = await api.get('/search', {
    params: {
      q: query,
      page: 0,
      size: 3,
    },
  });
  return res.data;
};
