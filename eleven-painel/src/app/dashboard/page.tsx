'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Box, Typography } from '@mui/material';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" color="white" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
          Bem-vindo ao painel administrativo do Eleven Juventude.
        </Typography>
      </Box>
    </DashboardLayout>
  );
} 