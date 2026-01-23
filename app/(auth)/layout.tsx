import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        py: 6,
      }}
    >
      <Container maxWidth="sm">{children}</Container>
    </Box>
  );
}
