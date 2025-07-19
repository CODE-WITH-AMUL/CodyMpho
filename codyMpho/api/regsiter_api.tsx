import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse } from './types';

const API_BASE_URL = 'http://127.0.0.1:8000/auth/api';

export const registerUser = async (
  email: string,
  username: string,
  password: string,
  password2: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, {
      email,
      username,
      password,
      password2
    });

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