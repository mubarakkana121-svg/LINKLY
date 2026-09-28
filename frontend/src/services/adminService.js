import api from './api';

export const getStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAllFiles = async () => {
  const response = await api.get('/admin/files');
  return response.data;
};

export const deleteAdminFile = async (fileId) => {
  const response = await api.delete(`/admin/files/${fileId}`);
  return response.data;
};