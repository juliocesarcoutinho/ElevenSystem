'use client';

import { ToastProvider } from '@/contexts/ToastContext';

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
