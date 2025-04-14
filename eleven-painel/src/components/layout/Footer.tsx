import { Box, Typography } from '@mui/material';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        backgroundColor: '#242424',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" align="center">
        © {new Date().getFullYear()} Eleven Juventude. Todos os direitos reservados.
      </Typography>
    </Box>
  );
} 