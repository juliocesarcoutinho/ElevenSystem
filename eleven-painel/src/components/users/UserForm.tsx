import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';

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
    },
    '& input:-webkit-autofill': {
      '-webkit-box-shadow': '0 0 0 30px #242424 inset',
      '-webkit-text-fill-color': '#fff',
      'caret-color': '#fff',
    },
    '& input:-webkit-autofill:hover': {
      '-webkit-box-shadow': '0 0 0 30px #242424 inset',
      '-webkit-text-fill-color': '#fff',
    },
    '& input:-webkit-autofill:focus': {
      '-webkit-box-shadow': '0 0 0 30px #242424 inset',
      '-webkit-text-fill-color': '#fff',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .Mui-focused .MuiInputLabel-root': {
    color: '#FFD700',
  },
  '& .MuiFormHelperText-root': {
    color: '#ff4444',
  },
});

const StyledSelect = styled(Select)({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#FFD700',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#FFD700',
  },
  '& .MuiSelect-select': {
    color: '#fff',
  },
  '& .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiPaper-root': {
    backgroundColor: '#242424',
  },
  '& .MuiMenu-paper': {
    backgroundColor: '#242424',
  },
});

const StyledMenuItem = styled(MenuItem)({
  color: '#fff',
  backgroundColor: '#242424',
  '&:hover': {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 215, 0, 0.3)',
    },
  },
});

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
      const { confirmPassword, ...submitData } = formData;
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
      sx={{
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
        p: 4,
        backgroundColor: '#242424',
        borderRadius: 2,
      }}
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
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#FFD700',
                },
              }}
            >
              Perfil de Acesso
            </InputLabel>
            <StyledSelect
              labelId="roles-label"
              multiple
              value={formData.roles}
              onChange={(e) => setFormData({ ...formData, roles: e.target.value as string[] })}
              label="Perfil de Acesso"
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#242424',
                    '& .MuiMenuItem-root': {
                      color: '#fff',
                      '&:hover': {
                        bgcolor: 'rgba(255, 215, 0, 0.1)',
                      },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255, 215, 0, 0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 215, 0, 0.3)',
                        },
                      },
                    },
                  },
                },
              }}
            >
              <StyledMenuItem value="ADMIN">Administrador</StyledMenuItem>
              <StyledMenuItem value="OPERADOR">Operador</StyledMenuItem>
            </StyledSelect>
          </FormControl>
        </Box>

        <Box sx={{ width: '100%' }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#FFD700',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#FFD700',
                  },
                }}
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
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: '#FFD700',
                color: '#FFD700',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#FFD700',
              color: 'black',
              '&:hover': {
                backgroundColor: '#FFD700CC',
              },
            }}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Box>
  );
} 