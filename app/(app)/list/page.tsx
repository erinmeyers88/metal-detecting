import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { mockFinds } from '@/app/lib/mock/find';

export default function ListPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Finds (Mock Data)
      </Typography>
      <Stack spacing={2}>
        {mockFinds.map((find) => (
          <Card key={find.id} variant="outlined">
            <CardContent>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{ marginBottom: 1 }}
              >
                <Typography variant="h6">{find.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Found {find.foundAt}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                {find.description}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip size="small" label={find.material} />
                <Chip size="small" label={`${find.depthCm} cm deep`} />
                <Chip size="small" label={find.area.name} />
                <Chip size="small" label={`${find.lat.toFixed(4)}, ${find.lng.toFixed(4)}`} />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
