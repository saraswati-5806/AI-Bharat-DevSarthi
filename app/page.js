// app/page.js
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en'); // This catches everyone hitting the base URL
}