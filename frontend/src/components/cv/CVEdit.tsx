import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
  makeStyles,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Backdrop,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Error as ErrorIcon,
} from '@material-ui/icons';
import { CVData } from './types/CVTypes';
import { cvValidationSchema } from './validation/cvValidation';
import * as Yup from 'yup';
import { ValidationErrors } from '../shared/ValidationErrors';
import { RequiredLabel } from '../shared/RequiredLabel';
import { FormField } from '../shared/FormField';
import { debounce } from 'lodash';

interface DeleteConfirmationProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  title,
  onConfirm,
  onCancel,
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>تأكيد الحذف</DialogTitle>
    <DialogContent>
      <Typography>
        هل أنت متأكد من حذف {title}؟
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        إلغاء
      </Button>
      <Button onClick={onConfirm} color="secondary" variant="contained">
        حذف
      </Button>
    </DialogActions>
  </Dialog>
);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    position: 'relative',
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
  },
  deleteButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
  saveButton: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  cancelButton: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4) + theme.spacing(2),
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(4),
  },
  errorSummary: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.error.light,
  },
  focusedField: {
    animation: '$pulse 2s',
    backgroundColor: theme.palette.action.hover,
  },
  '@keyframes pulse': {
    '0%': {
      backgroundColor: theme.palette.action.hover,
    },
    '50%': {
      backgroundColor: 'transparent',
    },
    '100%': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
  loadingText: {
    color: theme.palette.common.white,
  },
  saveProgress: {
    position: 'absolute',
    color: theme.palette.common.white,
    zIndex: 1,
  },
}));

interface CVEditProps {
  initialData: CVData;
  onSave: (data: CVData) => void;
  onCancel?: () => void;
}

interface ValidationErrors {
  [key: string]: string[];
}

export const CVEdit: React.FC<CVEditProps> = ({ initialData, onSave, onCancel }) => {
  const classes = useStyles();
  const [cvData, setCVData] = useState<CVData>(initialData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    title: string;
    onConfirm: () => void;
  } | null>(null);

  const validateFieldValue = async (path: string, value: any) => {
    try {
      await cvValidationSchema.validateAt(path, { [path]: value });
      return undefined;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return err.message;
      }
      return 'خطأ في التحقق';
    }
  };

  const debouncedValidate = React.useMemo(
    () => debounce(validateFieldValue, 300),
    []
  );

  const helpTexts = {
    'personalInfo.fullName': 'أدخل اسمك الكامل كما يظهر في الوثائق الرسمية',
    'personalInfo.title': 'المسمى الوظيفي الحالي أو المستهدف',
    'personalInfo.email': 'البريد الإلكتروني المهني المفضل للتواصل',
    'personalInfo.phone': 'رقم الهاتف مع رمز الدولة (مثال: +966501234567)',
    'personalInfo.location': 'المدينة والدولة (مثال: الرياض، المملكة العربية السعودية)',
    'summary': 'ملخص مختصر عن خبراتك ومهاراتك وأهدافك المهنية',
  };

  const handlePersonalInfoChange = (field: keyof typeof cvData.personalInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCVData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    });
    validateField(`personalInfo.${field}`, value);
  };

  const handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCVData({
      ...cvData,
      summary: event.target.value,
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...cvData.experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value,
    };
    setCVData({
      ...cvData,
      experience: newExperience,
    });
  };

  const handleExperienceDescriptionChange = (
    expIndex: number,
    descIndex: number,
    value: string
  ) => {
    const newExperience = [...cvData.experience];
    const newDescription = [...newExperience[expIndex].description];
    newDescription[descIndex] = value;
    newExperience[expIndex] = {
      ...newExperience[expIndex],
      description: newDescription,
    };
    setCVData({
      ...cvData,
      experience: newExperience,
    });
  };

  const addExperience = () => {
    setCVData({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          title: '',
          company: '',
          period: '',
          description: [''],
        },
      ],
    });
  };

  const handleDeleteConfirmation = (title: string, onConfirm: () => void) => {
    setDeleteConfirmation({
      open: true,
      title,
      onConfirm: () => {
        onConfirm();
        setDeleteConfirmation(null);
      },
    });
  };

  const removeExperience = (index: number) => {
    handleDeleteConfirmation(
      `الخبرة في ${cvData.experience[index].company}`,
      () => {
        setCVData({
          ...cvData,
          experience: cvData.experience.filter((_, i) => i !== index),
        });
      }
    );
  };

  const addExperienceDescription = (expIndex: number) => {
    const newExperience = [...cvData.experience];
    newExperience[expIndex].description.push('');
    setCVData({
      ...cvData,
      experience: newExperience,
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...cvData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value,
    };
    setCVData({
      ...cvData,
      education: newEducation,
    });
  };

  const addEducation = () => {
    setCVData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          degree: '',
          institution: '',
          period: '',
          details: '',
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    handleDeleteConfirmation(
      `التعليم في ${cvData.education[index].institution}`,
      () => {
        setCVData({
          ...cvData,
          education: cvData.education.filter((_, i) => i !== index),
        });
      }
    );
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...cvData.skills];
    newSkills[index] = value;
    setCVData({
      ...cvData,
      skills: newSkills,
    });
  };

  const addSkill = () => {
    setCVData({
      ...cvData,
      skills: [...cvData.skills, ''],
    });
  };

  const removeSkill = (index: number) => {
    handleDeleteConfirmation(
      `المهارة "${cvData.skills[index]}"`,
      () => {
        setCVData({
          ...cvData,
          skills: cvData.skills.filter((_, i) => i !== index),
        });
      }
    );
  };

  const validateCV = async (): Promise<boolean> => {
    setIsValidating(true);
    try {
      await cvValidationSchema.validate(cvData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors: ValidationErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = [error.message];
          }
        });
        setValidationErrors(errors);
      }
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    const isValid = await validateCV();
    if (isValid) {
      setIsSaving(true);
      try {
        await onSave(cvData);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getFieldError = (path: string): string | undefined => {
    return validationErrors[path]?.[0];
  };

  const handleErrorClick = (path: string) => {
    const element = document.querySelector(`[name="${path}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (element as HTMLElement).focus();
    }
  };

  return (
    <Container className={classes.root}>
      {/* المعلومات الشخصية */}
      <Paper className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle}>
          المعلومات الشخصية
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormField
              name="personalInfo.fullName"
              label="الاسم الكامل"
              value={cvData.personalInfo.fullName}
              onChange={handlePersonalInfoChange('fullName')}
              error={getFieldError('personalInfo.fullName')}
              required
              helpText={helpTexts['personalInfo.fullName']}
              validateOnChange
              onValidate={(value) =>
                debouncedValidate('personalInfo.fullName', value)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="personalInfo.title"
              label="المسمى الوظيفي"
              value={cvData.personalInfo.title}
              onChange={handlePersonalInfoChange('title')}
              error={getFieldError('personalInfo.title')}
              required
              helpText={helpTexts['personalInfo.title']}
              validateOnChange
              onValidate={(value) =>
                debouncedValidate('personalInfo.title', value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              name="personalInfo.email"
              label="البريد الإلكتروني"
              value={cvData.personalInfo.email}
              onChange={handlePersonalInfoChange('email')}
              error={getFieldError('personalInfo.email')}
              required
              helpText={helpTexts['personalInfo.email']}
              validateOnChange
              onValidate={(value) =>
                debouncedValidate('personalInfo.email', value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              name="personalInfo.phone"
              label="رقم الهاتف"
              value={cvData.personalInfo.phone}
              onChange={handlePersonalInfoChange('phone')}
              error={getFieldError('personalInfo.phone')}
              required
              helpText={helpTexts['personalInfo.phone']}
              validateOnChange
              onValidate={(value) =>
                debouncedValidate('personalInfo.phone', value)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="personalInfo.location"
              label="الموقع"
              value={cvData.personalInfo.location}
              onChange={handlePersonalInfoChange('location')}
              error={getFieldError('personalInfo.location')}
              required
              helpText={helpTexts['personalInfo.location']}
              validateOnChange
              onValidate={(value) =>
                debouncedValidate('personalInfo.location', value)
              }
            />
          </Grid>
        </Grid>
      </Paper>

      {/* الملخص */}
      <Paper className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle}>
          الملخص
        </Typography>
        <FormField
          name="summary"
          label="الملخص المهني"
          value={cvData.summary}
          onChange={handleSummaryChange}
          error={getFieldError('summary')}
          required
          multiline
          rows={4}
          maxLength={500}
          helpText={helpTexts['summary']}
          validateOnChange
          onValidate={(value) => debouncedValidate('summary', value)}
        />
      </Paper>

      {/* الخبرات */}
      <Paper className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle}>
          الخبرات المهنية
        </Typography>
        {cvData.experience.map((exp, index) => (
          <div key={index} style={{ marginBottom: theme.spacing(3) }}>
            <IconButton
              className={classes.deleteButton}
              onClick={() => removeExperience(index)}
            >
              <DeleteIcon />
            </IconButton>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="المسمى الوظيفي"
                  value={exp.title}
                  onChange={(e) =>
                    handleExperienceChange(index, 'title', e.target.value)
                  }
                  error={!!getFieldError(`experience.${index}.title`)}
                  helperText={getFieldError(`experience.${index}.title`)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="الشركة"
                  value={exp.company}
                  onChange={(e) =>
                    handleExperienceChange(index, 'company', e.target.value)
                  }
                  error={!!getFieldError(`experience.${index}.company`)}
                  helperText={getFieldError(`experience.${index}.company`)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="الفترة"
                  value={exp.period}
                  onChange={(e) =>
                    handleExperienceChange(index, 'period', e.target.value)
                  }
                  error={!!getFieldError(`experience.${index}.period`)}
                  helperText={getFieldError(`experience.${index}.period`)}
                />
              </Grid>
              {exp.description.map((desc, descIndex) => (
                <Grid item xs={12} key={descIndex}>
                  <TextField
                    fullWidth
                    label={`وصف ${descIndex + 1}`}
                    value={desc}
                    onChange={(e) =>
                      handleExperienceDescriptionChange(
                        index,
                        descIndex,
                        e.target.value
                      )
                    }
                    error={!!getFieldError(`experience.${index}.description.${descIndex}`)}
                    helperText={getFieldError(`experience.${index}.description.${descIndex}`)}
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              startIcon={<AddIcon />}
              onClick={() => addExperienceDescription(index)}
              className={classes.addButton}
            >
              إضافة وصف
            </Button>
          </div>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addExperience}
          className={classes.addButton}
        >
          إضافة خبرة جديدة
        </Button>
      </Paper>

      {/* التعليم */}
      <Paper className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle}>
          التعليم
        </Typography>
        {cvData.education.map((edu, index) => (
          <div key={index} style={{ marginBottom: theme.spacing(3) }}>
            <IconButton
              className={classes.deleteButton}
              onClick={() => removeEducation(index)}
            >
              <DeleteIcon />
            </IconButton>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="الدرجة العلمية"
                  value={edu.degree}
                  onChange={(e) =>
                    handleEducationChange(index, 'degree', e.target.value)
                  }
                  error={!!getFieldError(`education.${index}.degree`)}
                  helperText={getFieldError(`education.${index}.degree`)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="المؤسسة التعليمية"
                  value={edu.institution}
                  onChange={(e) =>
                    handleEducationChange(index, 'institution', e.target.value)
                  }
                  error={!!getFieldError(`education.${index}.institution`)}
                  helperText={getFieldError(`education.${index}.institution`)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="الفترة"
                  value={edu.period}
                  onChange={(e) =>
                    handleEducationChange(index, 'period', e.target.value)
                  }
                  error={!!getFieldError(`education.${index}.period`)}
                  helperText={getFieldError(`education.${index}.period`)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="التفاصيل"
                  value={edu.details}
                  onChange={(e) =>
                    handleEducationChange(index, 'details', e.target.value)
                  }
                  error={!!getFieldError(`education.${index}.details`)}
                  helperText={getFieldError(`education.${index}.details`)}
                />
              </Grid>
            </Grid>
          </div>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addEducation}
          className={classes.addButton}
        >
          إضافة تعليم جديد
        </Button>
      </Paper>

      {/* المهارات */}
      <Paper className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle}>
          المهارات
        </Typography>
        <Grid container spacing={2}>
          {cvData.skills.map((skill, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TextField
                fullWidth
                label={`مهارة ${index + 1}`}
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={() => removeSkill(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ),
                }}
                error={!!getFieldError(`skills.${index}`)}
                helperText={getFieldError(`skills.${index}`)}
              />
            </Grid>
          ))}
        </Grid>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addSkill}
          className={classes.addButton}
        >
          إضافة مهارة جديدة
        </Button>
      </Paper>

      <div className={classes.actions}>
        <Fab
          color="primary"
          className={classes.saveButton}
          onClick={handleSave}
          disabled={isValidating || isSaving || Object.keys(validationErrors).length > 0}
        >
          {isSaving ? (
            <CircularProgress size={24} className={classes.saveProgress} />
          ) : (
            <SaveIcon />
          )}
        </Fab>
        {onCancel && (
          <Fab
            color="secondary"
            className={classes.cancelButton}
            onClick={onCancel}
            disabled={isValidating || isSaving}
          >
            <CloseIcon />
          </Fab>
        )}
      </div>

      <ValidationErrors
        errors={validationErrors}
        onErrorClick={handleErrorClick}
        onClose={() => setValidationErrors({})}
      />

      <Backdrop className={classes.backdrop} open={isValidating || isSaving}>
        <CircularProgress color="inherit" />
        <Typography className={classes.loadingText}>
          {isValidating ? 'جاري التحقق من البيانات...' : 'جاري الحفظ...'}
        </Typography>
      </Backdrop>

      {deleteConfirmation && (
        <DeleteConfirmation
          open={deleteConfirmation.open}
          title={deleteConfirmation.title}
          onConfirm={deleteConfirmation.onConfirm}
          onCancel={() => setDeleteConfirmation(null)}
        />
      )}
    </Container>
  );
}; 