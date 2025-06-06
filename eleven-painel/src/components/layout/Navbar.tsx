import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {LoginService} from '@/services/LoginService';

interface NavbarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export function Navbar({isSidebarOpen, toggleSidebar}: NavbarProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setNotificationAnchorEl(null);
    };

    const handleLogout = () => {
        LoginService.logout();
        router.push('/');
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: '#242424',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            }}
        >
            <Toolbar sx={{px: 3, minHeight: 64}}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleSidebar}
                    sx={{
                        mr: 2,
                        display: {xs: 'flex', md: 'none'},
                        color: 'white',
                        '&:hover': {
                            color: '#FFD700',
                        }
                    }}
                >
                    <MenuIcon/>
                </IconButton>

                {!isSidebarOpen && (
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            color: '#FFD700',
                            fontWeight: 'bold',
                        }}
                    >
                        Eleven Juventude
                    </Typography>
                )}
                <Box sx={{flexGrow: 1}}/>

                <Box>
                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={handleNotificationMenu}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                color: '#FFD700',
                            }
                        }}
                    >
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={handleProfileMenu}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                color: '#FFD700',
                            }
                        }}
                    >
                        <AccountCircleIcon/>
                    </IconButton>
                </Box>

                <Menu
                    id="notification-menu"
                    anchorEl={notificationAnchorEl}
                    open={Boolean(notificationAnchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            backgroundColor: '#242424',
                            color: 'white',
                            minWidth: 250,
                        }
                    }}
                >
                    <MenuItem onClick={handleClose} sx={{gap: 1}}>
                        <Typography variant="body2">Nova mensagem recebida</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose} sx={{gap: 1}}>
                        <Typography variant="body2">Novo pedido de oração</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose} sx={{gap: 1}}>
                        <Typography variant="body2">Novo evento criado</Typography>
                    </MenuItem>
                </Menu>

                <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            backgroundColor: '#242424',
                            color: 'white',
                        }
                    }}
                >
                    <MenuItem onClick={() => {
                        handleClose();
                        router.push('/profile');
                    }} sx={{gap: 1}}>
                        <PersonIcon fontSize="small" sx={{color: '#FFD700'}}/>
                        <Typography>Perfil</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{gap: 1}}>
                        <ExitToAppIcon fontSize="small" sx={{color: '#FFD700'}}/>
                        <Typography>Sair</Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
} 