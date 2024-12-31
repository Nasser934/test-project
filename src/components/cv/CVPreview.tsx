import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CVService } from '../../services/api/cvService';
import { CVData } from '../../types/CVTypes';
import { CVSection } from './CVSection';
import { LoadingOverlay } from '../shared/LoadingOverlay';
import { ErrorMessage } from '../shared/ErrorMessage';

export const CVPreview: React.FC = () => {
  const navigate = useNavigate();
  const [cv, setCV] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <LoadingOverlay open={loading} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!cv) {
    return <ErrorMessage message="لم يتم العثور على السيرة الذاتية" />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate('/edit')}
        >
          تعديل السيرة الذاتية
        </Button>
      </Box>

      <CVSection title="المعلومات الشخصية">
        <Typography variant="h4" gutterBottom>
          {cv.personalInfo.fullName}
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {cv.personalInfo.title}
        </Typography>
        <Typography>{cv.personalInfo.email}</Typography>
        <Typography>{cv.personalInfo.phone}</Typography>
        <Typography>{cv.personalInfo.location}</Typography>
      </CVSection>

      <CVSection title="الملخص">
        <Typography>{cv.summary}</Typography>
      </CVSection>

      <CVSection title="الخبرات">
        <List>
          {cv.experience.map((exp, index) => (
            <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h6">{exp.title}</Typography>
              <Typography color="primary">{exp.company}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {exp.period}
              </Typography>
              <List>
                {exp.description.map((desc, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={desc} />
                  </ListItem>
                ))}
              </List>
            </ListItem>
          ))}
        </List>
      </CVSection>

      <CVSection title="التعليم">
        <List>
          {cv.education.map((edu, index) => (
            <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h6">{edu.degree}</Typography>
              <Typography color="primary">{edu.institution}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {edu.period}
              </Typography>
              <Typography>{edu.details}</Typography>
            </ListItem>
          ))}
        </List>
      </CVSection>

      <CVSection title="المهارات">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {cv.skills.map((skill, index) => (
            <Chip key={index} label={skill} sx={{ m: 0.5 }} />
          ))}
        </Stack>
      </CVSection>
    </Container>
  );
}; 