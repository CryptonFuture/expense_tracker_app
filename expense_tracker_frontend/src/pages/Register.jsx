
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-slate-100 p-4">

      {/* Background Decorative Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-100/40 blur-3xl" />

      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">

        {/* Brand / Heading */}
        <div className="mb-7 text-center">

          {/* Premium Logo */}
          <div className="relative inline-flex">

            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-primary-400/30 blur-xl" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-xl shadow-primary-200">

              <Wallet className="h-8 w-8 text-white" />

            </div>

            {/* Sparkle Badge */}
            <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white bg-white shadow-md">

              <Sparkles className="h-4 w-4 text-primary-500" />

            </div>

          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-800">
            Create account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start managing your{' '}
            <span className="font-semibold text-primary-600">
              expenses
            </span>{' '}
            smarter
          </p>
        </div>

        {/* Premium Card */}
        <div className="relative">

          {/* Card Glow */}
          <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-primary-200 via-violet-100 to-cyan-100 opacity-70 blur-xl" />

          <div className="relative rounded-[26px] border border-white/80 bg-white/90 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl sm:p-8">

            {/* Top Accent */}
            <div className="mb-7 h-1 w-16 rounded-full bg-gradient-to-r from-primary-500 to-violet-500" />

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">

                  <div className="h-2 w-2 shrink-0 rounded-full bg-red-500" />

                  <span>{error}</span>

                </div>
              )}

              {/* Full Name */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="group relative">

                  <User
                    className="
                      absolute left-4 top-1/2
                      h-5 w-5 -translate-y-1/2
                      text-slate-400
                      transition-colors
                      group-focus-within:text-primary-500
                    "
                  />

                  <input
                    type="text"
                    className="
                      h-12 w-full rounded-xl
                      border border-slate-200
                      bg-slate-50/70
                      pl-12 pr-4
                      text-sm text-slate-800
                      outline-none
                      transition-all duration-200
                      placeholder:text-slate-400
                      hover:border-slate-300
                      focus:border-primary-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-primary-500/10
                    "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />

                </div>
              </div>

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <div className="group relative">

                  <Mail
                    className="
                      absolute left-4 top-1/2
                      h-5 w-5 -translate-y-1/2
                      text-slate-400
                      transition-colors
                      group-focus-within:text-primary-500
                    "
                  />

                  <input
                    type="email"
                    className="
                      h-12 w-full rounded-xl
                      border border-slate-200
                      bg-slate-50/70
                      pl-12 pr-4
                      text-sm text-slate-800
                      outline-none
                      transition-all duration-200
                      placeholder:text-slate-400
                      hover:border-slate-300
                      focus:border-primary-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-primary-500/10
                    "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />

                </div>
              </div>

              {/* Password */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="group relative">

                  <Lock
                    className="
                      absolute left-4 top-1/2
                      h-5 w-5 -translate-y-1/2
                      text-slate-400
                      transition-colors
                      group-focus-within:text-primary-500
                    "
                  />

                  <input
                    type={showPass ? 'text' : 'password'}
                    className="
                      h-12 w-full rounded-xl
                      border border-slate-200
                      bg-slate-50/70
                      pl-12 pr-12
                      text-sm text-slate-800
                      outline-none
                      transition-all duration-200
                      placeholder:text-slate-400
                      hover:border-slate-300
                      focus:border-primary-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-primary-500/10
                    "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="
                      absolute right-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition-colors
                      hover:text-slate-700
                    "
                  >
                    {showPass ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

                {/* Password Hint */}
                <p className="mt-2 text-xs text-slate-400">
                  Use at least 6 characters for your password.
                </p>

              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group relative flex h-12 w-full
                  items-center justify-center
                  gap-2 overflow-hidden
                  rounded-xl
                  bg-gradient-to-r
                  from-primary-600
                  via-primary-500
                  to-violet-600
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-primary-200
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  hover:shadow-primary-300
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >

                {/* Button Shine */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative flex items-center gap-2">

                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}

                </span>

              </button>

            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                already registered?
              </span>

              <div className="h-px flex-1 bg-slate-200" />

            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-500">

              Already have an account?{' '}

              <Link
                to="/login"
                className="
                  font-semibold
                  text-primary-600
                  transition-colors
                  hover:text-primary-700
                  hover:underline
                "
              >
                Sign in
              </Link>

            </p>

          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          Secure & encrypted registration

        </div>

      </div>
    </div>
  );
}

