

import Masonry from '@mui/lab/Masonry';
import { CardHeader, Box, Card, CardContent, Chip, Typography, Stack, CardMedia } from '@mui/material'
const FindsList = ({finds}) => {

 
 return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Finds
      </Typography>
      <Masonry columns={{ xs: 1, md: 2, lg: 4 }} spacing={2}>
        {finds.map((find) => (
          <Card key={find.id} variant="outlined">
               <CardHeader
        // avatar={
        //   <Avatar aria-label="recipe">
        //     R
        //   </Avatar>
        // }
        title={  <Typography variant="h6">{find.title}</Typography>}
        // subheader={ }
      />
        <CardContent>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip size="small" label={find.material} />
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
        ))}
      </Masonry>
    </Box>
  );
}
export default FindsList;
