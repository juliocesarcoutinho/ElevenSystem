'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import { UserService } from '@/services/UserService';
import { UsersTable } from '@/components/users/UsersTable';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  roles: { id: number; authority: string; }[];
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await UserService.getUsers();
      setUsers(response.content);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId: number) => {
    console.log('Editar usuário:', userId);
  };

  const handleDelete = (userId: number) => {
    console.log('Deletar usuário:', userId);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error">Erro: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: '#fff' }}>
          Usuários
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#FFD700',
            color: 'black',
            '&:hover': {
              bgcolor: '#FFD700',
              opacity: 0.9
            }
          }}
        >
          NOVO USUÁRIO
        </Button>
      </Box>

      <UsersTable 
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Container>
  );
}