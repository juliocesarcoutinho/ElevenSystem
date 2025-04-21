'use client';

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
import ClearIcon from '@mui/icons-material/Clear';
import {useEffect, useMemo, useRef, useState} from 'react';
import {UserWithProfileService} from '@/services/UserWithProfileService';

interface UserWithProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    motherName: string;
    fatherName: string;
    addresses: {
        street: string;
        number: string;
        district: string;
        city: string;
        uf: string;
    }[];
}

export function UsersWithProfilesTable() {
    const [users, setUsers] = useState<UserWithProfile[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const response = await UserWithProfileService.getUsersWithProfiles(
                page,
                rowsPerPage,
                'name,asc',
                searchTerm
            );
            setUsers(response.content);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [page, rowsPerPage, searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setLocalSearchTerm(newSearchTerm);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setSearchTerm(newSearchTerm);
            setPage(1); // Reset para a primeira página ao buscar
        }, 500);
    };

    const handleClearSearch = () => {
        setLocalSearchTerm('');
        setSearchTerm('');
        setPage(1);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const formatAddress = (addresses: UserWithProfile['addresses']) => {
        if (!addresses?.length) return 'N/A';
        const {street, number, district, city, uf} = addresses[0];
        return `${street}, ${number} - ${district}, ${city}/${uf}`;
    };

    const memoizedTableContent = useMemo(() => {
        if (isLoading) {
            return (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                    <CircularProgress sx={{color: '#FFD700'}}/>
                </Box>
            );
        }

        if (!users.length) {
            return (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                    <Typography color="white">
                        {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum usuário cadastrado'}
                    </Typography>
                </Box>
            );
        }

        return (
            <TableContainer component={Paper} sx={{backgroundColor: '#1a1a1a'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Nome</TableCell>
                            <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Telefone</TableCell>
                            <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Mãe</TableCell>
                            <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Pai</TableCell>
                            <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Endereço</TableCell>
                            <TableCell sx={{color: '#FFD700', fontWeight: 'bold'}}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover sx={{'&:hover': {backgroundColor: '#333'}}}>
                                <TableCell sx={{color: 'white'}}>{user.name}</TableCell>
                                <TableCell sx={{color: 'white'}}>{user.phone}</TableCell>
                                <TableCell sx={{color: 'white'}}>{user.motherName}</TableCell>
                                <TableCell sx={{color: 'white'}}>{user.fatherName}</TableCell>
                                <TableCell sx={{color: 'white'}}>{formatAddress(user.addresses)}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => console.log('Editar', user.id)} sx={{color: '#FFD700'}}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => console.log('Excluir', user.id)} sx={{color: '#f44336'}}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }, [users, isLoading, searchTerm]);

    return (
        <Box sx={{width: '100%', backgroundColor: '#121212', borderRadius: 2, boxShadow: 3}}>
            <Typography variant="h4" sx={{p: 3, color: 'white'}}>
                Usuarios / Adolescentes
            </Typography>
            <Box sx={{p: 3, backgroundColor: '#1a1a1a', color: 'white'}}>

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar usuários..."
                    value={localSearchTerm}
                    onChange={handleSearchChange}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {borderColor: '#FFD700'},
                            '&:hover fieldset': {borderColor: '#FFD700'},
                            '&.Mui-focused fieldset': {borderColor: '#FFD700'},
                        },
                        '& .MuiInputBase-input': {
                            color: 'white',
                            '&::placeholder': {opacity: 1, color: '#aaa'}
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{color: '#FFD700'}}/>
                            </InputAdornment>
                        ),
                        endAdornment: localSearchTerm && (
                            <IconButton onClick={handleClearSearch} sx={{color: '#FFD700'}}>
                                <ClearIcon/>
                            </IconButton>
                        ),
                    }}
                />

                {memoizedTableContent}

                <Box sx={{mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="body2" sx={{color: 'rgba(255, 255, 255, 0.7)'}}>
                        Itens por página: {rowsPerPage}
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <Typography variant="body2" sx={{color: 'rgba(255, 255, 255, 0.7)'}}>
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
            </Box>
        </Box>
    );
}