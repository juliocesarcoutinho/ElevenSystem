'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Toast, ToastType } from '@/components/ui/Toast';
import { Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // Efeito para garantir que o componente só renderize no cliente
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const showToast = (message: string, type: ToastType, duration: number = 3000) => {
    if (!mounted) return;
    
    const newToast: ToastMessage = {
      id: uuidv4(),
      message,
      type,
      duration,
    };
    
    // Adicionar nova notificação ao estado
    setToasts((prev) => [...prev, newToast]);
  };

  const hideToast = (id: string) => {
    if (!mounted) return;
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Container para todas as notificações - só renderizado no cliente */}
      {mounted && (
        <Box
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxWidth: '400px',
          }}
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={hideToast}
            />
          ))}
        </Box>
      )}
    </ToastContext.Provider>
  );
};

// Hook personalizado para usar o contexto de notificações
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};
