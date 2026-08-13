'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Eye, EyeOff, Mail, Lock, User, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterData = z.infer<typeof registerSchema>;

const benefits = [
  'Access AI Property Advisor',
  'Generate AI listing descriptions',
  'View market analytics',
  'Save favorite properties',
  'Manage your listings',
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created! Welcome to PropertyMind AI 🎉');
      router.push('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left panel */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">
              <span className="gradient-text">Property</span>
              <span className="text-white">Mind</span>
              <span className="text-secondary-400 text-xs ml-1">AI</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-4">
            Start making
            <span className="block gradient-text">smarter property</span>
            <span className="block">decisions today</span>
          </h1>
          <p className="text-dark-400 mb-8 leading-relaxed">
            Join thousands of homebuyers and investors using AI-powered intelligence to find, analyze, and invest in real estate.
          </p>
          <ul className="space-y-3">
            {benefits.map(benefit => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-secondary-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-secondary-400" />
                </div>
                <span className="text-dark-300 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right panel - form */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Create your free account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  id="register-name"
                  {...register('name')}
                  placeholder="John Smith"
                  className="input-field pl-10"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  id="register-email"
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-dark-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Min 6 characters"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  id="toggle-reg-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-sm font-medium text-dark-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  id="register-confirm"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" id="go-to-login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
