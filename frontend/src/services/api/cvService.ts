import axios from 'axios';
import { CVData } from '../../components/cv/types/CVTypes';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export class CVService {
  static async getCVById(cvId: string): Promise<CVData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/cv/${cvId}`);
      return response.data;
    } catch (error) {
      throw new Error('فشل في تحميل السيرة الذاتية');
    }
  }

  static async saveCV(cvData: CVData): Promise<CVData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/cv`, cvData);
      return response.data;
    } catch (error) {
      throw new Error('فشل في حفظ السيرة الذاتية');
    }
  }

  static async updateCV(cvId: string, cvData: CVData): Promise<CVData> {
    try {
      const response = await axios.put(`${API_BASE_URL}/cv/${cvId}`, cvData);
      return response.data;
    } catch (error) {
      throw new Error('فشل في تحديث السيرة الذاتية');
    }
  }

  static async deleteCV(cvId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/cv/${cvId}`);
    } catch (error) {
      throw new Error('فشل في حذف السيرة الذاتية');
    }
  }
} 