'use client';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useRouter } from 'next/navigation';
import SiteForm from '@/app/components/SiteForm';
import { useMockData } from '@/app/components/MockDataProvider';

export default function NewSitePage() {
  const router = useRouter();
  const { setSites } = useMockData();

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
        <SiteForm
          onCancel={() => router.back()}
          onSubmit={(payload) => {
            console.log('Create site payload', payload);
            setSites((prev) => [...prev, payload]);
            router.back();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
