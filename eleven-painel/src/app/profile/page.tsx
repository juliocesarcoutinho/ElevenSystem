'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfilePage } from '@/components/profile/ProfilePage';

export default function Profile() {
  return (
    <DashboardLayout>
      <ProfilePage />
    </DashboardLayout>
  );
}
