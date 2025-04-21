'use client';

import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Snackbar,
    Typography
} from '@mui/material';
import {LoginService} from '@/services/LoginService';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {StyledTextField} from '@/styles/components/login.styles';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const handleTogglePasswordVisibility = () => {
        setShowPassword((show) => !show);
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
                    <CircularProgress sx={{color: '#FFD700'}}/>
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
                                    setErrors({...errors, email: ''});
                                }
                            }}
                            error={!!errors.email}
                            helperText={errors.email}
                        />

                        <Typography variant="h6" mb={1} mt={1} color="#fff">
                            Senha
                        </Typography>
                        <StyledTextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) {
                                    setErrors({...errors, password: ''});
                                }
                            }}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="alternar visibilidade da senha"
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                            sx={{color: '#FFD700'}}
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box textAlign="center" mb={3} mt={1}>
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
                <DialogTitle sx={{color: '#fff'}}>Recuperar Senha</DialogTitle>
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
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={() => setSnackbar({...snackbar, open: false})}
                sx={{
                    marginTop: '20px',
                    '& .MuiPaper-root': {
                        backgroundColor: 'rgba(211, 47, 47, 0.85)', // Fundo vermelho
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Sombra para destaque
                        borderRadius: '8px', // Bordas arredondadas
                    },
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    sx={{
                        width: '100%',
                        color: '#fff',
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
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
} 