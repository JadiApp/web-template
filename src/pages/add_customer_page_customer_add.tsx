import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FormField } from '@/components/FormField';
import { PageTitle } from '@/components/PageTitle';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { base_url } from '@/utility';

type CustomerStatus = 'Open' | 'Verified' | 'Diterima' | 'Ditolak';
type UserRole = 'Admin' | 'Verifikator' | 'User';

export default function AddCustomerPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_ktp: '',
    no_kk: '',
    no_npwp: '',
    no_telepon: '',
    alamat: ''
  });
  const [errors, setErrors] = useState({
    nama_lengkap: '',
    no_ktp: '',
    no_kk: '',
    no_npwp: '',
    no_telepon: '',
    alamat: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setErrors(prev => ({
      ...prev,
      [id]: ''
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = 'Nama lengkap harus diisi';
      valid = false;
    }

    if (!formData.no_ktp.trim()) {
      newErrors.no_ktp = 'Nomor KTP harus diisi';
      valid = false;
    } else if (!/^\d{16}$/.test(formData.no_ktp)) {
      newErrors.no_ktp = 'Nomor KTP harus 16 digit';
      valid = false;
    }

    if (!formData.no_kk.trim()) {
      newErrors.no_kk = 'Nomor KK harus diisi';
      valid = false;
    } else if (!/^\d{16}$/.test(formData.no_kk)) {
      newErrors.no_kk = 'Nomor KK harus 16 digit';
      valid = false;
    }

    if (formData.no_npwp && !/^\d{15}$/.test(formData.no_npwp)) {
      newErrors.no_npwp = 'Nomor NPWP harus 15 digit';
      valid = false;
    }

    if (formData.no_telepon && !/^\+?\d{10,15}$/.test(formData.no_telepon)) {
      newErrors.no_telepon = 'Nomor telepon tidak valid';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${base_url}/customer/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add customer');
      }

      const data = await response.json();
      navigate(`/customer/${data.id}`);
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Gagal menambahkan data customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10"/></svg> },
    { label: 'Daftar Customer', href: '/customer', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Tambah Customer', href: '/customer/add', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg> }
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} activeHref="/customer/add" />
      <div className="flex-1">
        <Navbar pageTitle="Tambah Customer" onLogout={handleLogout} />
        <main className="p-6">
          <PageTitle
            title="Tambah Data Customer"
            description="Masukkan data customer baru ke dalam sistem"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Daftar Customer', href: '/customer' },
              { label: 'Tambah Customer' }
            ]}
          />
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Form Data Customer</CardTitle>
              <CardDescription>Isi semua field yang diperlukan untuk menambahkan customer baru</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Nama Lengkap"
                  id="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  required
                  error={errors.nama_lengkap}
                  placeholder="Masukkan nama lengkap"
                />
                <FormField
                  label="Nomor KTP"
                  id="no_ktp"
                  value={formData.no_ktp}
                  onChange={handleChange}
                  required
                  error={errors.no_ktp}
                  placeholder="Masukkan nomor KTP (16 digit)"
                  maxLength={16}
                />
                <FormField
                  label="Nomor KK"
                  id="no_kk"
                  value={formData.no_kk}
                  onChange={handleChange}
                  required
                  error={errors.no_kk}
                  placeholder="Masukkan nomor KK (16 digit)"
                  maxLength={16}
                />
                <FormField
                  label="Nomor NPWP"
                  id="no_npwp"
                  value={formData.no_npwp}
                  onChange={handleChange}
                  error={errors.no_npwp}
                  placeholder="Masukkan nomor NPWP (15 digit)"
                  maxLength={15}
                />
                <FormField
                  label="Nomor Telepon"
                  id="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleChange}
                  error={errors.no_telepon}
                  placeholder="Masukkan nomor telepon"
                />
                <FormField
                  label="Alamat"
                  id="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  as="textarea"
                  error={errors.alamat}
                  placeholder="Masukkan alamat lengkap"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
