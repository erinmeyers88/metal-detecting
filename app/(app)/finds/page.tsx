import { redirect } from 'next/navigation';

export default function FindsPage() {
  redirect('/list?tab=finds');
}
