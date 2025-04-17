'use client';

import { useState, useEffect } from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // em ms
  onClose: (id: string) => void;
}

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  const [open, setOpen] = useState(true);

  // Fechamento automático após o tempo definido
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  const handleClose = () => {
    setOpen(false);
    // Pequeno atraso para permitir a animação antes de remover o componente
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  // Configurações de cores baseadas no tipo
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'rgba(46, 125, 50, 0.85)',
          color: '#fff',
          icon: <CheckCircleIcon />
        };
      case 'error':
        return {
          backgroundColor: 'rgba(211, 47, 47, 0.85)',
          color: '#fff',
          icon: <ErrorIcon />
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(237, 108, 2, 0.85)',
          color: '#fff',
          icon: <WarningIcon />
        };
      case 'info':
      default:
        return {
          backgroundColor: 'rgba(2, 136, 209, 0.85)',
          color: '#fff',
          icon: <InfoIcon />
        };
    }
  };

  const styles = getToastStyles();

  return (
    <Collapse in={open} timeout={300}>
      <Alert
        severity={type}
        icon={styles.icon}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={handleClose}
            aria-label="fechar"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          mb: 2,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          '.MuiAlert-icon': {
            color: 'inherit',
            opacity: 0.9,
            padding: '0 8px 0 0',
          },
          '.MuiAlert-message': {
            padding: '8px 0',
          },
          '.MuiAlert-action': {
            padding: '0 0 0 8px',
            color: 'inherit',
            opacity: 0.7,
            '&:hover': {
              opacity: 1,
            },
          },
          width: '100%',
          minWidth: '300px',
          maxWidth: '400px',
        }}
      >
        {message}
      </Alert>
    </Collapse>
  );
}
