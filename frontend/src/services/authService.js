import api from './api';

export const register = async (name, email, password, passwordConfirmation) => {
  const response = await api.post('/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/user');
  return response.data;
};