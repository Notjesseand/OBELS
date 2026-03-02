'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

type Role = 'client' | 'driver';

export default function SignupPage() {
  const [role, setRole] = useState<Role>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Save user base details in Firestore
      await setDoc(doc(db, 'users', uid), {
        uid,
        email,
        firstName,
        lastName,
        phone,
        role,
        companyName: role === 'client' ? companyName : null,
        driverLicense: role === 'driver' ? driverLicense : null,
        createdAt: new Date().toISOString(),
      });

      // Redirect to their dashboard
      router.push(`/dashboard/${role}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden p-12" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-5" style={{ background: 'var(--orange)' }} />
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-5" style={{ background: 'var(--orange)' }} />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <Image src="/obels-logo.png" alt="OBELS DAVE Logistics" width={240} height={60} className="mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-white mb-4">Join OBELS DAVE</h2>
          <p className="text-white/60 leading-relaxed">
            Create your account to start shipping across Nigeria or join our network of professional drivers.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-xs text-white/40">Trucks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">36</p>
              <p className="text-xs text-white/40">States</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-xs text-white/40">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signup form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Image src="/obels-logo.png" alt="OBELS DAVE" width={160} height={40} className="h-10 w-auto" />
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Create your account</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Start shipping or driving in minutes</p>

          {/* Role tabs */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: 'var(--slate-100)' }}>
            {(['client', 'driver'] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: role === r ? 'var(--surface)' : 'transparent',
                  color: role === r ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {r === 'client' ? 'I want to ship' : 'I want to drive'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>First Name</label>
                <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Last Name</label>
                <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Phone Number</label>
              <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 801 234 5678" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
            </div>

            {role === 'client' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Company Name</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your company (optional)" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
              </div>
            )}

            {role === 'driver' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Driver&apos;s Licence Number</label>
                <input required type="text" value={driverLicense} onChange={e => setDriverLicense(e.target.value)} placeholder="LIC-XXXX-XXX" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 pr-12" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm cursor-pointer pt-1" style={{ color: 'var(--text-secondary)' }}>
              <input required type="checkbox" className="w-4 h-4 rounded mt-0.5" />
              <span>I agree to the <a href="#" className="font-medium" style={{ color: 'var(--orange)' }}>Terms of Service</a> and <a href="#" className="font-medium" style={{ color: 'var(--orange)' }}>Privacy Policy</a></span>
            </label>

            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ background: 'var(--orange)' }}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--orange)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
