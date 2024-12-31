import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Avatar,
  IconButton,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useAuth } from '../../contexts/AuthContext';
import { PhotoCamera } from '@material-ui/icons';

interface ProfileFormData {
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  avatar?: File;
  avatarUrl?: string;
}

export const ProfileEdit: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      
      // عرض معاينة للصورة
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('كلمات المرور غير متطابقة');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      if (formData.currentPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
      }
      if (formData.newPassword) {
        formDataToSend.append('newPassword', formData.newPassword);
      }
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      await updateProfile(formDataToSend);
      setSuccess('تم تحديث الملف الشخصي بنجاح');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: '2rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <Avatar
            src={avatarPreview || user?.avatarUrl}
            style={{ width: 100, height: 100, marginBottom: '1rem' }}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload">
            <IconButton
              color="primary"
              aria-label="تحميل صورة شخصية"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </div>
        <Typography variant="h5" component="h1" gutterBottom>
          تعديل الملف الشخصي
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="الاسم الكامل"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                name="email"
                value={formData.email}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="كلمة المرور الحالية"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="كلمة المرور الجديدة"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="تأكيد كلمة المرور الجديدة"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                حفظ التغييرات
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Container>
  );
}; 