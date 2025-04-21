import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import {
    formContainerStyles,
    menuPaperProps,
    StyledButton,
    StyledMenuItem,
    StyledSelect,
    StyledSwitch,
    StyledTextField
} from '@/styles/components/forms.styles';
import {User, UserFormData} from '@/services/UserService';
import {Role, RoleService} from '@/services/RoleService';

interface FormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    active: boolean;
    role: { id: number, authority: string } | null;
}

interface UserFormProps {
    onSubmit: (data: UserFormData) => void;
    onCancel: () => void;
    editingUser?: User | null;
    apiErrors?: { [key: string]: string };
}

export function UserForm({onSubmit, onCancel, editingUser, apiErrors}: UserFormProps) {
    const [formData, setFormData] = useState<FormState>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        active: true,
        role: null,
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [selectOpen, setSelectOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isEditMode = !!editingUser;

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Carregar os perfis de acesso quando o componente é montado
    useEffect(() => {
        const loadRoles = async () => {
            try {
                setIsLoadingRoles(true);
                const roles = await RoleService.getRoles();
                setAvailableRoles(roles);

                if (!isEditMode && roles.length > 0) {
                    const operadorRole = roles.find(role => role.authority === 'OPERADOR');
                    if (operadorRole) {
                        setFormData(prev => ({...prev, role: operadorRole}));
                    } else {
                        setFormData(prev => ({...prev, role: roles[0]}));
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar perfis de acesso:', error);
            } finally {
                setIsLoadingRoles(false);
            }
        };

        loadRoles();
    }, [isEditMode]);

    // Quando o usuário de edição mudar, atualiza o formulário
    useEffect(() => {
        if (editingUser) {
            const primaryRole = editingUser.roles.length > 0 ? editingUser.roles[0] : null;

            setFormData({
                name: editingUser.name,
                email: editingUser.email,
                password: '',
                confirmPassword: '',
                active: editingUser.active,
                role: primaryRole,
            });
        }
    }, [editingUser]);

    // Processar erros da API quando eles mudarem
    useEffect(() => {
        if (apiErrors) {
            const newErrors = {...errors};

            if (apiErrors.email) {
                newErrors.email = apiErrors.email;
            }
            if (apiErrors.name) {
                newErrors.name = apiErrors.name;
            }
            if (apiErrors.password) {
                newErrors.password = apiErrors.password;
            }

            setErrors(newErrors);
        }
    }, [apiErrors]);

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
        };

        if (!formData.name.trim()) {
            newErrors.name = 'O nome é obrigatório';
        }

        if (!formData.email) {
            newErrors.email = 'O email é obrigatório';
        } else if (!formData.email.includes('@')) {
            newErrors.email = 'Email inválido';
        }

        if (!(isEditMode && !formData.password && !formData.confirmPassword)) {
            if (formData.password || formData.confirmPassword) {
                if (formData.password && formData.password.length < 8) {
                    newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
                }

                if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'As senhas não coincidem';
                }
            }
        }

        if (!formData.role) {
            newErrors.role = 'Selecione um perfil de acesso';
        }

        setErrors(newErrors);
        return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword && !newErrors.role;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const {confirmPassword, role, ...restData} = formData;

            const submitData: UserFormData = {
                ...restData,
                roles: role ? [role] : []
            };

            if (isEditMode && !submitData.password) {
                const {password, ...dataWithoutPassword} = submitData;
                onSubmit(dataWithoutPassword);
            } else {
                onSubmit(submitData);
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

    const getRoleDisplayName = (authority: string): string => {
        switch (authority) {
            case 'ADMINISTRADOR':
                return 'Administrador';
            case 'OPERADOR':
                return 'Operador';
            default:
                return authority;
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                ...(isEditMode ? {
                    p: isSmallScreen ? 1 : 3,
                    width: '100%',
                    boxSizing: 'border-box'
                } : formContainerStyles),
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflowX: 'hidden'
            }}
        >
            {!isEditMode && (
                <Typography variant="h5" color="white" gutterBottom sx={{mb: isSmallScreen ? 2 : 4}}>
                    Novo Usuário
                </Typography>
            )}

            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: isSmallScreen ? 2 : 3,
                '& > *': {
                    flex: '1 1 100%',
                    minWidth: '0',
                    [theme.breakpoints.up('sm')]: {
                        flex: '1 1 45%'
                    }
                }
            }}>
                <Box>
                    <StyledTextField
                        label="Nome Completo"
                        placeholder="Digite o nome completo do usuário"
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
                        sx={{
                            '& .MuiOutlinedInput-input': {
                                padding: isSmallScreen ? '12px 14px' : '14px 16px',
                                fontSize: isSmallScreen ? '0.9rem' : '1rem',
                                height: '23px',
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: isSmallScreen ? '0.875rem' : '1rem',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#FFD700', // Cor dourada para a borda
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FFD700', // Cor dourada para a borda ao passar o mouse
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#FFD700', // Cor dourada para a borda quando estiver em foco
                                },
                            },
                            '& .MuiInputBase-root': {
                                width: '100%',
                            }
                        }}
                    />

                </Box>

                <Box>
                    <StyledTextField
                        label="Email"
                        placeholder="Digite o endereço de email"
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
                        sx={{
                            '& .MuiOutlinedInput-input': {
                                padding: isSmallScreen ? '12px 14px' : '14px 16px', // Ajusta o padding
                                fontSize: isSmallScreen ? '0.9rem' : '1rem', // Ajuste do tamanho da fonte
                                height: '23px', // Definindo altura fixa
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: isSmallScreen ? '0.875rem' : '1rem', // Ajuste da fonte do label
                            },
                            '& .MuiInputBase-root': {
                                width: '100%', // Garantir que o input ocupe toda a largura
                            }
                        }}
                    />


                </Box>

                <Box>
                    <StyledTextField
                        label={isEditMode ? "Nova Senha (opcional)" : "Senha"}
                        placeholder={isEditMode ? "Deixe em branco para manter a senha atual" : "Digite a senha do usuário"}
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        required={!isEditMode}
                        value={formData.password}
                        onChange={handlePasswordChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{color: '#FFD700'}}
                                    >
                                        {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-input': {
                                padding: isSmallScreen ? '12px 14px' : '14px 16px', // Ajusta o padding
                                fontSize: isSmallScreen ? '0.9rem' : '1rem', // Ajuste do tamanho da fonte
                                height: '23px', // Definindo altura fixa
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: isSmallScreen ? '0.875rem' : '1rem', // Ajuste da fonte do label
                            },
                            '& .MuiInputBase-root': {
                                width: '100%', // Garantir que o input ocupe toda a largura
                            }
                        }}
                    />

                </Box>

                <Box>
                    <StyledTextField
                        label={isEditMode ? "Confirmar Nova Senha" : "Confirmar Senha"}
                        placeholder={isEditMode ? "Confirme a nova senha (se alterada)" : "Digite a senha novamente"}
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        required={!isEditMode}
                        value={formData.confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        sx={{color: '#FFD700'}}
                                    >
                                        {showConfirmPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-input': {
                                padding: isSmallScreen ? '12px 14px' : '14px 16px', // Ajusta o padding
                                fontSize: isSmallScreen ? '0.9rem' : '1rem', // Ajuste do tamanho da fonte
                                height: '23px', // Definindo altura fixa
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: isSmallScreen ? '0.875rem' : '1rem', // Ajuste da fonte do label
                            },
                            '& .MuiInputBase-root': {
                                width: '100%', // Garantir que o input ocupe toda a largura
                            }
                        }}
                    />

                </Box>

                <Box>
                    <FormControl fullWidth>
                        <InputLabel
                            id="roles-label"
                            sx={{
                                fontSize: isSmallScreen ? '0.875rem' : '1rem', // Ajuste do tamanho da fonte para o label
                                color: '#FFD700'
                            }}
                        >
                            Perfil de Acesso
                        </InputLabel>
                        {isLoadingRoles ? (
                            <Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>
                                <CircularProgress size={24} sx={{color: '#FFD700', mr: 2}}/>
                                <Typography color="white" variant="body2">Carregando perfis...</Typography>
                            </Box>
                        ) : (
                            <StyledSelect
                                labelId="roles-label"
                                open={selectOpen}
                                onOpen={() => setSelectOpen(true)}
                                onClose={() => setSelectOpen(false)}
                                value={formData.role ? formData.role.id : ''}
                                onChange={(e) => {
                                    const selectedId = e.target.value as number;
                                    const selectedRole = availableRoles.find(role => role.id === selectedId) || null;
                                    setFormData({...formData, role: selectedRole});

                                    if (selectedRole && errors.role) {
                                        setErrors(prev => ({...prev, role: ''}));
                                    } else if (!selectedRole) {
                                        setErrors(prev => ({...prev, role: 'Selecione um perfil de acesso'}));
                                    }

                                    setSelectOpen(false);
                                }}
                                label="Perfil de Acesso"
                                MenuProps={{
                                    ...menuPaperProps,
                                    disableAutoFocusItem: true,
                                }}
                                error={!!errors.role}
                                sx={{
                                    '& .MuiSelect-select': {
                                        padding: isSmallScreen ? '12px 14px' : '14px 16px', // Ajusta o padding
                                        fontSize: isSmallScreen ? '0.9rem' : '1rem', // Ajuste do tamanho da fonte
                                        height: '23px', // Define a altura do input
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: isSmallScreen ? '0.875rem' : '1rem', // Ajuste do tamanho da fonte do label
                                    },
                                    '& .MuiInputBase-root': {
                                        width: '100%', // Garante que o select ocupe toda a largura
                                    }
                                }}
                            >
                                {availableRoles.map(role => (
                                    <StyledMenuItem key={role.id} value={role.id}>
                                        {getRoleDisplayName(role.authority)}
                                    </StyledMenuItem>
                                ))}
                            </StyledSelect>
                        )}
                        {errors.role && (
                            <Typography variant="caption" sx={{
                                color: '#f44336',
                                marginTop: '4px',
                                display: 'block',
                                fontSize: '0.75rem'
                            }}>
                                {errors.role}
                            </Typography>
                        )}
                    </FormControl>

                </Box>

                <Box sx={{width: '100%', mt: isSmallScreen ? -1 : 0}}>
                    <FormControlLabel
                        control={
                            <StyledSwitch
                                checked={formData.active}
                                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                            />
                        }
                        label="Usuário Ativo"
                        sx={{color: 'white'}}
                    />
                </Box>

                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    mt: isSmallScreen ? 1 : 2
                }}>
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="outlined"
                        sx={StyledButton.cancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={StyledButton.submit}
                    >
                        Salvar
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}