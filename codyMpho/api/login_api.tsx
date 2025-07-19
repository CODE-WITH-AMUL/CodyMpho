import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse, ApiErrorResponse } from './types';

const API_BASE_URL = 'http://127.0.0.1:8000/auth/api';

export const loginUser = async (
  emailOrUsername: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const isEmail = emailOrUsername.includes('@');
    const payload = isEmail 
      ? { email: emailOrUsername, password }
      : { username: emailOrUsername, password };

    const response = await axios.post(`${API_BASE_URL}/login/`, payload);
    
    if (response.data.token) {
      await SecureStore.setItemAsync('authToken', response.data.token);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw { message: 'Network error. Please try again.' };
  }
};

export const verifyAuth = async (): Promise<boolean> => {
  const token = await SecureStore.getItemAsync('authToken');
  return !!token; // Simple check - expand with API call if needed
};

export const logoutUser = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('authToken');
};