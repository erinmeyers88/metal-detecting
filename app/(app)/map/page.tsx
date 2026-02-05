import Map from '../../components/Map';
import { mockFinds } from '@/app/lib/mock/find';
import FindsViewToggleFab from '@/app/components/FindsViewToggleFab';

export default function MapPage() {

  return (
    <>
      <Map finds={mockFinds} />
      <FindsViewToggleFab mode="list" />
    </>
  );
}
