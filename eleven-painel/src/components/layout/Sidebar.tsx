import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Message as MessageIcon,
  Event as EventIcon,
  Favorite as PrayerIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { LoginService } from '@/services/LoginService';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/pages/dashboard' },
    { text: 'Mensagens', icon: <MessageIcon />, path: '/pages/mensagens' },
    { text: 'Eventos', icon: <EventIcon />, path: '/pages/eventos' },
    { text: 'Pedidos de Oração', icon: <PrayerIcon />, path: '/pages/oracoes' },
    { text: 'Chat', icon: <ChatIcon />, path: '/pages/chat' },
    { text: 'Usuários', icon: <PeopleIcon />, path: '/pages/usuarios' },
  ];

  const handleLogout = () => {
    LoginService.logout();
    router.push('/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? 240 : 73,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isOpen ? 240 : 73,
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
          padding: '16px 8px',
          minHeight: isOpen ? 100 : 60,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: isOpen ? 'space-between' : 'center',
            alignItems: 'center',
            mb: isOpen ? 2 : 0,
          }}
        >
          {isOpen ? (
            <Typography
              variant="h6"
              sx={{
                color: '#FFD700',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                lineHeight: 1.2,
                textAlign: 'center',
                flex: 1,
              }}
            >
              Eleven<br />Juventude
            </Typography>
          ) : null}
          <IconButton
            onClick={onToggle}
            sx={{
              color: 'white',
              '&:hover': {
                color: '#FFD700',
              },
            }}
          >
            {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => router.push(item.path)}
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
                color: 'white',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                opacity: isOpen ? 1 : 0,
                color: 'white',
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

      <List>
        <ListItem
          onClick={handleLogout}
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
              color: '#FFD700',
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sair"
            sx={{
              opacity: isOpen ? 1 : 0,
              color: '#FFD700',
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
} 