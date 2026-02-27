'use client';

import Link from 'next/link';
import { useState } from 'react';
import { X, Truck, ChevronDown } from 'lucide-react';
import { HiBars2 } from 'react-icons/hi2';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { user, userProfile, loading, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{ background: 'rgba(11,29,58,0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--orange)' }}>
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight tracking-tight">OBELS DAVE</span>
              <span className="text-xs tracking-widest" style={{ color: 'var(--orange)' }}>LOGISTICS LIMITED</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Home
            </Link>
            <Link href="/about" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              About
            </Link>
            <div className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1">
                Services <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-xl overflow-hidden shadow-lg" style={{ background: 'var(--navy-light)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Link href="/services" className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                    All Services
                  </Link>
                  <Link href="/services#ftl" className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                    Full Truckload (FTL)
                  </Link>
                  <Link href="/services#ltl" className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                    Less-Than-Truckload (LTL)
                  </Link>
                </div>
              )}
            </div>
            <Link href="/contact" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Contact
            </Link>
          </div>

          {/* CTA + Login */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle variant="navbar" />
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : user ? (
              <>
                <Link href={userProfile ? `/dashboard/${userProfile.role}` : '/dashboard/client'} className="px-5 py-2.5 text-sm font-medium text-white/90 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button onClick={signOut} className="px-6 py-2.5 text-sm font-semibold text-white/90 hover:text-white rounded-lg transition-all hover:bg-white/10 border border-white/20">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 text-sm font-medium text-white/90 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-lg" style={{ background: 'var(--orange)' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white rounded-lg hover:bg-white/10">
            {mobileOpen ? <X className="w-6 h-6" /> : <HiBars2 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10" style={{ background: 'var(--navy)' }}>
          <div className="px-4 py-4 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/80 hover:text-white rounded-lg hover:bg-white/5">Home</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/80 hover:text-white rounded-lg hover:bg-white/5">About</Link>
            <Link href="/services" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/80 hover:text-white rounded-lg hover:bg-white/5">Services</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/80 hover:text-white rounded-lg hover:bg-white/5">Contact</Link>
            <hr className="border-white/10 my-2" />
            {loading ? (
              <div className="px-4 py-3 text-white/50 text-center text-sm">Loading...</div>
            ) : user ? (
              <>
                <Link href={userProfile ? `/dashboard/${userProfile.role}` : '/dashboard/client'} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/80 hover:text-white rounded-lg hover:bg-white/5">Dashboard</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="w-full text-left block px-4 py-3 text-red-400 hover:text-red-300 rounded-lg hover:bg-white/5">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white/80 hover:text-white rounded-lg hover:bg-white/5">Log In</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-white font-semibold rounded-lg text-center" style={{ background: 'var(--orange)' }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
