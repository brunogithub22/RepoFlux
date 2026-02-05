import Link from "next/link";
import { Github, Youtube, Instagram, Facebook, MessageCircle } from "lucide-react";

// 1. Define the TypeScript structure
interface SocialLink {
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string; // Custom hover color for each brand
}

const SOCIAL_LINKS: SocialLink[] = [
  { name: "Github", icon: <Github size={20} />, href: "https://github.com", color: "hover:text-white" },
  { name: "Youtube", icon: <Youtube size={20} />, href: "#", color: "hover:text-red-500" },
  { name: "Instagram", icon: <Instagram size={20} />, href: "#", color: "hover:text-pink-500" },
  { name: "Whatsapp", icon: <MessageCircle size={20} />, href: "#", color: "hover:text-green-500" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              REPOFLUX<span className="text-blue-600">.</span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEMS OPERATIONAL // {new Date().getFullYear()}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <Link 
                key={social.name} 
                href={social.href}
                target="_blank"            
                rel="noopener noreferrer"
                className={`text-gray-500 transition-all duration-300 transform hover:-translate-y-1 ${social.color}`}
                aria-label={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>

          {/* Location/Tagline */}
          <div className="text-sm text-gray-500 font-medium">
            Bridging <span className="text-gray-900 dark:text-white">Bits & Atoms</span>
          </div>
          
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-900 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
            Designed & Engineered by the RepoFlux Team
          </p>
        </div>
      </div>
    </footer>
  );
}