import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageTitle } from '@/components/PageTitle';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { base_url } from '@/utility';

type CustomerStatus = 'Open' | 'Verified' | 'Diterima' | 'Ditolak';

export default function FinalStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CustomerStatus>('Diterima');
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${base_url}/customer/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          catatan
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      navigate(`/customer/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="Status Akhir Customer"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Daftar Customer', href: '/customer' },
          { label: 'Detail Customer', href: `/customer/${id}` },
          { label: 'Status Akhir' }
        ]}
      />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Tentukan Status Akhir</CardTitle>
          <CardDescription>
            Pilih status akhir untuk customer ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <RadioGroup
                defaultValue="Diterima"
                value={status}
                onValueChange={(value: CustomerStatus) => setStatus(value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Diterima" id="diterima" />
                  <Label htmlFor="diterima">Diterima</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ditolak" id="ditolak" />
                  <Label htmlFor="ditolak">Ditolak</Label>
                </div>
              </RadioGroup>
            </div>

            <FormField
              label="Catatan (Opsional)"
              id="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              as="textarea"
              placeholder="Masukkan catatan tambahan jika diperlukan"
            />

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/customer/${id}`)}
            type="button"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Status'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
