import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
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
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const drawerWidth = 240;

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Mensagens', icon: <MessageIcon />, path: '/mensagens' },
    { text: 'Eventos', icon: <EventIcon />, path: '/eventos' },
    { text: 'Pedidos de Oração', icon: <PrayerIcon />, path: '/oracoes' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
    { text: 'Usuários', icon: <PeopleIcon />, path: '/usuarios' },
  ];

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
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'flex-end' : 'center',
          padding: '8px',
        }}
      >
        <IconButton
          onClick={onToggle}
          sx={{
            color: 'white',
            cursor: 'pointer',
            '&:hover': {
              color: '#FFD700',
            },
          }}
        >
          {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <List>
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
    </Drawer>
  );
} 