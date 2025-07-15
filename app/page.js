import { redirect } from 'next/navigation';

export default function RedirectToPageOne({ params }) {
  const { filter, search } = params;
  redirect(`/page/1`);
}