import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface UsersTableProps {
  users: User[];
  totalElements: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

export function UsersTable({
  users,
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: UsersTableProps) {
  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Paper 
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        backgroundColor: '#242424',
        borderRadius: 2,
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  backgroundColor: '#1a1a1a',
                  color: '#FFD700',
                  fontWeight: 'bold',
                }}
              >
                Nome
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: '#1a1a1a',
                  color: '#FFD700',
                  fontWeight: 'bold',
                }}
              >
                Email
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: '#1a1a1a',
                  color: '#FFD700',
                  fontWeight: 'bold',
                }}
              >
                Status
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: '#1a1a1a',
                  color: '#FFD700',
                  fontWeight: 'bold',
                }}
              >
                Perfil
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: '#1a1a1a',
                  color: '#FFD700',
                  fontWeight: 'bold',
                }}
              >
                Criado em
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.08)',
                  },
                }}
              >
                <TableCell sx={{ color: 'white' }}>{user.name}</TableCell>
                <TableCell sx={{ color: 'white' }}>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.active ? 'Ativo' : 'Inativo'}
                    color={user.active ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {user.roles.map(role => role.authority).join(', ')}
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {format(new Date(user.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[12, 25, 50]}
        labelRowsPerPage="Itens por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{
          color: 'white',
          '.MuiTablePagination-select': {
            color: 'white',
          },
          '.MuiTablePagination-selectIcon': {
            color: 'white',
          },
          '.MuiTablePagination-displayedRows': {
            color: 'white',
          },
          '.MuiTablePagination-actions': {
            color: 'white',
          },
        }}
      />
    </Paper>
  );
} 