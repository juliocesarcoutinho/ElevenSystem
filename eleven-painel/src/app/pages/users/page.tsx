'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UsersTable } from '@/components/users/UsersTable';
import { UserForm } from '@/components/users/UserForm';
import { UserService, User, UserFormData } from '@/services/UserService';
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
  const [users, setUsers] = useState<User[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Removida a variável isSaving para evitar o aviso, mantendo apenas o setter
  const [, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para exclusão
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estados para edição
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  // Estado para armazenar erros de campo da API
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await UserService.getUsers(page, rowsPerPage);
      setUsers(response.content);
      setTotalElements(response.totalElements);
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
  }, [page, rowsPerPage]);
  
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleNewUser = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      setIsSaving(true);
      setFieldErrors({});
      await UserService.createUser(data);
      setIsFormVisible(false);
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
          
          setError(`Erro na validação: ${errorMessages}`);
        } else if (apiError.message) {
          // Usa a mensagem de erro da API
          setError(`Erro: ${apiError.message}`);
        } else {
          setError('Erro ao criar usuário. Por favor, tente novamente.');
        }
      } else {
        setError('Erro ao criar usuário. Por favor, tente novamente.');
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
      // Certifica-se de que as roles estão no formato correto antes de enviar
      await UserService.updateUser(userToEdit.id, data);
      setEditDialogOpen(false);
      setUserToEdit(null);
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
          
          setError(`Erro na validação: ${errorMessages}`);
        } else if (apiError.message) {
          // Usa a mensagem de erro da API
          setError(`Erro: ${apiError.message}`);
        } else {
          setError('Erro ao atualizar usuário. Por favor, tente novamente.');
        }
      } else {
        setError('Erro ao atualizar usuário. Por favor, tente novamente.');
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
      await UserService.deleteUser(userToDelete);
      
      // Remove o usuário da lista local para atualização imediata da UI
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
      setTotalElements(prev => prev - 1);
      
      // Fecha o diálogo de confirmação
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      
      // Se a página atual ficar vazia após a exclusão e não for a primeira página, 
      // volta para a página anterior
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        // Senão, apenas recarrega os dados
        await loadUsers();
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setError('Erro ao excluir usuário. Por favor, tente novamente.');
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

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              backgroundColor: '#ff44447a',
              color: '#fff',
              '.MuiAlert-icon': {
                color: '#ff4444'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#FFD700' }} />
          </Box>
        ) : isFormVisible ? (
          <UserForm 
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            apiErrors={fieldErrors}
          />
        ) : (
          <UsersTable
            users={users}
            totalElements={totalElements}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
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