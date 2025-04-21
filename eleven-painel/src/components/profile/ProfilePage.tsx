'use client';

import {useEffect, useState} from 'react';
import {Alert, Box, CircularProgress, Typography} from '@mui/material';
import {User, UserFormData, UserService} from '@/services/UserService';
import {ProfileForm} from '@/components/profile/ProfileForm';
import {formContainerStyles} from '@/styles/components/forms.styles';
import {useToast} from '@/contexts/ToastContext';

export function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});
    const {showToast} = useToast();

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const userData = await UserService.findMe();
                setUser(userData);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar perfil:', err);
                setError('Não foi possível carregar seus dados de perfil. Tente novamente mais tarde.');
                showToast('Erro ao carregar perfil', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [showToast]);

    const handleUpdateProfile = async (formData: UserFormData) => {
        if (!user) return;

        try {
            setLoading(true);
            await UserService.updateUser(user.id, formData);

            const updatedUser = await UserService.findMe();
            setUser(updatedUser);
            showToast('Perfil atualizado com sucesso!', 'success', 3000);
            setApiErrors({});
        } catch (err: any) {
            console.error('Erro ao atualizar perfil:', err);

            if (err.response?.data?.errors) {
                const errors: { [key: string]: string } = {};
                err.response.data.errors.forEach((error: { fieldName: string, message: string }) => {
                    errors[error.fieldName] = error.message;
                });
                setApiErrors(errors);
            } else {
                setError('Não foi possível atualizar seu perfil. Tente novamente mais tarde.');
                showToast('Não foi possível atualizar seu perfil', 'error', 4000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={formContainerStyles}>
            <Typography variant="h4" color="white" gutterBottom sx={{mb: 3}}>
                Meu Perfil
            </Typography>

            {loading && !user && (
                <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}>
                    <CircularProgress/>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}

            {user && (
                <ProfileForm
                    onSubmit={handleUpdateProfile}
                    user={user}
                    apiErrors={apiErrors}
                />
            )}
        </Box>
    );
}
