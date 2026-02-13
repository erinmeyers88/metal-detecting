'use client';

import { useParams, useRouter } from 'next/navigation';
import FindForm from '@/app/components/FindForm';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useMockData } from '@/app/components/MockDataProvider';

export default function EditFindPage() {
  const params = useParams<{ findId: string }>();
  const router = useRouter();
  const { finds } = useMockData();
  const find = finds.find((item) => item.id === params.findId);

  if (!find) {
    return (
      <Typography variant="body2" color="text.secondary">
        Find not found.
      </Typography>
    );
  }

  return (
    <Dialog
      open
      onClose={() => router.back()}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{ sx: { maxHeight: 'calc(100dvh - 32px)' } }}
    >
      <DialogContent sx={{ p: 0, height: 'calc(100dvh - 32px)', overflow: 'hidden' }}>
        <FindForm
          initialFind={find}
          submitLabel="Save changes"
          onCancel={() => router.back()}
          onSubmit={(payload) => {
            console.log('Edit find payload', payload);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
