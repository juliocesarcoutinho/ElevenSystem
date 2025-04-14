import { Box, Typography } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

interface UnderConstructionProps {
  pageName: string;
}

export function UnderConstruction({ pageName }: UnderConstructionProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2,
      }}
    >
      <ConstructionIcon sx={{ fontSize: 60, color: '#FFD700' }} />
      <Typography variant="h4" color="white" gutterBottom>
        Página em Construção
      </Typography>
      <Typography variant="h6" color="rgba(255, 255, 255, 0.7)">
        A página de {pageName} está sendo desenvolvida
      </Typography>
    </Box>
  );
} 