"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageTitle } from '@/components/PageTitle';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { base_url } from '@/utility';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { toast } from 'sonner';

type CustomerStatus = 'Open' | 'Verified' | 'Diterima' | 'Ditolak';

type FormFieldWithClassName = {
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
  className?: string;
};

export default function EditCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    nama_lengkap: '',
    no_kk: '',
    no_npwp: '',
    no_telepon: '',
    alamat: '',
    status: 'Open' as CustomerStatus,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${base_url}/customer/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }

        const data = await response.json();
        setCustomer({
          nama_lengkap: data.nama_lengkap,
          no_kk: data.no_kk,
          no_npwp: data.no_npwp || '',
          no_telepon: data.no_telepon || '',
          alamat: data.alamat || '',
          status: data.status,
        });
      } catch (error) {
        toast.error('Gagal memuat data customer');
        console.error('Error fetching customer:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCustomer(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customer.nama_lengkap.trim()) newErrors.nama_lengkap = 'Nama lengkap harus diisi';
    if (!customer.no_kk.trim()) newErrors.no_kk = 'Nomor KK harus diisi';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${base_url}/customer/${id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      toast.success('Data customer berhasil diperbarui');
      navigate(`/customer/${id}`);
    } catch (error) {
      toast.error('Gagal memperbarui data customer');
      console.error('Error updating customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Daftar Customer', href: '/customer' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={navItems} activeHref="/customer" />
      <div className="flex-1 flex flex-col">
        <Navbar
          pageTitle="Edit Customer"
          onLogout={handleLogout}
        />
        <main className="flex-1 p-6 bg-gray-50">
          <PageTitle
            title="Edit Data Customer"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Daftar Customer', href: '/customer' },
              { label: 'Edit Customer' },
            ]}
          />
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Edit Data Customer</CardTitle>
              <CardDescription>
                Edit informasi customer. Pastikan data yang diinput sudah benar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Nama Lengkap"
                    id="nama_lengkap"
                    value={customer.nama_lengkap}
                    onChange={handleChange}
                    required
                    error={errors.nama_lengkap}
                    placeholder="Masukkan nama lengkap"
                  />
                  <FormField
                    label="Nomor KK"
                    id="no_kk"
                    value={customer.no_kk}
                    onChange={handleChange}
                    required
                    error={errors.no_kk}
                    placeholder="Masukkan nomor KK"
                  />
                  <FormField
                    label="Nomor NPWP"
                    id="no_npwp"
                    value={customer.no_npwp}
                    onChange={handleChange}
                    placeholder="Masukkan nomor NPWP (opsional)"
                  />
                  <FormField
                    label="Nomor Telepon"
                    id="no_telepon"
                    value={customer.no_telepon}
                    onChange={handleChange}
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
                <FormField
                  label="Alamat"
                  id="alamat"
                  value={customer.alamat}
                  onChange={handleChange}
                  as="textarea"
                  placeholder="Masukkan alamat lengkap"
                />
                <CardFooter className="flex justify-end gap-2 p-0 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/customer/${id}`)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
