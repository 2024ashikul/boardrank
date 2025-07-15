import { redirect } from 'next/navigation';

export default function RedirectToPageOne({ params }) {
  const { filter, search } = params;
  redirect(`/search/${filter}/${search}/1`);
}