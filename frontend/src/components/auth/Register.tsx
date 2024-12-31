import React from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Container,
  Grid 
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('الاسم الكامل مطلوب'),
  email: Yup.string()
    .email('البريد الإلكتروني غير صالح')
    .required('البريد الإلكتروني مطلوب'),
  password: Yup.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});

export const Register: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h5" align="center" gutterBottom>
          إنشاء حساب جديد
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="fullName"
                name="fullName"
                label="الاسم الكامل"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="البريد الإلكتروني"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="كلمة المرور"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="تأكيد كلمة المرور"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: '2rem' }}
          >
            تسجيل
          </Button>
        </form>
      </Paper>
    </Container>
  );
}; 