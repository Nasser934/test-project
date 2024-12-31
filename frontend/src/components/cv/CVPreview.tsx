import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { CVService } from '../../services/api/cvService';
import { LoadingOverlay } from '../shared/LoadingOverlay';
import {
  Container,
  Paper,
  Typography,
  makeStyles,
  Grid,
  Divider,
  IconButton,
  Button,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  GetApp as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
} from '@material-ui/icons';
import { CVSection } from './CVSection';
import { CVEdit } from './CVEdit';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(2),
    position: 'relative',
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  actions: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  sectionTitle: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  previewContainer: {
    backgroundColor: '#fff',
    padding: theme.spacing(4),
    boxShadow: theme.shadows[1],
  },
}));

interface CVData {
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

// بيانات تجريبية
const sampleCV: CVData = {
  personalInfo: {
    fullName: "أحمد محمد",
    title: "مطور واجهات أمامية",
    email: "ahmed@example.com",
    phone: "+966 50 123 4567",
    location: "الرياض، المملكة العربية السعودية"
  },
  summary: "مطور واجهات أمامية ذو خبرة 5 سنوات في تطوير تطبيقات الويب باستخدام React وTypeScript. متخصص في بناء واجهات مستخدم سريعة وسهلة الاستخدام مع التركيز على أفضل الممارسات وقابلية التوسع.",
  experience: [
    {
      title: "مطور واجهات أمامية أول",
      company: "شركة التقنية المتقدمة",
      period: "2020 - الحالي",
      description: [
        "قيادة فريق من 5 مطورين في تطوير منصة تعليمية",
        "تحسين أداء التطبيق بنسبة 40%",
        "تنفيذ أفضل ممارسات التطوير وأتمتة الاختبارات"
      ]
    }
  ],
  education: [
    {
      degree: "بكالوريوس علوم الحاسب",
      institution: "جامعة الملك سعود",
      period: "2015 - 2019",
      details: "تخصص في هندسة البرمجيات"
    }
  ],
  skills: [
    "React", "TypeScript", "Node.js", "GraphQL",
    "Material-UI", "Jest", "Git", "Agile"
  ]
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const CVPreview: React.FC = () => {
  const { cvId } = useParams<{ cvId: string }>();
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadCV = async (retryAttempt = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await CVService.getCVById(cvId);
      setCVData(data);
      setRetryCount(0);
    } catch (err) {
      console.error('Error loading CV:', err);
      if (retryAttempt < MAX_RETRIES) {
        setTimeout(() => {
          loadCV(retryAttempt + 1);
        }, RETRY_DELAY * Math.pow(2, retryAttempt));
        setRetryCount(retryAttempt + 1);
      } else {
        setError(`حدث خطأ أثناء تحميل السيرة الذاتية. ${err instanceof Error ? err.message : ''}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData: CVData) => {
    try {
      setLoading(true);
      setError(null);
      if (cvId) {
        await CVService.updateCV(cvId, updatedData);
      } else {
        await CVService.saveCV(updatedData);
      }
      setCVData(updatedData);
      setIsEditing(false);
      setSuccessMessage('تم حفظ السيرة الذاتية بنجاح');
      setRetryCount(0);
    } catch (err) {
      console.error('Error saving CV:', err);
      setError(`حدث خطأ أثناء حفظ السيرة الذاتية. ${err instanceof Error ? err.message : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorClose = () => {
    setError(null);
  };

  const handleSuccessClose = () => {
    setSuccessMessage(null);
  };

  useEffect(() => {
    if (cvId) {
      loadCV();
    }
  }, [cvId]);

  if (loading) {
    return <LoadingOverlay open={true} />;
  }

  if (!cvData) {
    return <Typography>لم يتم العثور على السيرة الذاتية</Typography>;
  }

  if (isEditing) {
    return <CVEdit initialData={cvData} onSave={handleSave} />;
  }

  return (
    <Container className={classes.root}>
      {retryCount > 0 && (
        <Alert severity="info" style={{ marginBottom: '1rem' }}>
          جاري إعادة المحاولة... المحاولة {retryCount} من {MAX_RETRIES}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <div className={classes.actions}>
              <IconButton size="small" title="تعديل" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" title="تحميل">
                <DownloadIcon />
              </IconButton>
              <IconButton size="small" title="مشاركة">
                <ShareIcon />
              </IconButton>
              <IconButton size="small" title="طباعة">
                <PrintIcon />
              </IconButton>
            </div>

            <div className={classes.previewContainer}>
              {/* المعلومات الشخصية */}
              <CVSection title="المعلومات الشخصية">
                <Typography variant="h4" gutterBottom>
                  {cvData.personalInfo.fullName}
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {cvData.personalInfo.title}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography>{cvData.personalInfo.email}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{cvData.personalInfo.phone}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{cvData.personalInfo.location}</Typography>
                  </Grid>
                </Grid>
              </CVSection>

              <Divider className={classes.divider} />

              {/* الملخص */}
              <CVSection title="الملخص">
                <Typography>{cvData.summary}</Typography>
              </CVSection>

              <Divider className={classes.divider} />

              {/* الخبرات */}
              <CVSection title="الخبرات المهنية">
                {cvData.experience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <Typography variant="h6">{exp.title}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {exp.company} | {exp.period}
                    </Typography>
                    <ul>
                      {exp.description.map((desc, i) => (
                        <li key={i}>
                          <Typography>{desc}</Typography>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CVSection>

              <Divider className={classes.divider} />

              {/* التعليم */}
              <CVSection title="التعليم">
                {cvData.education.map((edu, index) => (
                  <div key={index}>
                    <Typography variant="h6">{edu.degree}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {edu.institution} | {edu.period}
                    </Typography>
                    <Typography>{edu.details}</Typography>
                  </div>
                ))}
              </CVSection>

              <Divider className={classes.divider} />

              {/* المهارات */}
              <CVSection title="المهارات">
                <Grid container spacing={1}>
                  {cvData.skills.map((skill, index) => (
                    <Grid item key={index}>
                      <Button
                        variant="outlined"
                        size="small"
                        style={{ margin: '0.25rem' }}
                      >
                        {skill}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CVSection>
            </div>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleErrorClose}
      >
        <Alert 
          onClose={handleErrorClose} 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => loadCV()}>
              إعادة المحاولة
            </Button>
          }
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 