export interface PasswordStrength {
  score: number; // 0-4
  messages: string[];
  isStrong: boolean;
}

export const validatePassword = (password: string): PasswordStrength => {
  const messages: string[] = [];
  let score = 0;

  // التحقق من الطول
  if (password.length < 8) {
    messages.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
  } else {
    score += 1;
  }

  // التحقق من وجود أحرف كبيرة
  if (!/[A-Z]/.test(password)) {
    messages.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  } else {
    score += 1;
  }

  // التحقق من وجود أرقام
  if (!/\d/.test(password)) {
    messages.push('يجب أن تحتوي على رقم واحد على الأقل');
  } else {
    score += 1;
  }

  // التحقق من وجود رموز خاصة
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    messages.push('يجب أن تحتوي على رمز خاص واحد على الأقل');
  } else {
    score += 1;
  }

  return {
    score,
    messages,
    isStrong: score >= 3,
  };
}; 