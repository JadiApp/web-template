import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { base_url } from '@/utility';
import { CustomerStatusBadge } from '@/components/CustomerStatusBadge';
import { DataTableActions } from '@/components/DataTableActions';
import { PageTitle } from '@/components/PageTitle';
import { PaginationControls } from '@/components/PaginationControls';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, PlusCircle } from "lucide-react";

type CustomerStatus = "Open" | "Verified" | "Diterima" | "Ditolak";

type Customer = {
  id: number;
  nama_lengkap: string;
  no_ktp: string;
  no_kk: string;
  no_npwp: string;
  no_telepon: string;
  alamat: string;
  status: CustomerStatus;
  created_at: string;
  updated_at: string;
  created_by: {
    id: number;
    nama_lengkap: string;
    username: string;
  };
};

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = new URL(`${base_url}/customer`);
      const params = new URLSearchParams();

      if (searchTerm) params.append('keyword', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('limit', pageSize.toString());
      params.append('offset', ((currentPage - 1) * pageSize).toString());

      url.search = params.toString();

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch customers');

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${base_url}/customer`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch customer count');

      const data = await response.json();
      setTotalCustomers(data.length);
    } catch (error) {
      console.error('Error fetching customer count:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchCustomerCount();
  }, [searchTerm, statusFilter, currentPage, pageSize]);

  const handleEdit = (id: number) => {
    navigate(`/customer/${id}/edit`);
  };

  const handleVerify = (id: number) => {
    navigate(`/customer/${id}/verify`);
  };

  const handleDetail = (id: number) => {
    navigate(`/customer/${id}`);
  };

  const handleAccept = (id: number) => {
    navigate(`/customer/${id}/status?status=Diterima`);
  };

  const handleReject = (id: number) => {
    navigate(`/customer/${id}/status?status=Ditolak`);
  };

  const handleAddNew = () => {
    navigate('/customer/add');
  };

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Daftar Customer', href: '/customer' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} activeHref="/customer" />
      <div className="flex-1">
        <Navbar pageTitle="Daftar Customer" />
        <main className="p-6">
          <PageTitle
            title="Daftar Customer"
            description="Daftar semua customer yang telah terdaftar"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Daftar Customer' }
            ]}
          />

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari customer..."
                  className="pl-8 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CustomerStatus | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Diterima">Diterima</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Tambah Data Baru
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Nomor KTP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Input</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Tidak ada data customer
                    </TableCell>
                  </TableRow>
                ) : (
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
                          canSetFinalStatus={customer.status === 'Verified'}
                          onEdit={() => handleEdit(customer.id)}
                          onVerify={() => handleVerify(customer.id)}
                          onAccept={() => handleAccept(customer.id)}
                          onReject={() => handleReject(customer.id)}
                          onDetail={() => handleDetail(customer.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Menampilkan {customers.length} dari {totalCustomers} data
            </div>
            <PaginationControls
              page={currentPage}
              pageSize={pageSize}
              total={totalCustomers}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 20, 50]}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
