import {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, IconButton, InputAdornment} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import {StyledButton, StyledTextField} from '@/styles/components/forms.styles';
import {User, UserFormData} from '@/services/UserService';

interface FormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ProfileFormProps {
    onSubmit: (data: UserFormData) => void;
    user: User;
    apiErrors?: { [key: string]: string };
}

export function ProfileForm({onSubmit, user, apiErrors}: ProfileFormProps) {
    const [formData, setFormData] = useState<FormState>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                password: '', // Senha vazia na edição
                confirmPassword: '',
            });
        }
    }, [user]);

    useEffect(() => {
        if (apiErrors) {
            const newErrors = {...errors};
            if (apiErrors.email) newErrors.email = apiErrors.email;
            if (apiErrors.name) newErrors.name = apiErrors.name;
            if (apiErrors.password) newErrors.password = apiErrors.password;
            setErrors(newErrors);
        }
    }, [apiErrors]);

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        if (!formData.name.trim()) {
            newErrors.name = 'O nome é obrigatório';
        }

        if (!formData.email) {
            newErrors.email = 'O email é obrigatório';
        } else if (!formData.email.includes('@')) {
            newErrors.email = 'Email inválido';
        }

        if (formData.password || formData.confirmPassword) {
            if (formData.password && formData.password.length < 8) {
                newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
            }

            if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'As senhas não coincidem';
            }
        }

        setErrors(newErrors);
        return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validateForm();
        if (formData.password && !formData.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: 'A confirmação da senha é obrigatória'
            }));
            return;
        }

        if (isValid) {
            setIsSubmitting(true);

            try {
                const {confirmPassword, ...restData} = formData;
                const submitData: UserFormData = {
                    ...restData,
                    active: user.active,
                    roles: user.roles,
                };

                if (!submitData.password) {
                    const {password, ...dataWithoutPassword} = submitData;
                    onSubmit(dataWithoutPassword);
                } else {
                    onSubmit(submitData);
                    setFormData(prev => ({
                        ...prev,
                        password: '',
                        confirmPassword: ''
                    }));
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setFormData(prev => ({...prev, password: newPassword}));
        if (formData.confirmPassword) {
            const newErrors = {...errors};
            if (newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'As senhas não coincidem';
            } else {
                newErrors.confirmPassword = '';
            }
            setErrors(newErrors);
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setFormData(prev => ({...prev, confirmPassword: newConfirmPassword}));
        if (formData.password) {
            const newErrors = {...errors};
            if (formData.password !== newConfirmPassword) {
                newErrors.confirmPassword = 'As senhas não coincidem';
            } else {
                newErrors.confirmPassword = '';
            }
            setErrors(newErrors);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{p: 3}}
        >
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 3}}>
                <Box sx={{flex: '1 1 100%', minWidth: 'auto'}}>
                    <StyledTextField
                        label="Nome Completo"
                        placeholder="Digite seu nome completo"
                        fullWidth
                        required
                        value={formData.name}
                        onChange={(e) => {
                            const name = e.target.value;
                            setFormData(prev => ({...prev, name}));
                            if (!name.trim()) {
                                setErrors(prev => ({...prev, name: 'O nome é obrigatório'}));
                            } else {
                                setErrors(prev => ({...prev, name: ''}));
                            }
                        }}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </Box>

                <Box sx={{flex: '1 1 100%', minWidth: 'auto'}}>
                    <StyledTextField
                        label="Email"
                        placeholder="Digite seu endereço de email"
                        type="email"
                        fullWidth
                        required
                        value={formData.email}
                        onChange={(e) => {
                            const email = e.target.value;
                            setFormData(prev => ({...prev, email}));
                            if (email && !email.includes('@')) {
                                setErrors(prev => ({...prev, email: 'Email inválido'}));
                            } else {
                                setErrors(prev => ({...prev, email: ''}));
                            }
                        }}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                </Box>

                <Box sx={{flex: '1 1 100%', minWidth: 'auto'}}>
                    <StyledTextField
                        label="Nova Senha (opcional)"
                        placeholder="Digite sua nova senha"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={formData.password}
                        onChange={handlePasswordChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="alternar visibilidade da senha"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{color: '#FFD700'}}
                                    >
                                        {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box sx={{flex: '1 1 100%', minWidth: 'auto'}}>
                    <StyledTextField
                        label="Confirmar Nova Senha"
                        placeholder="Confirme sua nova senha"
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        value={formData.confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="alternar visibilidade da confirmação de senha"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        sx={{color: '#FFD700'}}
                                    >
                                        {showConfirmPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{mt: 4, display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                    type="submit"
                    variant="contained"
                    sx={StyledButton.submit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <CircularProgress size={24} color="inherit"/> : 'Atualizar Perfil'}
                </Button>
            </Box>
        </Box>
    );
}
