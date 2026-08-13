'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Menu, X, Home, Building2, Brain, BarChart3, PlusCircle, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const publicNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
];

const authNavLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/ai-advisor', label: 'AI Advisor', icon: Brain },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/properties/add', label: 'List Property', icon: PlusCircle },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = isAuthenticated ? authNavLinks : publicNavLinks;

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-dark-900/95 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/20'
        : 'bg-transparent'
    )}>
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" id="nav-logo">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">
              <span className="gradient-text">Property</span>
              <span className="text-white">Mind</span>
              <span className="text-secondary-400 text-xs ml-1 font-semibold">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
                  pathname === link.href
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="user-menu-button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  {user?.avatar ? (
                    <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-dark-100">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className={cn('w-4 h-4 text-dark-400 transition-transform duration-200', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-card shadow-2xl shadow-black/40 py-2 animate-slide-down">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-dark-400">{user?.email}</p>
                    </div>
                    <Link href="/properties/manage" id="nav-manage" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors">
                      <Settings className="w-4 h-4" />
                      Manage Listings
                    </Link>
                    <Link href="/properties/add" id="nav-add" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors">
                      <PlusCircle className="w-4 h-4" />
                      Add Property
                    </Link>
                    <Link href="/ai-advisor" id="nav-ai" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors">
                      <Brain className="w-4 h-4" />
                      AI Advisor
                    </Link>
                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button
                        id="nav-logout"
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" id="nav-login" className="btn-ghost text-sm">Sign In</Link>
                <Link href="/register" id="nav-register" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5 text-dark-300" /> : <Menu className="w-5 h-5 text-dark-300" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden glass-card mt-2 mb-4 py-4 px-4 space-y-1 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200',
                  pathname === link.href
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/5 pt-3 mt-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="btn-outline text-sm w-full justify-center">Sign In</Link>
                  <Link href="/register" className="btn-primary text-sm w-full justify-center">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
