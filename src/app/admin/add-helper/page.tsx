import { redirect } from 'next/navigation';
import AdminAddHelperPage from '@/components/admin/AdminAddHelperPage';
import { isAdminAuthorized } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminAddHelperRoute() {
  if (!(await isAdminAuthorized())) redirect('/admin');

  return <AdminAddHelperPage />;
}
