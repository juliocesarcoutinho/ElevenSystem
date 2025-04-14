'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UnderConstruction } from '@/components/UnderConstruction';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <UnderConstruction pageName="Dashboard" />
    </DashboardLayout>
  );
} 