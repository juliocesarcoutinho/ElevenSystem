import { useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';

import {
  StyledTextField,
  StyledSelect,
  StyledMenuItem,
  StyledSwitch,
  StyledButton,
  inputLabelStyles,
  menuPaperProps,
  formContainerStyles
} from '@/styles/components/forms.styles';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  active: boolean;
  roles: string[];
}

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  active: boolean;
  roles: string[];
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export function UserForm({ onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    active: true,
    roles: ['OPERADOR'],
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const validatePasswords = () => {
    const newErrors = {
      password: '',
      confirmPassword: '',
    };

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePasswords()) {
      const { confirmPassword: _, ...submitData } = formData;
      onSubmit(submitData);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
    if (formData.confirmPassword) {
      validatePasswords();
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, confirmPassword: e.target.value });
    if (formData.password) {
      validatePasswords();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={formContainerStyles}
    >
      <Typography variant="h5" color="white" gutterBottom sx={{ mb: 4 }}>
        Novo Usuário
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <StyledTextField
            label="Nome Completo"
            placeholder="Digite o nome completo do usuário"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <StyledTextField
            label="Email"
            placeholder="Digite o endereço de email"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <StyledTextField
            label="Senha"
            placeholder="Digite a senha do usuário"
            type="password"
            fullWidth
            required
            value={formData.password}
            onChange={handlePasswordChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <StyledTextField
            label="Confirmar Senha"
            placeholder="Digite a senha novamente"
            type="password"
            fullWidth
            required
            value={formData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <FormControl fullWidth>
            <InputLabel 
              id="roles-label"
              sx={inputLabelStyles}
            >
              Perfil de Acesso
            </InputLabel>
            <StyledSelect
              labelId="roles-label"
              multiple
              value={formData.roles}
              onChange={(e) => setFormData({ ...formData, roles: e.target.value as string[] })}
              label="Perfil de Acesso"
              MenuProps={menuPaperProps}
            >
              <StyledMenuItem value="ADMIN">Administrador</StyledMenuItem>
              <StyledMenuItem value="OPERADOR">Operador</StyledMenuItem>
            </StyledSelect>
          </FormControl>
        </Box>

        <Box sx={{ width: '100%' }}>
          <FormControlLabel
            control={
              <StyledSwitch
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
            }
            label="Usuário Ativo"
            sx={{ color: 'white' }}
          />
        </Box>

        <Box sx={{ width: '100%', display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
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