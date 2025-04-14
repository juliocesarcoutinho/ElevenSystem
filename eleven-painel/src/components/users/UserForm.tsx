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
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .Mui-focused .MuiInputLabel-root': {
    color: '#FFD700',
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
});

interface UserFormData {
  name: string;
  email: string;
  password: string;
  active: boolean;
  roles: string[];
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export function UserForm({ onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    active: true,
    roles: ['OPERADOR'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        p: 3,
        backgroundColor: '#242424',
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" color="white" gutterBottom>
        Novo Usuário
      </Typography>

      <StyledTextField
        label="Nome"
        fullWidth
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <StyledTextField
        label="Email"
        type="email"
        fullWidth
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <StyledTextField
        label="Senha"
        type="password"
        fullWidth
        required
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

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
          Perfil
        </InputLabel>
        <StyledSelect
          labelId="roles-label"
          multiple
          value={formData.roles}
          onChange={(e) => setFormData({ ...formData, roles: e.target.value as string[] })}
          label="Perfil"
        >
          <MenuItem value="ADMIN">Administrador</MenuItem>
          <MenuItem value="OPERADOR">Operador</MenuItem>
        </StyledSelect>
      </FormControl>

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
        label="Ativo"
        sx={{ color: 'white' }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
  );
} 