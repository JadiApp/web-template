import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PageTitle } from '@/components/PageTitle';
import { base_url } from '@/utility';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    no_telepon: '',
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    nama_lengkap: '',
    email: '',
    no_telepon: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = 'Nama lengkap harus diisi';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
      valid = false;
    }

    if (!formData.no_telepon.trim()) {
      newErrors.no_telepon = 'Nomor telepon harus diisi';
      valid = false;
    } else if (!/^\+?[0-9\s\-()]{10,}$/.test(formData.no_telepon)) {
      newErrors.no_telepon = 'Nomor telepon tidak valid';
      valid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username harus diisi';
      valid = false;
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username minimal 4 karakter';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${base_url}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      navigate('/login');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <PageTitle
          title="Daftar Akun"
          description="Buat akun baru untuk mengakses Pasar KPR"
        />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Form Pendaftaran</CardTitle>
            <CardDescription>Silakan isi data diri Anda</CardDescription>
          </CardHeader>

          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Nama Lengkap"
                id="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                type="text"
                required
                error={errors.nama_lengkap}
                placeholder="Masukkan nama lengkap"
              />

              <FormField
                label="Email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                error={errors.email}
                placeholder="Masukkan email"
              />

              <FormField
                label="Nomor Telepon"
                id="no_telepon"
                value={formData.no_telepon}
                onChange={handleChange}
                type="tel"
                required
                error={errors.no_telepon}
                placeholder="Masukkan nomor telepon"
              />

              <FormField
                label="Username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                required
                error={errors.username}
                placeholder="Masukkan username"
              />

              <FormField
                label="Password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
                error={errors.password}
                placeholder="Masukkan password"
              />
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Mendaftar...' : 'Daftar'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Sudah punya akun? </span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline"
              >
                Masuk
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
