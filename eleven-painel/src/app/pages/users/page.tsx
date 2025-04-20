'use client';

import {useState, useEffect, useCallback, useRef} from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UsersTable } from '@/components/users/UsersTable';
import { UserForm } from '@/components/users/UserForm';
import { UserService, User, UserFormData } from '@/services/UserService';
import { useToast } from '@/contexts/ToastContext';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function UsuariosPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]); // Armazena todos os usuários para busca local
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Estados para exclusão
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estados para edição
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  // Estado para armazenar erros de campo da API
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Cache para resultados de busca - evita recalcular as mesmas buscas
  const searchResultsCache = useRef<{[key: string]: User[]}>({});
  
  // Função otimizada para filtrar usuários localmente
  const filterUsers = useCallback((users: User[], term: string) => {
    // Retorna todos os usuários se o termo estiver vazio
    if (!term || term.trim() === '') {
      return users;
    }
    
    const normalizedTerm = term.toLowerCase().trim();
    
    // Verifica se já temos esta busca em cache
    const cacheKey = `${normalizedTerm}-${users.length}`;
    if (searchResultsCache.current[cacheKey]) {
      console.log('Usando resultado em cache para:', normalizedTerm);
      return searchResultsCache.current[cacheKey];
    }
    
    console.log('Executando nova busca para:', normalizedTerm);
    
    // Termos individuais para busca mais precisa (dividir por espaço)
    const searchTerms = normalizedTerm.split(/\s+/).filter(t => t.length > 0);
    
    // Se não tiver termos após dividir, usa o original
    const terms = searchTerms.length > 0 ? searchTerms : [normalizedTerm];
    
    // Filtro otimizado - faz pré-processamento dos dados
    const result = users.filter(user => {
      const userName = user.name.toLowerCase();
      const userEmail = user.email.toLowerCase();
      
      // Verificação rápida: se o nome ou email contém exatamente o termo completo
      if (userName.includes(normalizedTerm) || userEmail.includes(normalizedTerm)) {
        return true;
      }
      
      // Se estamos procurando por múltiplos termos, verifica se todos estão presentes
      if (terms.length > 1) {
        return terms.every(term => 
          userName.includes(term) || userEmail.includes(term)
        );
      }
      
      return false;
    });
    
    // Armazena o resultado em cache para futuras buscas
    searchResultsCache.current[cacheKey] = result;
    
    return result;
  }, []);
  
  // Função para lidar com a busca - agora com capacidade de filtro local
  const handleSearch = useCallback((query: string) => {
    console.log(`Atualizando busca: "${query}"`);
    setSearchTerm(query);
    
    // Reset para a primeira página ao fazer uma nova busca
    setPage(1);
    
    // Não mostrar indicador de busca para buscas rápidas locais
    if (allUsers.length > 0 && !isInitialLoad) {
      // Se temos todos os usuários em cache, filtramos localmente sem piscar a tela
      const filtered = filterUsers(allUsers, query);
      console.log(`Filtrado localmente: ${filtered.length} resultados`);
      
      setUsers(filtered.slice(0, rowsPerPage));
      setTotalElements(filtered.length);
      return;
    }
  
    // Se não temos cache ou é a carga inicial, fazemos a busca no servidor
    setIsSearching(true);
    
    // Adiciona pequeno atraso para permitir a renderização do indicador
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  }, [allUsers, filterUsers, isInitialLoad, rowsPerPage]);
  
  // Função para lidar com a mudança de página
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    
    // Se temos todos os usuários em cache, podemos paginar localmente sem recarregar
    if (allUsers.length > 0 && !isInitialLoad) {
      const filteredUsers = searchTerm.trim() 
        ? filterUsers(allUsers, searchTerm)
        : allUsers;
        
      const start = (newPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      setUsers(filteredUsers.slice(start, end));
    }
  }, [allUsers, filterUsers, isInitialLoad, rowsPerPage, searchTerm]);

  // Carrega os usuários com os parâmetros atuais
  const loadUsers = useCallback(async () => {
    try {
      // Limpar o cache de resultados quando recarregar usuários
      searchResultsCache.current = {};
      
      setIsLoading(true);
      setError(null);
      // Não limpa mensagens de sucesso aqui, para que o usuário possa ver a confirmação
      console.log(`Carregando usuários: página ${page}, busca "${searchTerm}"`);
      
      // Se é a primeira carga ou não temos busca, carregamos todos os usuários para cache local
      if (isInitialLoad || allUsers.length === 0) {
        console.log("Carregando todos os usuários para cache local");
        try {
          const allUsersResponse = await UserService.getAllUsers();
          setAllUsers(allUsersResponse);
          setIsInitialLoad(false);
          
          // Se temos um termo de busca, filtramos localmente
          if (searchTerm.trim()) {
            const filtered = filterUsers(allUsersResponse, searchTerm);
            setUsers(filtered.slice((page-1) * rowsPerPage, page * rowsPerPage));
            setTotalElements(filtered.length);
          } else {
            // Sem busca, exibimos a página atual
            setUsers(allUsersResponse.slice((page-1) * rowsPerPage, page * rowsPerPage));
            setTotalElements(allUsersResponse.length);
          }
        } catch (e) {
          console.error("Erro ao carregar todos os usuários:", e);
          // Fallback para carregamento paginado da API
          const response = await UserService.getUsers(page, rowsPerPage, 'name,asc', searchTerm);
          setUsers(response.content);
          setTotalElements(response.totalElements);
        }
      } else {
        // Já temos todos os usuários, apenas filtramos e paginamos localmente
        // Usar técnica de memo para evitar recálculos repetidos
        if (allUsers.length > 0) {
          const startTime = performance.now();
          
          const filteredUsers = searchTerm.trim()
            ? filterUsers(allUsers, searchTerm)
            : allUsers;
            
          setTotalElements(filteredUsers.length);
          
          // Paginação local
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          setUsers(filteredUsers.slice(start, end));
          
          const endTime = performance.now();
          console.log(`Filtragem e paginação: ${endTime - startTime}ms`);
        }
      }
    } catch (error: unknown) {
      console.error('Error loading users:', error);
      // Verificando se o erro é uma instância de Error
      if (error instanceof Error && error.message === 'Usuário não autenticado') {
        setError('Sessão expirada. Por favor, faça login novamente.');
        // Redirecionar para a página de login
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        setError('Erro ao carregar usuários. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, allUsers, isInitialLoad, filterUsers]);
  
  // Efeito para carregar os usuários quando os parâmetros mudarem
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  
  // Efeito para limpar erros quando componente é montado
  useEffect(() => {
    // Limpa erros quando o componente é montado
    setError(null);
    
    // Limpa qualquer erro pendente ao desmontar
    return () => {
      setError(null);
    };
  }, []);

  const handleNewUser = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      setIsSaving(true);
      setFieldErrors({});
      setError(null); // Limpa qualquer erro anterior
      
      await UserService.createUser(data);
      
      // Exibe notificação de sucesso
      showToast(`Usuário "${data.name}" criado com sucesso!`, 'success');
      
      setIsFormVisible(false);
      
      // Limpar o cache local para forçar uma recarga completa
      setAllUsers([]);
      setIsInitialLoad(true);
      
      await loadUsers(); // Recarrega a lista após criar
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      
      // Tenta extrair a mensagem de erro da resposta da API
      if (error.response && error.response.data) {
        const apiError = error.response.data;
        
        // Verifica se temos erros de validação de campo
        if (apiError.errors && apiError.errors.length > 0) {
          // Cria um objeto de erros para os campos específicos
          const newFieldErrors: { [key: string]: string } = {};
          
          apiError.errors.forEach((err: any) => {
            newFieldErrors[err.fieldName] = err.message;
          });
          
          setFieldErrors(newFieldErrors);
          
          const errorMessages = apiError.errors.map((err: any) => 
            `Campo ${err.fieldName}: ${err.message}`
          ).join('. ');
          
          // Mostrar erro de validação como toast
          showToast(`Erro na validação: ${errorMessages}`, 'error');
        } else if (apiError.message) {
          // Usa a mensagem de erro da API
          showToast(`Erro: ${apiError.message}`, 'error');
        } else {
          showToast('Erro ao criar usuário. Por favor, tente novamente.', 'error');
        }
      } else {
        showToast('Erro ao criar usuário. Por favor, tente novamente.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
  };

  const handleEditUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToEdit(user);
      setEditDialogOpen(true);
    }
  };
  
  const handleUpdateUser = async (data: UserFormData) => {
    if (!userToEdit) return;
    
    try {
      setIsSaving(true);
      setFieldErrors({});
      setError(null); // Limpa qualquer erro anterior
      
      // Certifica-se de que as roles estão no formato correto antes de enviar
      await UserService.updateUser(userToEdit.id, data);
      
      // Exibe notificação de sucesso
      showToast(`Usuário "${data.name}" atualizado com sucesso!`, 'success');
      
      setEditDialogOpen(false);
      setUserToEdit(null);
      
      // Limpar o cache local para forçar uma recarga completa
      setAllUsers([]);
      setIsInitialLoad(true);
      
      await loadUsers(); // Recarrega a lista após atualizar
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      
      // Tenta extrair a mensagem de erro da resposta da API
      if (error.response && error.response.data) {
        const apiError = error.response.data;
        
        // Verifica se temos erros de validação de campo
        if (apiError.errors && apiError.errors.length > 0) {
          // Cria um objeto de erros para os campos específicos
          const newFieldErrors: { [key: string]: string } = {};
          
          apiError.errors.forEach((err: any) => {
            newFieldErrors[err.fieldName] = err.message;
          });
          
          setFieldErrors(newFieldErrors);
          
          const errorMessages = apiError.errors.map((err: any) => 
            `Campo ${err.fieldName}: ${err.message}`
          ).join('. ');
          
          // Mostrar erro de validação como toast
          showToast(`Erro na validação: ${errorMessages}`, 'error');
        } else if (apiError.message) {
          // Usa a mensagem de erro da API
          showToast(`Erro: ${apiError.message}`, 'error');
        } else {
          showToast('Erro ao atualizar usuário. Por favor, tente novamente.', 'error');
        }
      } else {
        showToast('Erro ao atualizar usuário. Por favor, tente novamente.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setUserToEdit(null);
  };
  
  const handleDeleteUser = (userId: number) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    if (userToDelete === null) return;
    
    try {
      setIsDeleting(true);
      setError(null); // Limpa qualquer erro anterior
      
      // Salva o nome do usuário antes de excluí-lo para usar na mensagem
      const userToBeDeleted = allUsers.find(user => user.id === userToDelete);
      const userName = userToBeDeleted ? userToBeDeleted.name : "Usuário";
      
      await UserService.deleteUser(userToDelete);
      
      // Exibe notificação de sucesso
      showToast(`Usuário "${userName}" excluído com sucesso!`, 'success');
      
      // Remove o usuário da lista local para atualização imediata da UI
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
      
      // Também atualiza o cache local completo
      setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
      
      setTotalElements(prev => prev - 1);
      
      // Fecha o diálogo de confirmação
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      
      // Fecha o diálogo de confirmação, independentemente do tipo de erro
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      
      // Verifica se é um erro 403 (usando a propriedade isForbidden ou o status da resposta)
      if (error.isForbidden || (error.response && error.response.status === 403)) {
        // Exibimos a mensagem de erro de permissão negada
        showToast('Acesso negado. Você não tem permissão para excluir este usuário.', 'error');
      } else {
        // Para outros tipos de erro, mostramos uma mensagem genérica
        showToast('Erro ao excluir usuário. Por favor, tente novamente.', 'error');
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };
  
  // Configuração comum para os diálogos
  const dialogPaperProps = {
    sx: {
      backgroundColor: '#242424',
      color: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    }
  };
  
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" color="white">
            Usuários
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {searchTerm && !isFormVisible && (
              <Button
                variant="outlined"
                onClick={() => handleSearch('')}
                sx={{
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                Limpar Busca
              </Button>
            )}
            {!isFormVisible && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNewUser}
                sx={{
                  backgroundColor: '#FFD700',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#FFD700CC',
                  },
                }}
              >
                Novo Usuário
              </Button>
            )}
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
            sx={{ 
              mb: 2,
              backgroundColor: '#ff44447a',
              color: '#fff',
              '.MuiAlert-icon': {
                color: '#ff4444'
              },
              '.MuiAlert-action': {
                color: '#fff',
              }
            }}
          >
            {error}
          </Alert>
        )}

        {isFormVisible ? (
          <UserForm 
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            apiErrors={fieldErrors}
          />
        ) : (
          <>
            {isLoading || isSearching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
                {isSearching && !isLoading && (
                  <Typography variant="body1" sx={{ ml: 2, color: '#FFD700' }}>
                    Buscando usuários...
                  </Typography>
                )}
              </Box>
            ) : null}
            
            {/* Mantém a tabela visível enquanto carrega para evitar reconstrução */}
            <Box sx={{ 
              opacity: isLoading || isSearching ? 0.4 : 1,
              transition: 'opacity 0.2s',
              pointerEvents: isLoading || isSearching ? 'none' : 'auto'
            }}>
              <UsersTable
                users={users}
                totalElements={totalElements}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={setRowsPerPage}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onSearch={handleSearch}
                searchTerm={searchTerm}
              />
            </Box>
          </>
        )}
        
        {/* Diálogo de edição de usuário */}
        <Dialog
          open={editDialogOpen}
          onClose={handleCancelEdit}
          fullWidth
          maxWidth="md"
          PaperProps={dialogPaperProps}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#FFD700',
            px: 3,
            py: 2
          }}>
            Editar Usuário
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {userToEdit && (
              <UserForm 
                onSubmit={handleUpdateUser} 
                onCancel={handleCancelEdit}
                editingUser={userToEdit}
                apiErrors={fieldErrors}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {/* Diálogo de confirmação de exclusão */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={cancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={dialogPaperProps}
        >
          <DialogTitle id="alert-dialog-title" sx={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#FFD700'
          }}>
            Confirmar exclusão
          </DialogTitle>
          <DialogContent sx={{ my: 2 }}>
            <DialogContentText id="alert-dialog-description" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            px: 3,
            py: 2
          }}>
            <Button 
              onClick={cancelDelete} 
              variant="outlined"
              disabled={isDeleting}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: '#FFD700',
                  color: '#FFD700',
                },
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmDelete} 
              variant="contained"
              autoFocus
              disabled={isDeleting}
              sx={{
                ml: 2,
                backgroundColor: '#ff4444',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#ff5555',
                },
              }}
            >
              {isDeleting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Excluir"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
} 