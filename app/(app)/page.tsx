import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PaidIcon from '@mui/icons-material/Paid';
import PlaceIcon from '@mui/icons-material/Place';

export default function HomePage() {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Log a new find, track hotspots, and keep your best discoveries organized.
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Ready to log a find?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capture a photo, add materials, and drop the pin. Your history builds as you explore.
              </Typography>
              <Button variant="contained" size="large" startIcon={<AutoAwesomeIcon />}>
                Log a find
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Card variant="outlined" sx={{ flex: 1, borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary">
                  Finds this month
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  12
                </Typography>
                <Chip icon={<PaidIcon />} label="Coins leading" size="small" />
              </Stack>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: 1, borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary">
                  Favorite area
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  East Ridge
                </Typography>
                <Chip icon={<PlaceIcon />} label="3 active sites" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}
