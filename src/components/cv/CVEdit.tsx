import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Box,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CVService } from '../../services/api/cvService';
import { CVData, Experience, Education } from '../../types/CVTypes';
import { CVSection } from './CVSection';
import { LoadingOverlay } from '../shared/LoadingOverlay';
import { ErrorMessage } from '../shared/ErrorMessage';

export const CVEdit: React.FC = () => {
  const navigate = useNavigate();
  const [cv, setCV] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const data = await CVService.getCVById();
        setCV(data);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل السيرة الذاتية');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  const handleSave = async () => {
    if (!cv) return;

    setSaving(true);
    try {
      await CVService.saveCV(cv);
      navigate('/');
    } catch (err) {
      setError('حدث خطأ أثناء حفظ السيرة الذاتية');
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    if (!cv) return;
    setCV({
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        [field]: value,
      },
    });
  };

  const updateSummary = (value: string) => {
    if (!cv) return;
    setCV({
      ...cv,
      summary: value,
    });
  };

  const addExperience = () => {
    if (!cv) return;
    const newExperience: Experience = {
      title: '',
      company: '',
      period: '',
      description: [''],
    };
    setCV({
      ...cv,
      experience: [...cv.experience, newExperience],
    });
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    if (!cv) return;
    const updatedExperience = [...cv.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    setCV({
      ...cv,
      experience: updatedExperience,
    });
  };

  const removeExperience = (index: number) => {
    if (!cv) return;
    setCV({
      ...cv,
      experience: cv.experience.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    if (!cv) return;
    const newEducation: Education = {
      degree: '',
      institution: '',
      period: '',
      details: '',
    };
    setCV({
      ...cv,
      education: [...cv.education, newEducation],
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    if (!cv) return;
    const updatedEducation = [...cv.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setCV({
      ...cv,
      education: updatedEducation,
    });
  };

  const removeEducation = (index: number) => {
    if (!cv) return;
    setCV({
      ...cv,
      education: cv.education.filter((_, i) => i !== index),
    });
  };

  const updateSkills = (value: string) => {
    if (!cv) return;
    setCV({
      ...cv,
      skills: value.split(',').map((skill) => skill.trim()),
    });
  };

  if (loading || saving) {
    return <LoadingOverlay open={loading || saving} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!cv) {
    return <ErrorMessage message="لم يتم العثور على السيرة الذاتية" />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          رجوع
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          حفظ
        </Button>
      </Box>

      <CVSection title="المعلومات الشخصية">
        <Stack spacing={2}>
          <TextField
            label="الاسم الكامل"
            value={cv.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
          />
          <TextField
            label="المسمى الوظيفي"
            value={cv.personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
          />
          <TextField
            label="البريد الإلكتروني"
            value={cv.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
          />
          <TextField
            label="رقم الهاتف"
            value={cv.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
          />
          <TextField
            label="الموقع"
            value={cv.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
          />
        </Stack>
      </CVSection>

      <CVSection title="الملخص">
        <TextField
          multiline
          rows={4}
          value={cv.summary}
          onChange={(e) => updateSummary(e.target.value)}
        />
      </CVSection>

      <CVSection title="الخبرات">
        {cv.experience.map((exp, index) => (
          <Box key={index} sx={{ mb: 4, position: 'relative' }}>
            <IconButton
              sx={{ position: 'absolute', top: 0, left: 0 }}
              onClick={() => removeExperience(index)}
            >
              <DeleteIcon />
            </IconButton>
            <Stack spacing={2}>
              <TextField
                label="المسمى الوظيفي"
                value={exp.title}
                onChange={(e) => updateExperience(index, 'title', e.target.value)}
              />
              <TextField
                label="الشركة"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
              />
              <TextField
                label="الفترة"
                value={exp.period}
                onChange={(e) => updateExperience(index, 'period', e.target.value)}
              />
              <TextField
                label="الوصف"
                multiline
                rows={4}
                value={exp.description.join('\n')}
                onChange={(e) =>
                  updateExperience(
                    index,
                    'description',
                    e.target.value.split('\n').filter((line) => line.trim())
                  )
                }
              />
            </Stack>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={addExperience}>
          إضافة خبرة
        </Button>
      </CVSection>

      <CVSection title="التعليم">
        {cv.education.map((edu, index) => (
          <Box key={index} sx={{ mb: 4, position: 'relative' }}>
            <IconButton
              sx={{ position: 'absolute', top: 0, left: 0 }}
              onClick={() => removeEducation(index)}
            >
              <DeleteIcon />
            </IconButton>
            <Stack spacing={2}>
              <TextField
                label="الدرجة العلمية"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              />
              <TextField
                label="المؤسسة التعليمية"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              />
              <TextField
                label="الفترة"
                value={edu.period}
                onChange={(e) => updateEducation(index, 'period', e.target.value)}
              />
              <TextField
                label="التفاصيل"
                value={edu.details}
                onChange={(e) => updateEducation(index, 'details', e.target.value)}
              />
            </Stack>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={addEducation}>
          إضافة تعليم
        </Button>
      </CVSection>

      <CVSection title="المهارات">
        <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
          أدخل المهارات مفصولة بفواصل
        </Typography>
        <TextField
          multiline
          rows={4}
          value={cv.skills.join(', ')}
          onChange={(e) => updateSkills(e.target.value)}
        />
      </CVSection>
    </Container>
  );
}; 