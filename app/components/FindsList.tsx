

import Masonry from '@mui/lab/Masonry';
import type { MockFind } from '../lib/mock/find';
import { CardHeader, Box, Card, CardContent, Chip, Typography, Stack, CardMedia, Avatar } from '@mui/material'
import PaidIcon from '@mui/icons-material/Paid';
import CastleIcon from '@mui/icons-material/Castle';
import DeleteIcon from '@mui/icons-material/Delete';
import ConstructionIcon from '@mui/icons-material/Construction';

const getChipTextColor = (hex) => {
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.slice(0, 2), 16);
  const g = parseInt(hexValue.slice(2, 4), 16);
  const b = parseInt(hexValue.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1f1f1f' : '#ffffff';
};

const typeIconMap = {
  Coin: PaidIcon,
  Relic: CastleIcon,
  Trash: DeleteIcon,
  Junk: ConstructionIcon,
};

const FindsList = ({finds}: { finds: MockFind[] }) => {
 
 return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Toolbar Placeholder
      </Typography>
      <Masonry columns={{ xs: 1, md: 2, lg: 4 }} spacing={2}>
        {finds.map((find) => {

const latitude = find.location.geometry.coordinates[1];
const longitude = find.location.geometry.coordinates[0]

  const dateTimeString = `${find.foundTimestamp}`
const locationDepthString = `${find.site.name} at ${find.depth} in`

          const TypeIcon = typeIconMap[find.type] ?? AutoAwesomeIcon;

          return <Card key={find.id} variant="outlined">
               <CardHeader
        avatar={
          <Avatar sx={{ width: 36, height: 36 }}>
            <TypeIcon fontSize="small" />
          </Avatar>
        }
        title={  <Typography variant="h6">{find.title}</Typography>}
        subheader={<Box>
          <Box>  {dateTimeString}</Box>
        <Box>
          {locationDepthString}
        </Box>
          
        </Box>}
      />
        <CardContent>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {find.materials.map((m, idx) => (
                <Chip
                  key={idx}
                  size="small"
                  label={m.name}
                  sx={{
                    backgroundImage: `linear-gradient(135deg, ${m.color} 0%, ${m.colorAlt} 100%)`,
                    color: getChipTextColor(m.colorAlt),
                    border: '1px solid rgba(0,0,0,0.2)',
                    // fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: 'inherit',
                    },
                  }}
                />
              ))}
              
              </Stack>
  
             
            </CardContent>
      <CardMedia
        component="img"
        image={find.photoUrl}
        sx={{ height: 'fit-content', width: '100%'}}
      />
            <CardContent>
           
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                {find.description}
              </Typography>
             
            </CardContent>
          </Card>
})}
      </Masonry>
    </Box>
  );
}
export default FindsList;
