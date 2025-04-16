import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
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
import { User } from '@/services/UserService';
import { Role, RoleService } from '@/services/RoleService';

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  active: boolean;
  roles: string[];
}

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  active: boolean;
  roles: { id: number, authority: string }[];
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  editingUser?: User | null;
}

export function UserForm({ onSubmit, onCancel, editingUser }: UserFormProps) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    active: true,
    roles: [],
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    roles: '',
  });
  
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const isEditMode = !!editingUser;

  // Carregar os perfis de acesso quando o componente é montado
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const roles = await RoleService.getRoles();
        setAvailableRoles(roles);
        
        // Se não estiver em modo de edição, define o perfil padrão como OPERADOR (se existir)
        if (!isEditMode && roles.length > 0) {
          const operadorRole = roles.find(role => role.authority === 'OPERADOR');
          if (operadorRole) {
            setFormData(prev => ({ ...prev, roles: [operadorRole] }));
          } else {
            // Se não encontrar OPERADOR, usa o primeiro perfil disponível
            setFormData(prev => ({ ...prev, roles: [roles[0]] }));
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
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        password: '', // Senha vazia na edição
        confirmPassword: '',
        active: editingUser.active,
        roles: editingUser.roles, // Manter os objetos role completos
      });
    }
  }, [editingUser]);

  const validateForm = () => {
    const newErrors = {
      password: '',
      confirmPassword: '',
      roles: '',
    };
  
    // Validação de senhas
    // Em modo de edição, só validamos as senhas se alguma delas for preenchida
    if (!(isEditMode && !formData.password && !formData.confirmPassword)) {
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }
    
    // Validação de perfis
    if (formData.roles.length === 0) {
      newErrors.roles = 'Selecione pelo menos um perfil de acesso';
    }
  
    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword && !newErrors.roles;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword: _, ...submitData } = formData;
      
      // Se estiver em modo de edição e não tiver senha, remove do payload
      if (isEditMode && !submitData.password) {
        const { password, ...dataWithoutPassword } = submitData;
        onSubmit(dataWithoutPassword);
      } else {
        onSubmit(submitData);
      }
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
    if (formData.confirmPassword) {
      validateForm();
    }
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, confirmPassword: e.target.value });
    if (formData.password) {
      validateForm();
    }
  };

  // Função auxiliar para obter o nome de exibição de um perfil
  const getRoleDisplayName = (authority: string): string => {
    switch (authority) {
      case 'ADMINISTRADOR':
        return 'Administrador';
      case 'OPERADOR':
        return 'Operador';
      default:
        return authority; // Retorna o próprio valor se não tiver mapeamento
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={isEditMode ? { p: 3 } : formContainerStyles}
    >
      {!isEditMode && (
        <Typography variant="h5" color="white" gutterBottom sx={{ mb: 4 }}>
          Novo Usuário
        </Typography>
      )}

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
            label={isEditMode ? "Nova Senha (opcional)" : "Senha"}
            placeholder={isEditMode ? "Deixe em branco para manter a senha atual" : "Digite a senha do usuário"}
            type="password"
            fullWidth
            required={!isEditMode}
            value={formData.password}
            onChange={handlePasswordChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <StyledTextField
            label={isEditMode ? "Confirmar Nova Senha" : "Confirmar Senha"}
            placeholder={isEditMode ? "Confirme a nova senha (se alterada)" : "Digite a senha novamente"}
            type="password"
            fullWidth
            required={!isEditMode}
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
            {isLoadingRoles ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <CircularProgress size={24} sx={{ color: '#FFD700', mr: 2 }} />
                <Typography color="white" variant="body2">Carregando perfis...</Typography>
              </Box>
            ) : (
              <StyledSelect
                labelId="roles-label"
                multiple
                value={formData.roles.map(role => role.id)}
                onChange={(e) => {
                  const selectedIds = e.target.value as number[];
                  const selectedRoles = availableRoles.filter(role => 
                    selectedIds.includes(role.id)
                  );
                  setFormData({ ...formData, roles: selectedRoles });
                  
                  // Limpa o erro de roles se alguma for selecionada
                  if (selectedRoles.length > 0 && errors.roles) {
                    setErrors(prev => ({ ...prev, roles: '' }));
                  } else if (selectedRoles.length === 0) {
                    setErrors(prev => ({ ...prev, roles: 'Selecione pelo menos um perfil de acesso' }));
                  }
                }}
                label="Perfil de Acesso"
                MenuProps={menuPaperProps}
                error={!!errors.roles}
              >
                {availableRoles.map(role => (
                  <StyledMenuItem key={role.id} value={role.id}>
                    {getRoleDisplayName(role.authority)}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            )}
            {errors.roles && (
              <Typography variant="caption" sx={{ 
                color: '#f44336', 
                marginTop: '4px',
                display: 'block',
                fontSize: '0.75rem'
              }}>
                {errors.roles}
              </Typography>
            )}
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