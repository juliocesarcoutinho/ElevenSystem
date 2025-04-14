import { Box } from '@mui/material';
import { ReactNode, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#121212' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: `calc(100% - ${isSidebarOpen ? 240 : 73}px)`,
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        }}
      >
        <Navbar />
        <Box
          component="div"
          sx={{
            flexGrow: 1,
            p: 0,
            overflow: 'auto',
          }}
        >
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
} 