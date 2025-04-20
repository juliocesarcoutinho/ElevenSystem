'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { ToastProvider } from '@/contexts/ToastContext';

export default function Profile() {
  return (
    <ToastProvider>
      <DashboardLayout>
        <ProfilePage />
      </DashboardLayout>
    </ToastProvider>
  );
}
