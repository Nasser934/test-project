import { CVData } from '../../types/CVTypes';

export const CVService = {
  async getCVById(): Promise<CVData> {
    // TODO: استبدل هذا بطلب API حقيقي
    return Promise.resolve({
      personalInfo: {
        fullName: 'اسم تجريبي',
        title: 'مطور برمجيات',
        email: 'example@example.com',
        phone: '+1234567890',
        location: 'المدينة، البلد',
      },
      summary: 'ملخص تجريبي للسيرة الذاتية',
      experience: [
        {
          title: 'مطور برمجيات',
          company: 'شركة تجريبية',
          period: '2020 - الحالي',
          description: ['مسؤول عن تطوير تطبيقات الويب'],
        },
      ],
      education: [
        {
          degree: 'بكالوريوس علوم الحاسب',
          institution: 'جامعة تجريبية',
          period: '2016 - 2020',
          details: 'تخصص في هندسة البرمجيات',
        },
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    });
  },

  async saveCV(cv: CVData): Promise<void> {
    // TODO: استبدل هذا بطلب API حقيقي
    console.log('Saving CV:', cv);
    return Promise.resolve();
  },
}; 