'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { User, UserFormData, UserService } from '@/services/UserService';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { formContainerStyles } from '@/styles/components/forms.styles';

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<{[key: string]: string}>({});

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
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleUpdateProfile = async (formData: UserFormData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await UserService.updateUser(user.id, formData);
      
      // Atualiza os dados do usuário após alteração
      const updatedUser = await UserService.findMe();
      setUser(updatedUser);
      
      setSuccess('Perfil atualizado com sucesso!');
      setApiErrors({});
      
      // Limpa a mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      
      // Trata erros de validação da API
      if (err.response?.data?.errors) {
        const errors: {[key: string]: string} = {};
        err.response.data.errors.forEach((error: {fieldName: string, message: string}) => {
          errors[error.fieldName] = error.message;
        });
        setApiErrors(errors);
      } else {
        setError('Não foi possível atualizar seu perfil. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Typography variant="h4" color="white" gutterBottom sx={{ mb: 3 }}>
        Meu Perfil
      </Typography>

      {loading && !user && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
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
