'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { name: "Software", href: "/dashboard/software" },
  { name: "Project", href: "/dashboard/project" },
];

export default function NavBar() {
  const pathname = usePathname();  
  

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-2 transition-transform active:scale-95">
          <div className="relative w-9 h-9">
            <Image 
              src="/icon.svg" 
              fill 
              alt="Logo" 
              priority
              className="rounded-xl shadow-sm group-hover:rotate-6 transition-transform duration-300" 
            />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white uppercase">
            Repo<span className="text-blue-600">Flux</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-all relative group py-2 ${
                  isActive ? "text-blue-600" : "text-gray-500 dark:text-gray-400 hover:text-blue-600"
                }`}
              >
                {link.name}

                {/* The Underline - Refined for "Bits & Atoms" feel */}
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-in-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} 
                />
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
}