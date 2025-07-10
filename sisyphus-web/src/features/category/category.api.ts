import api from '@/services/route';
import { CategoryForm } from './category.types';

// Category 전체 보기
export const fetchCategories = async () => {
  const res = await api.get('/category/all');
  return res.data;
};

// Category create
export const createCategory = async (data: CategoryForm) => {
  const res = await api.post('/category/create', data);
  return res.data;
};

// Category delete
export const deleteCategory = async (categoryId: number) => {
  await api.delete(`/category/delete/${categoryId}`);
};

// Category update
export const updateCategory = (id: number, data: CategoryForm) => {
  return api.put(`/category/update/${id}`, data);
};
