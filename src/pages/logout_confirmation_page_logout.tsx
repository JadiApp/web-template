import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { base_url } from '@/utility';

export default function LogoutConfirmationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${base_url}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <ConfirmDialog
        open={true}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar dari Pasar KPR?"
        onConfirm={handleLogout}
        onCancel={() => navigate(-1)}
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        loading={isLoading}
      />
    </div>
  );
}
