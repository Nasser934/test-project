import axios from 'axios';
import { LoginCredentials, RegisterData, User } from '../types/auth.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface LoginAttempt {
  timestamp: number;
  ip: string;
  success: boolean;
}

interface DeviceInfo {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  lastUsed: string;
  isTrusted: boolean;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل تسجيل الدخول');
    }
  }

  static async register(data: RegisterData): Promise<{ user: User; token: string }> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل إنشاء الحساب');
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل جلب بيانات المستخدم');
    }
  }

  static async refreshToken(): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`);
      const { token } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return token;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل تحديث رمز الدخول');
    }
  }

  static async updateProfile(data: {
    fullName: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل تحديث الملف الشخصي');
    }
  }

  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل إرسال رابط إعادة تعيين كلمة المرور');
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل إعادة تعيين كلمة المرور');
    }
  }

  static async getLoginAttempts(): Promise<LoginAttempt[]> {
    try {
      const response = await axios.get(`${API_URL}/auth/login-attempts`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل جلب محاولات تسجيل الدخول');
    }
  }

  static async lockAccount(userId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/lock-account`, { userId });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل قفل الحساب');
    }
  }

  static async unlockAccount(userId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/unlock-account`, { userId });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل فتح الحساب');
    }
  }

  static async getTrustedDevices(): Promise<DeviceInfo[]> {
    try {
      const response = await axios.get(`${API_URL}/auth/devices`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل جلب الأجهزة الموثوقة');
    }
  }

  static async trustDevice(deviceId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/devices/trust`, { deviceId });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل توثيق الجهاز');
    }
  }

  static async removeTrustedDevice(deviceId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/auth/devices/${deviceId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'فشل إزالة الجهاز الموثوق');
    }
  }
} 