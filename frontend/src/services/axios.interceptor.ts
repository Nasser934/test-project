import axios from 'axios';
import { AuthService } from './auth.service';

// إنشاء نسخة مخصصة من axios
const axiosInstance = axios.create();

// اعتراض الطلبات الصادرة
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// اعتراض الردود الواردة
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 وليس طلب تجديد التوكن
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // محاولة تجديد التوكن
        const newToken = await AuthService.refreshToken();
        
        // تحديث التوكن في الطلب الأصلي وإعادة المحاولة
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // إذا فشل تجديد التوكن، نقوم بتسجيل الخروج
        await AuthService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 