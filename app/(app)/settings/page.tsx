import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ThemeModeSwitch from '@/app/components/ThemeModeSwitch';

export default function SettingsPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5">Settings</Typography>
      <Paper variant="outlined">
        <List
          subheader={<ListSubheader>Appearance</ListSubheader>}
          disablePadding
        >
          <ThemeModeSwitch />
        </List>
      </Paper>
    </Box>
  );
}
