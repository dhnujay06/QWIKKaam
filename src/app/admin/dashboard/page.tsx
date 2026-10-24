import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { isAdminAuthorized } from '@/lib/admin-auth';

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthorized())) redirect('/admin');

  return <AdminDashboard />;
}
