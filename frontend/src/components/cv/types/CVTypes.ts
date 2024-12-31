export interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    details: string;
  }>;
  skills: string[];
} 