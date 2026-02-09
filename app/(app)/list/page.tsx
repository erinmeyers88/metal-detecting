import { redirect } from 'next/navigation';

export default function ListRedirectPage() {
  redirect('/?view=list');
}
