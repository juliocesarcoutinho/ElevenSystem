'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoginService } from '@/services/LoginService';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: '#FFD700',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFD700',
    },
    '& input': {
      color: '#fff',
      padding: '1rem',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ff4444',
  },
  '& .Mui-error.MuiFormLabel-root': {
    color: '#ff4444',
  },
  '& .MuiFormHelperText-root': {
    color: '#ff4444',
  },
  marginBottom: '1.5rem',
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error'
  });
  const router = useRouter();

  const validateFields = () => {
    const newErrors = {
      email: '',
      password: ''
    };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'O email é obrigatório';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'A senha é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const client_id = process.env.NEXT_PUBLIC_CLIENT_ID || "myclientid";
      const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET || "myclientsecret";
      
      const response = await LoginService.login(
        email,
        password,
        client_id,
        client_secret
      );

      if (response.success) {
        router.push('/pages/dashboard');
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Erro ao realizar login',
          severity: 'error'
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: 'Erro inesperado ao tentar fazer login',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoveryPassword = async () => {
    setIsLoading(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Foi enviado uma nova senha no seu email, por favor verifique.',
        severity: 'success'
      });
      setShowDialog(false);
    } catch {
      setSnackbar({
        open: true,
        message: 'Erro ao enviar email de recuperação',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        position: 'relative',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
          }}
        >
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      )}

      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: '#242424',
            borderRadius: '10px',
            padding: '2rem',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          <Box textAlign="center" mb={5}>
            <Typography variant="h3" component="h1" fontWeight="bold" color="#fff" mb={2}>
              Eleven Juventude
            </Typography>
            <Typography variant="h5" color="#FFD700" mb={1}>
              Bem-vindo!
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
              Faça login para continuar
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin}>
            <Typography variant="h6" mb={1} color="#fff">
              Email
            </Typography>
            <StyledTextField
              fullWidth
              placeholder="Endereço de email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              error={!!errors.email}
              helperText={errors.email}
            />

            <Typography variant="h6" mb={1} color="#fff">
              Senha
            </Typography>
            <StyledTextField
              fullWidth
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              error={!!errors.password}
              helperText={errors.password}
            />

            <Box textAlign="center" mb={3}>
              <Button
                onClick={() => setShowDialog(true)}
                sx={{ 
                  color: '#FFD700',
                  '&:hover': {
                    color: '#FFC000',
                  }
                }}
              >
                Esqueceu sua senha?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                padding: '0.8rem',
                fontSize: '1.1rem',
                backgroundColor: '#FFD700',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#FFC000',
                },
              }}
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Container>

      <Dialog 
        open={showDialog} 
        onClose={() => setShowDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#242424',
            color: '#fff',
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Recuperar Senha</DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={2} color="rgba(255, 255, 255, 0.7)">
            Digite seu email para recuperar sua senha
          </Typography>
          <StyledTextField
            fullWidth
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDialog(false)} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: '#fff',
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleRecoveryPassword}
            sx={{ 
              color: '#FFD700',
              '&:hover': {
                color: '#FFC000',
              }
            }}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        sx={{
          marginTop: '20px',
          '& .MuiPaper-root': {
            backgroundColor: '#242424',
          }
        }}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            width: '100%',
            backgroundColor: snackbar.severity === 'error' ? '#ff44447a' : '#4caf507a',
            color: '#fff',
            '.MuiAlert-icon': {
              color: snackbar.severity === 'error' ? '#ff4444' : '#4caf50'
            },
            '.MuiAlert-action': {
              color: '#fff'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 