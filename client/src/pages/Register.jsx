import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5 text-slate-100">
      <Card className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-primary p-3 text-slate-950">
            <Zap size={28} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-black">VoltView</h1>
            <p className="text-sm text-slate-400">Join the Energy Revolution.</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Full Name"
            required
          />
          <Input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Email Address"
            required
          />
          <Input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Password (min 8 characters)"
            required
            minLength={8}
          />
          {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          <Button className="w-full py-3" disabled={loading}>
            {loading ? 'Signing up...' : 'Create Account'}
          </Button>

          <div className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
