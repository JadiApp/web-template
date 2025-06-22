// cek 123
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { base_url } from '@/utility';
import { CustomerStatusBadge } from '@/components/CustomerStatusBadge';
import { PageTitle } from '@/components/PageTitle';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';

type CustomerStatus = 'Open' | 'Verified' | 'Diterima' | 'Ditolak';

type CustomerDetail = {
  id: number;
  nama_lengkap: string;
  no_ktp: string;
  no_kk: string;
  no_npwp: string | null;
  no_telepon: string | null;
  alamat: string | null;
  status: CustomerStatus;
  catatan: string | null;
  created_by: {
    id: number;
    nama_lengkap: string;
    username: string;
  };
  created_at: string;
  updated_at: string | null;
  status_history: Array<{
    id: number;
    status: CustomerStatus;
    catatan: string | null;
    changed_by: {
      id: number;
      nama_lengkap: string;
      username: string;
    };
    created_at: string;
  }>;
};

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | null>(null);
  const [notes, setNotes] = useState('');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${base_url}/customer/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customer details');
        }

        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
        toast.error('Failed to load customer details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetail();
  }, [id]);

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${base_url}/customer/${id}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ catatan: notes })
      });

      if (!response.ok) {
        throw new Error('Failed to verify customer');
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      toast.success('Customer verified successfully');
      setIsVerifyDialogOpen(false);
    } catch (error) {
      console.error('Error verifying customer:', error);
      toast.error('Failed to verify customer');
    }
  };

  const handleSetStatus = async () => {
    if (!selectedStatus) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${base_url}/customer/${id}/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: selectedStatus,
          catatan: notes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update customer status');
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      toast.success('Customer status updated successfully');
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast.error('Failed to update customer status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Customer not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        pageTitle="Customer Detail"
        onLogout={() => setIsLogoutDialogOpen(true)}
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <PageTitle
          title="Customer Detail"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Customers', href: '/customer' },
            { label: customer.nama_lengkap }
          ]}
        />

        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{customer.nama_lengkap}</CardTitle>
                <CardDescription>Customer ID: {customer.id}</CardDescription>
              </div>
              <CustomerStatusBadge status={customer.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">KTP:</span>
                  <span>{customer.no_ktp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">KK:</span>
                  <span>{customer.no_kk}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">NPWP:</span>
                  <span>{customer.no_npwp || '-'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
                  <span>{customer.no_telepon || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Address:</span>
                  <span>{customer.alamat || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created by:</span>
                  <span>{customer.created_by.nama_lengkap}</span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-medium">Status History</h3>
              <div className="space-y-2">
                {customer.status_history.map((history) => (
                  <div key={history.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{history.status}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Changed by {history.changed_by.nama_lengkap}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(history.created_at).toLocaleString()}
                      </span>
                    </div>
                    {history.catatan && (
                      <p className="mt-2 text-sm">{history.catatan}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {customer.status === 'Open' && (
              <Button
                variant="outline"
                onClick={() => setIsVerifyDialogOpen(true)}
              >
                Verify
              </Button>
            )}
            {customer.status === 'Verified' && (
              <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Set Final Status</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Set Final Status</AlertDialogTitle>
                    <AlertDialogDescription>
                      Choose the final status for this customer
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <div className="flex gap-4 mb-4">
                      <Button
                        variant={selectedStatus === 'Diterima' ? 'default' : 'outline'}
                        onClick={() => setSelectedStatus('Diterima')}
                      >
                        Diterima
                      </Button>
                      <Button
                        variant={selectedStatus === 'Ditolak' ? 'default' : 'outline'}
                        onClick={() => setSelectedStatus('Ditolak')}
                      >
                        Ditolak
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="notes" className="text-sm font-medium">
                        Notes (optional)
                      </label>
                      <textarea
                        id="notes"
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSetStatus}
                      disabled={!selectedStatus}
                    >
                      Save Status
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button onClick={() => navigate(`/customer/${id}/edit`)}>Edit</Button>
            <Button onClick={() => navigate('/customer')}>Back to List</Button>
          </CardFooter>
        </Card>

        <AlertDialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Verify Customer</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to verify this customer?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <div className="space-y-2">
                <label htmlFor="verify-notes" className="text-sm font-medium">
                  Notes (optional)
                </label>
                <textarea
                  id="verify-notes"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleVerify}>
                Confirm Verification
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ConfirmDialog
          open={isLogoutDialogOpen}
          title="Confirm Logout"
          description="Are you sure you want to logout?"
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutDialogOpen(false)}
          confirmLabel="Logout"
          cancelLabel="Cancel"
        />
      </div>
    </div>
  );
}
