import CryptoJS from 'crypto-js';

export class EncryptionService {
  private static readonly SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key';

  static encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonString, this.SECRET_KEY).toString();
    } catch (error) {
      throw new Error('فشل في تشفير البيانات');
    }
  }

  static decrypt(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      throw new Error('فشل في فك تشفير البيانات');
    }
  }

  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  static generateKey(): string {
    return CryptoJS.lib.WordArray.random(16).toString();
  }
} 