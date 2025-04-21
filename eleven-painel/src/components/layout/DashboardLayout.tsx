'use client';
import {Box, useMediaQuery, useTheme} from '@mui/material';
import {ReactNode, useEffect, useState} from 'react';
import {Navbar} from './Navbar';
import {Sidebar} from './Sidebar';
import {Footer} from './Footer';

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({children}: DashboardLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

    // Fechar a sidebar automaticamente quando mudar para visualização mobile
    useEffect(() => {
        setIsSidebarOpen(!isMobile);
    }, [isMobile]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Box sx={{display: 'flex', height: '100vh', bgcolor: '#121212'}}>
            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar}/>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    width: {
                        xs: '100%',
                        md: `calc(100% - ${isSidebarOpen ? 240 : 73}px)`
                    },
                    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                }}
            >
                <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
                <Box
                    component="div"
                    sx={{
                        flexGrow: 1,
                        p: 0,
                        overflow: 'auto',
                    }}
                >
                    <Box sx={{p: {xs: 2, md: 3}}}>
                        {children}
                    </Box>
                </Box>
                <Footer/>
            </Box>
        </Box>
    );
} 