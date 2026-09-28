import api from './api';
import { API_URL } from './api';

export const uploadFile = async (file, onProgress, expiresIn = 'never') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('expires_in', expiresIn);

  const response = await api.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

  return response.data;
};

export const getFiles = async () => {
  const response = await api.get('/files');
  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await api.delete(`/files/${fileId}`);
  return response.data;
};

export const getSharedFile = async (token) => {
  const response = await api.get(`/share/${token}`);
  return response.data;
};

export const getDownloadUrl = (token) => {
  return `${API_URL}/share/${token}/download`;
};
