
import { mockFinds } from '@/app/lib/mock/find';
import FindsList from '@/app/components/FindsList';
import FindsViewToggleFab from '@/app/components/FindsViewToggleFab';

export default function FindsPage() {
  return (
    <>
      <FindsList finds={mockFinds} />
      <FindsViewToggleFab mode="map" />
    </>
  );
}
