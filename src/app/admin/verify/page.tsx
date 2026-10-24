import { redirect } from 'next/navigation';
import AdminVerifyPage from '@/components/admin/AdminVerifyPage';
import { isAdminAuthorized } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminVerifyRoute() {
  if (!(await isAdminAuthorized())) redirect('/admin');

  return <AdminVerifyPage />;
}
