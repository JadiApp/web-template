import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PageTitle } from '@/components/PageTitle';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatsCard } from '@/components/StatsCard';
import { CustomerStatusBadge } from '@/components/CustomerStatusBadge';
import { DataTableActions } from '@/components/DataTableActions';
import { PaginationControls } from '@/components/PaginationControls';
import { base_url } from '@/utility';
import { FileText, Users, UserPlus, LogOut } from 'lucide-react';

type CustomerStatus = 'Open' | 'Verified' | 'Diterima' | 'Ditolak';

type DashboardSummary = {
  total_open: number;
  total_verified: number;
  total_diterima: number;
  total_ditolak: number;
  latest_customers: Array<{
    id: number;
    nama_lengkap: string;
    no_ktp: string;
    status: CustomerStatus;
    created_at: string;
  }>;
};

type CustomerListItem = {
  id: number;
  nama_lengkap: string;
  no_ktp: string;
  status: CustomerStatus;
  created_at: string;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const summaryResponse = await fetch(`${base_url}/dashboard/summary`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!summaryResponse.ok) {
          throw new Error('Failed to fetch dashboard summary');
        }

        const summaryData = await summaryResponse.json();
        setSummary(summaryData);

        const customersResponse = await fetch(`${base_url}/customer?limit=${pageSize}&offset=${(page - 1) * pageSize}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!customersResponse.ok) {
          throw new Error('Failed to fetch customers');
        }

        const customersData = await customersResponse.json();
        setCustomers(customersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddCustomer = () => {
    navigate('/customer/add');
  };

  const handleViewCustomer = (id: number) => {
    navigate(`/customer/${id}`);
  };

  const handleEditCustomer = (id: number) => {
    navigate(`/customer/${id}/edit`);
  };

  const handleVerifyCustomer = (id: number) => {
    navigate(`/customer/${id}/verify`);
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: <FileText className="h-4 w-4" />, href: '/dashboard' },
    { label: 'Daftar Customer', icon: <Users className="h-4 w-4" />, href: '/customer' },
    { label: 'Tambah Customer', icon: <UserPlus className="h-4 w-4" />, href: '/customer/add' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar items={sidebarItems} activeHref="/dashboard" />
      <div className="flex flex-1 flex-col">
        <Navbar pageTitle="Dashboard" onLogout={handleLogout} />
        <main className="flex-1 p-4 md:p-6">
          <PageTitle
            title="Dashboard"
            description="Ringkasan data customer dan pengajuan KPR"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Pengajuan Open"
              value={summary?.total_open || 0}
              color="bg-blue-500"
            />
            <StatsCard
              title="Pengajuan Verified"
              value={summary?.total_verified || 0}
              color="bg-yellow-500"
            />
            <StatsCard
              title="Pengajuan Diterima"
              value={summary?.total_diterima || 0}
              color="bg-green-500"
            />
            <StatsCard
              title="Pengajuan Ditolak"
              value={summary?.total_ditolak || 0}
              color="bg-red-500"
            />
          </div>
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Customer Terbaru</h2>
            <Button onClick={handleAddCustomer}>Tambah Data Baru</Button>
          </div>
          <Card className="mt-4">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Nomor KTP</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Input</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.nama_lengkap}</TableCell>
                        <TableCell>{customer.no_ktp}</TableCell>
                        <TableCell>
                          <CustomerStatusBadge status={customer.status} />
                        </TableCell>
                        <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DataTableActions
                            status={customer.status}
                            canEdit={customer.status === 'Open'}
                            canVerify={customer.status === 'Open'}
                            onEdit={() => handleEditCustomer(customer.id)}
                            onVerify={() => handleVerifyCustomer(customer.id)}
                            onDetail={() => handleViewCustomer(customer.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Tidak ada data customer
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <div className="p-4">
              <PaginationControls
                page={page}
                pageSize={pageSize}
                total={summary?.latest_customers.length || 0}
                onPageChange={setPage}
              />
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
