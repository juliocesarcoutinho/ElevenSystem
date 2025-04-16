'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UsersTable } from '@/components/users/UsersTable';
import { UserForm } from '@/components/users/UserForm';
import { UserService } from '@/services/UserService';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  roles: {
    id: number;
    authority: string;
  }[];
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  active: boolean;
  roles: string[];
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    console.log('Novo usuário:', data);
    setIsFormVisible(false);
    await loadUsers();
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
  };

  const handleEditUser = (userId: number) => {
    console.log('Editar usuário:', userId);
    // Implementar lógica de edição
  };
  
  const handleDeleteUser = (userId: number) => {
    console.log('Excluir usuário:', userId);
    // Implementar lógica de exclusão
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
      </Box>
    </DashboardLayout>
  );
} 