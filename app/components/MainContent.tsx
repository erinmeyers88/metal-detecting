import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

type MainContentProps = {
  children: React.ReactNode;
};

export default function MainContent({ children }: MainContentProps) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 1, md: 2 },
        pb: { xs: 10, sm: 11 },
      }}
    >
      <Toolbar />
      {children}
    </Box>
  );
}
