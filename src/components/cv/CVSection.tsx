import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CVSectionProps {
  title: string;
  children: React.ReactNode;
}

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

export const CVSection: React.FC<CVSectionProps> = ({ title, children }) => {
  return (
    <SectionPaper elevation={2}>
      <SectionTitle variant="h5">
        {title}
      </SectionTitle>
      <Box>{children}</Box>
    </SectionPaper>
  );
}; 