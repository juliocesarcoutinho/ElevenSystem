import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  } from '@mui/material';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
import { User, UserFormData } from '@/services/UserService';
import { Role, RoleService } from '@/services/RoleService';

// Usando a interface UserFormData importada de '@/services/UserService'

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

export function UserForm({ onSubmit, onCancel, editingUser, apiErrors }: UserFormProps) {
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
            setFormData(prev => ({ ...prev, role: operadorRole }));
          } else {
            // Se não encontrar OPERADOR, usa o primeiro perfil disponível
            setFormData(prev => ({ ...prev, role: roles[0] }));
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
      // Pega apenas o primeiro perfil para usar como perfil principal
      const primaryRole = editingUser.roles.length > 0 ? editingUser.roles[0] : null;
      
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        password: '', // Senha vazia na edição
        confirmPassword: '',
        active: editingUser.active,
        role: primaryRole, // Usar apenas o primeiro perfil
      });
    }
  }, [editingUser]);
  
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
      role: '',
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
    // Em modo de edição, só validamos as senhas se alguma delas for preenchida
    if (!(isEditMode && !formData.password && !formData.confirmPassword)) {
      // Se ambos os campos de senha estiverem preenchidos, verifica se são iguais
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
    }
    
    // Validação de perfil
    if (!formData.role) {
      newErrors.role = 'Selecione um perfil de acesso';
    }
  
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword && !newErrors.role;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verificando senhas:', {
      senha: formData.password,
      confirmacao: formData.confirmPassword,
      saoIguais: formData.password === formData.confirmPassword
    });
    
    if (validateForm()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, role, ...restData } = formData;
      
      // Cria o payload com o role dentro de um array roles
      const submitData: UserFormData = {
        ...restData,
        roles: role ? [role] : [] // Converte o perfil único para o formato de array esperado pela API
      };
      
      // Se estiver em modo de edição e não tiver senha, remove do payload
      if (isEditMode && !submitData.password) {
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

  // Função auxiliar para obter o nome de exibição de um perfil
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
            placeholder="Digite o endereço de email"
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
                open={selectOpen}
                onOpen={() => setSelectOpen(true)}
                onClose={() => setSelectOpen(false)}
                value={formData.role ? formData.role.id : ''}
                onChange={(e) => {
                  const selectedId = e.target.value as number;
                  const selectedRole = availableRoles.find(role => role.id === selectedId) || null;
                  setFormData({ ...formData, role: selectedRole });
                  
                  // Limpa o erro de role se alguma for selecionada
                  if (selectedRole && errors.role) {
                    setErrors(prev => ({ ...prev, role: '' }));
                  } else if (!selectedRole) {
                    setErrors(prev => ({ ...prev, role: 'Selecione um perfil de acesso' }));
                  }
                  
                  // Fecha o menu após seleção
                  setSelectOpen(false);
                }}
                label="Perfil de Acesso"
                MenuProps={{
                  ...menuPaperProps,
                  // Garante que o menu fecha ao clicar em um item
                  disableAutoFocusItem: true,
                }}
                error={!!errors.role}
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