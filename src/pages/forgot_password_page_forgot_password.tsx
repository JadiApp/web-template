import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageTitle } from '@/components/PageTitle';
import { base_url } from '@/utility';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${base_url}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <PageTitle
          title="Lupa Password"
          description="Masukkan email Anda untuk menerima tautan reset password"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Login", href: "/login" },
            { label: "Lupa Password" }
          ]}
        />
        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Masukkan alamat email Anda</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <Alert variant="default">
                  <AlertDescription>
                    Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk Anda.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email">Email</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Masukkan email Anda"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <CardFooter className="flex justify-between px-0 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/login')}
                    >
                      Kembali ke Login
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                    </Button>
                  </CardFooter>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
