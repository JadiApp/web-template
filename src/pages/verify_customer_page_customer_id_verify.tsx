import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageTitle } from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FormField } from '@/components/FormField';
import { base_url } from '@/utility';
import { ConfirmDialog } from '@/components/ConfirmDialog';

enum CustomerStatus {
  Open = "Open",
  Verified = "Verified",
  Diterima = "Diterima",
  Ditolak = "Ditolak"
}

type FormFieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
  description?: string;
  placeholder?: string;
  as?: "input" | "textarea";
  maxLength?: number;
};

export default function VerifyCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${base_url}/customer/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error('Failed to fetch customer:', error);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${base_url}/customer/${id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ catatan })
      });

      if (response.ok) {
        navigate(`/customer/${id}`);
      } else {
        console.error('Failed to verify customer');
      }
    } catch (error) {
      console.error('Error verifying customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="Verifikasi Customer"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Daftar Customer', href: '/customer' },
          { label: 'Detail Customer', href: `/customer/${id}` },
          { label: 'Verifikasi Customer' }
        ]}
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Konfirmasi Verifikasi</CardTitle>
          <CardDescription>
            Anda akan mengubah status customer dari <span className="font-medium">{customer.status}</span> menjadi <span className="font-medium">Verified</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Informasi Customer</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  <p>{customer.nama_lengkap}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nomor KTP</p>
                  <p>{customer.no_ktp}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status Saat Ini</p>
                  <p>{customer.status}</p>
                </div>
              </div>
            </div>

            <FormField
              label="Catatan (Opsional)"
              id="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              as="textarea"
              placeholder="Masukkan catatan verifikasi jika diperlukan"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/customer/${id}`)}>
              Batal
            </Button>
            <Button onClick={() => setIsConfirmOpen(true)} disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Konfirmasi Verifikasi'}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Konfirmasi Verifikasi"
        description="Apakah Anda yakin ingin memverifikasi customer ini?"
        onConfirm={handleVerify}
        onCancel={() => setIsConfirmOpen(false)}
        confirmLabel="Ya, Verifikasi"
        cancelLabel="Batal"
        loading={isLoading}
      />
    </div>
  );
}
