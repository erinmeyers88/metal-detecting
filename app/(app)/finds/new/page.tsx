'use client';

import FindForm from '@/app/components/FindForm';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useRouter } from 'next/navigation';

export default function NewFindPage() {
  const router = useRouter();

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
          onCancel={() => router.back()}
          onSubmit={(payload) => {
            console.log('Create find payload', payload);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
