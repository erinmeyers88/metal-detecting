import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

type MainContentProps = {
  children: React.ReactNode;
  disablePadding?: boolean;
  showToolbar?: boolean;
};

export default function MainContent({
  children,
  disablePadding = false,
  showToolbar = true,
}: MainContentProps) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        px: disablePadding ? 0 : { xs: 1, md: 2 },
        pt: disablePadding ? 0 : { xs: 1, md: 2 },
        pb: { xs: 10, sm: 11 },
      }}
    >
      {showToolbar && <Toolbar />}
      {children}
    </Box>
  );
}
