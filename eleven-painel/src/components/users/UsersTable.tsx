'use client';

import {Box, IconButton, InputAdornment, Pagination, Paper, TextField, Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import {useState, useEffect, useRef, useMemo} from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  roles: { id: number; authority: string; }[];
}

interface UsersTableProps {
  users: User[];
  totalElements: number;
  page: number;
  rowsPerPage: number;
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onSearch?: (query: string) => void;
  searchTerm: string; // Adiciona o termo de busca como prop
}

export function UsersTable({ 
  users, 
  totalElements, 
  page, 
  rowsPerPage, 
  onEdit, 
  onDelete,
  onPageChange,
  onSearch,
  searchTerm = '' // Valor default
}: UsersTableProps) {
  // Estado de busca local - mantém o que está sendo digitado sem atualizar o pai imediatamente
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Referência para o temporizador de debounce
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Atualizar o termo de busca local quando a prop mudar
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);
  
  // Função para lidar com a mudança no campo de busca
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    
    // Atualiza o termo de busca local imediatamente (sem piscar a tela)
    setLocalSearchTerm(newSearchTerm);
    
    // Limpa o temporizador anterior se existir
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Para termos muito curtos ou vazios, podemos atualizar mais rapidamente
    const delayTime = !newSearchTerm.trim() || newSearchTerm.length <= 2 ? 300 : 600;
    
    // Após um período sem digitar, atualiza o termo de busca no componente pai
    timerRef.current = setTimeout(() => {
      if (onSearch && localSearchTerm !== searchTerm) {
        console.log(`Atualizando busca no servidor: "${newSearchTerm}"`);
        onSearch(newSearchTerm);
      }
    }, delayTime);
  };

  // Limpeza do temporizador quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handler para mudança de página prevenindo o comportamento padrão
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    // Evitar o comportamento padrão que pode causar redirecionamento
    if (event) {
      event.preventDefault();
    }
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Memoriza a tabela para evitar re-renderização quando o termo de busca local muda
  // mas os dados não mudaram
  const memoizedTableContent = useMemo(() => (
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
            <th style={{ padding: '16px', textAlign: 'left', color: '#FFD700' }}>Nome</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#FFD700' }}>Email</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#FFD700' }}>Status</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#FFD700' }}>Perfil</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#FFD700' }}>Criado em</th>
            <th style={{ padding: '16px', textAlign: 'center', color: '#FFD700', width: '120px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(224, 224, 224, 0.4)' }}>
                <td style={{ padding: '16px', color: '#fff' }}>{user.name}</td>
                <td style={{ padding: '16px', color: '#fff' }}>{user.email}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    backgroundColor: user.active ? '#4CAF50' : '#f44336',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '0.875rem'
                  }}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#fff' }}>
                  {user.roles.map(role => role.authority).join(', ')}
                </td>
                <td style={{ padding: '16px', color: '#fff' }}>
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <IconButton
                    onClick={() => onEdit(user.id)}
                    sx={{ 
                      color: '#FFD700', 
                      mr: 1,
                      '&:hover': {
                        bgcolor: 'rgba(255, 215, 0, 0.1)',
                      }
                    }}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(user.id)}
                    sx={{ 
                      color: '#f44336',
                      '&:hover': {
                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                      }
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#fff' }}>
                Nenhum usuário encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Box>
  ), [users, onEdit, onDelete]); // Só refaz quando users, onEdit, ou onDelete mudam
  
  // @ts-ignore
  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar usuários..."
          value={localSearchTerm}
          onChange={handleSearchChange}
          // Usa estado local para evitar piscar a tela
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#FFD700' }} />
              </InputAdornment>
            ),
            endAdornment: localSearchTerm ? (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => {
                    // Limpa imediatamente na interface
                    setLocalSearchTerm('');
                    // Notifica o componente pai
                    if (onSearch) onSearch('');
                  }}
                  edge="end"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#FFD700',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFD700',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1,
            },
          }}
        />
      </Box>

      {memoizedTableContent}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Itens por página: {rowsPerPage}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {users.length > 0 ? `${((page - 1) * rowsPerPage) + 1}-${Math.min(page * rowsPerPage, totalElements)} de ${totalElements}` : '0-0 de 0'}
          </Typography>
          <Pagination
            count={Math.ceil(totalElements / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#FFD700',
                '&.Mui-selected': {
                  bgcolor: '#FFD700',
                  color: 'black',
                  '&:hover': {
                    bgcolor: '#FFD700',
                    opacity: 0.8,
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 215, 0, 0.1)',
                },
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
} 