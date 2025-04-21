import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Chat as ChatIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    Event as EventIcon,
    ExitToApp as LogoutIcon,
    Favorite as PrayerIcon,
    Menu as MenuIcon,
    Message as MessageIcon,
    People as PeopleIcon,
    PersonSharp,
} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import {LoginService} from '@/services/LoginService';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

interface MenuDivider {
    type: 'divider';
}

interface MenuLink {
    type?: never;
    text: string;
    icon: React.ReactNode;
    path?: string;
    isLogout?: boolean;
    color?: string;
}

type MenuItem = MenuLink | MenuDivider;

export function Sidebar({isOpen, onToggle}: SidebarProps) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems: MenuItem[] = [
        {text: 'Dashboard', icon: <DashboardIcon/>, path: '/pages/dashboard'},
        {text: 'Mensagens', icon: <MessageIcon/>, path: '/pages/messages'},
        {text: 'Eventos', icon: <EventIcon/>, path: '/pages/events'},
        {text: 'Pedidos de Oração', icon: <PrayerIcon/>, path: '/pages/prayers'},
        {text: 'Chat', icon: <ChatIcon/>, path: '/pages/chat'},
        {text: 'Adolescentes', icon: <PersonSharp/>, path: '/pages/persons'},
        {text: 'Usuários', icon: <PeopleIcon/>, path: '/pages/users'},
        {type: 'divider'},
        {text: 'Sair', icon: <LogoutIcon/>, isLogout: true, color: '#FFD700'}
    ];

    const handleLogout = () => {
        LoginService.logout();
        router.push('/');
    };

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? isOpen : true}
            onClose={isMobile ? onToggle : undefined}
            sx={{
                width: isOpen ? 240 : (isMobile ? 0 : 73),
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: isOpen ? 240 : (isMobile ? 240 : 73),
                    boxSizing: 'border-box',
                    backgroundColor: '#242424',
                    color: 'white',
                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                    overflowX: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: isOpen ? '8px' : '4px',
                    minHeight: 64,
                    '& .MuiIconButton-root': {
                        padding: isOpen ? '8px' : '4px',
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: isOpen ? 'space-between' : 'center',
                        alignItems: 'center',
                    }}
                >
                    {isOpen && (
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#FFD700',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                textAlign: 'center',
                                flex: 1,
                            }}
                        >
                            Eleven
                        </Typography>
                    )}
                    <IconButton
                        onClick={onToggle}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                color: '#FFD700',
                            },
                        }}
                    >
                        {isOpen ? <ChevronLeftIcon/> : <MenuIcon/>}
                    </IconButton>
                </Box>
            </Box>

            <Divider sx={{borderColor: 'rgba(255, 255, 255, 0.12)'}}/>

            <List sx={{pt: 1}}>
                {menuItems.map((item, index) => (
                    'type' in item && item.type === 'divider' ? (
                        <Divider
                            key={`divider-${index}`}
                            sx={{
                                my: 1,
                                borderColor: 'rgba(255, 255, 255, 0.12)'
                            }}
                        />
                    ) : (
                        <ListItem
                            key={item.text}
                            onClick={item.isLogout ? handleLogout : () => item.path && router.push(item.path)}
                            sx={{
                                minHeight: 48,
                                justifyContent: isOpen ? 'initial' : 'center',
                                px: 2.5,
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 215, 0, 0.08)',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isOpen ? 2 : 'auto',
                                    justifyContent: 'center',
                                    color: item.color || 'white',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    opacity: isOpen ? 1 : 0,
                                    color: item.color || 'white',
                                    m: 0,
                                }}
                            />
                        </ListItem>
                    )
                ))}
            </List>
        </Drawer>
    );
} 