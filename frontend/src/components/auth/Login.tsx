import React from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Container 
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('البريد الإلكتروني غير صالح')
    .required('البريد الإلكتروني مطلوب'),
  password: Yup.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});

export const Login: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // سيتم إضافة منطق تسجيل الدخول لاحقاً
      console.log(values);
    },
  });

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h5" align="center" gutterBottom>
          تسجيل الدخول
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="البريد الإلكتروني"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="كلمة المرور"
            type="password"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: '1rem' }}
          >
            دخول
          </Button>
        </form>
      </Paper>
    </Container>
  );
}; 