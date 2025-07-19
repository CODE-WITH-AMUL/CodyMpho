export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  non_field_errors?: string[];
  email?: string[];
  username?: string[];
  password?: string[];
  password2?: string[];
}

export interface UserData {
  id: number;
  email: string;
  username: string;
}

export interface AuthResponse {
  message: string;
  user: UserData;
  token: string;
}