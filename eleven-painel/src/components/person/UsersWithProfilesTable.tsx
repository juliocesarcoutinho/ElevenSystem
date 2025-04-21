'use client';
import {useEffect, useState} from 'react';
import {UserWithProfile, UserWithProfileService} from '@/services/UserWithProfileService';
import {
    Box,
    CircularProgress,
    IconButton,
    InputAdornment,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export function UsersWithProfilesTable() {
    const [users, setUsers] = useState<UserWithProfile[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserWithProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: 'name'; direction: 'ascending' | 'descending' }>({
        key: 'name',
        direction: 'ascending'
    });

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true);
            try {
                const response = await UserWithProfileService.getAllUsersWithProfiles(page - 1, rowsPerPage, 'name,asc');
                setUsers(response.content);
                setFilteredUsers(response.content);
                setTotalElements(response.totalElements);
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, [page, rowsPerPage]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers([...users]);
            return;
        }

        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fatherName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    useEffect(() => {
        const sortedUsers = [...filteredUsers].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setFilteredUsers(sortedUsers);
    }, [sortConfig]);

    const requestSort = (key: 'name') => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    const formatAddress = (addresses: any[]) => {
        if (!addresses || addresses.length === 0) return 'N/A';
        const address = addresses[0];
        return `${address.street}, ${address.number} - ${address.district}, ${address.city}/${address.uf}`;
    };

    const handleEdit = (userId: number) => {
        // Implementar lógica de edição
        console.log('Editar usuário:', userId);
    };

    const handleDelete = (userId: number) => {
        // Implementar lógica de exclusão
        console.log('Excluir usuário:', userId);
    };

    return (
        <Box sx={{p: 3, backgroundColor: '#1a1a1a', color: 'white'}}>
            <Typography variant="h4" sx={{mb: 1, color: 'white', fontWeight: 'bold'}}>
                Usuários com Perfis
            </Typography>
            <TextField
                placeholder="Digite para buscar..."
                variant="outlined"
                fullWidth
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#FFD700',
                        },
                        '&:hover fieldset': {
                            borderColor: '#FFD700',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FFD700',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: 'white',
                        '&::placeholder': {
                            opacity: 1,
                            color: '#aaa'
                        }
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{color: '#FFD700'}}/>
                        </InputAdornment>
                    ),
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                    <CircularProgress sx={{color: '#FFD700'}}/>
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper} sx={{backgroundColor: '#1a1a1a'}}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor: '#333'}}>
                                    <TableCell
                                        sx={{color: '#FFD700', fontWeight: 'bold', cursor: 'pointer'}}
                                        onClick={() => requestSort('name')}
                                    >
                                        Nome
                                        {sortConfig.key === 'name' && (
                                            sortConfig.direction === 'ascending' ?
                                                <ArrowUpwardIcon sx={{ml: 1, fontSize: '1rem'}}/> :
                                                <ArrowDownwardIcon sx={{ml: 1, fontSize: '1rem'}}/>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Telefone</TableCell>
                                    <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Mãe</TableCell>
                                    <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Pai</TableCell>
                                    <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Endereço</TableCell>
                                    <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} sx={{'&:hover': {backgroundColor: '#333'}}}>
                                        <TableCell sx={{color: 'white'}}>{user.name}</TableCell>
                                        <TableCell sx={{color: 'white'}}>{user.phone}</TableCell>
                                        <TableCell sx={{color: 'white'}}>{user.motherName}</TableCell>
                                        <TableCell sx={{color: 'white'}}>{user.fatherName}</TableCell>
                                        <TableCell sx={{color: 'white'}}>{formatAddress(user.addresses)}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleEdit(user.id)}
                                                sx={{
                                                    color: '#FFD700',
                                                    mr: 1,
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255, 215, 0, 0.1)',
                                                    }
                                                }}
                                                size="small"
                                            >
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(user.id)}
                                                sx={{
                                                    color: '#f44336',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                                                    }
                                                }}
                                                size="small"
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 3, p: 2}}>
                        <Pagination
                            count={Math.ceil(totalElements / rowsPerPage)}
                            page={page}
                            onChange={(e, newPage) => setPage(newPage)}
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: '#FFD700',
                                    '&.Mui-selected': {
                                        backgroundColor: '#FFD700',
                                        color: 'black',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#FFD70022',
                                    },
                                },
                            }}
                        />
                    </Box>
                </>
            )}
        </Box>
    );
}