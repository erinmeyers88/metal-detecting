
import { mockFinds } from '@/app/lib/mock/find';
import FindsList from '@/app/components/FindsList';
export default function ListPage() {

 return <FindsList finds={mockFinds}></FindsList>
}
