import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';

import {
  StyledTextField,
  StyledButton,
  formContainerStyles
} from '@/styles/components/forms.styles';
import { User, UserFormData } from '@/services/UserService';

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

export function ProfileForm({ onSubmit, user, apiErrors }: ProfileFormProps) {
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

  // Quando o usuário mudar, atualiza o formulário
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
  
  // Processar erros da API quando eles mudarem
  useEffect(() => {
    if (apiErrors) {
      const newErrors = { ...errors };
      
      // Mapeie os erros da API para os campos do formulário
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
    };
    
    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    // Validação básica de email
    if (!formData.email) {
      newErrors.email = 'O email é obrigatório';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }
  
    // Validação de senhas
    // Só validamos as senhas se alguma delas for preenchida
    if (formData.password || formData.confirmPassword) {
      // Valida se senha tem pelo menos 8 caracteres
      if (formData.password && formData.password.length < 8) {
        newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
      }
      
      // Valida se as senhas são iguais (quando ambas estão preenchidas)
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }
    
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...restData } = formData;
      
      // Cria o payload mantendo os roles atuais do usuário
      const submitData: UserFormData = {
        ...restData,
        active: user.active, // Mantém o status atual
        roles: user.roles // Mantém os perfis atuais
      };
      
      // Se não tiver senha, remove do payload
      if (!submitData.password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...dataWithoutPassword } = submitData;
        onSubmit(dataWithoutPassword);
      } else {
        onSubmit(submitData);
      }
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData(prev => ({ ...prev, password: newPassword }));
    
    // Valida em tempo real se a confirmação de senha já foi digitada
    if (formData.confirmPassword) {
      const newErrors = { ...errors };
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
    setFormData(prev => ({ ...prev, confirmPassword: newConfirmPassword }));
    
    // Valida em tempo real
    if (formData.password) {
      const newErrors = { ...errors };
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
      sx={{ p: 3 }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <StyledTextField
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              setFormData(prev => ({ ...prev, name }));
              if (!name.trim()) {
                setErrors(prev => ({ ...prev, name: 'O nome é obrigatório' }));
              } else {
                setErrors(prev => ({ ...prev, name: '' }));
              }
            }}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <StyledTextField
            label="Email"
            placeholder="Digite seu endereço de email"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={(e) => {
              const email = e.target.value;
              setFormData(prev => ({ ...prev, email }));
              
              // Validação básica
              if (email && !email.includes('@')) {
                setErrors(prev => ({ ...prev, email: 'Email inválido' }));
              } else {
                setErrors(prev => ({ ...prev, email: '' }));
              }
            }}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <StyledTextField
            label="Nova Senha (opcional)"
            placeholder="Digite sua nova senha"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handlePasswordChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </Box>
        
        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <StyledTextField
            label="Confirmar Nova Senha"
            placeholder="Confirme sua nova senha"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          sx={StyledButton.submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Atualizar Perfil'}
        </Button>
      </Box>
    </Box>
  );
}
