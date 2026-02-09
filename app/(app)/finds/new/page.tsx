'use client';

import FindForm from '@/app/components/FindForm';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function NewFindPage() {
  const router = useRouter();
  const formId = 'new-find-form';

  return (
    <Dialog
      open
      onClose={() => router.back()}
      fullScreen
      fullWidth
      maxWidth={false}
      scroll="body"
      sx={{
        '& .MuiDialog-container': { alignItems: 'stretch' },
        '& .MuiPaper-root': { width: '100%', height: '100%' },
      }}
      PaperProps={{
        sx: {
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          m: 0,
          borderRadius: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%' }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflow: 'auto', px: 2, pt: 2, pb: 3 }}>
            <FindForm
              formId={formId}
              showActions={false}
              onSubmit={(payload) => {
                console.log('Create find payload', payload);
              }}
            />
          </Box>
          <Box
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              px: 2,
              py: 1.5,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              bgcolor: 'background.paper',
            }}
          >
            <Button variant="text" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" form={formId}>
              Create find
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
