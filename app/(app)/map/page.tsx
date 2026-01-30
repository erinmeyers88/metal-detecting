import Map from '../../components/Map';
import { mockFinds } from '@/app/lib/mock/find';

export default function MapPage() {

  return <Map finds={mockFinds}></Map>
}