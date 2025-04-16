'use client';

import { useState, useEffect } from 'react';
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await UserService.getUsers(page, rowsPerPage);
      setUsers(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Erro ao carregar usuários. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage]);

  const handleNewUser = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (data: UserFormData) => {
    // Aqui você implementará a lógica para salvar o novo usuário
    console.log('Novo usuário:', data);
    setIsFormVisible(false);
    await loadUsers(); // Recarrega a lista após criar
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
  };

  const handleEditUser = (userId: number) => {
    console.log('Editar usuário:', userId);
    // Implementar lógica de edição
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
      if (users.length === 1 && page > 0) {
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
          <UserForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
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
        
        {/* Diálogo de confirmação de exclusão */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={cancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirmar exclusão"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={cancelDelete} 
              color="primary"
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              autoFocus
              disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={24} /> : "Excluir"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
} 