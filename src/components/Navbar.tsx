'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, Home, FileText, Mail, Shield } from 'lucide-react';
import EditorJs from '@/components/EditorJs';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Articles', href: '/articles', icon: FileText },
  { name: 'Contact', href: '/contact', icon: Mail },
  { name: 'Admin', href: '/admin', icon: Shield },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Bruce AI Blog
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                        layoutId="navbar-indicator"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 