"use client";

import Link from "next/link";
import { Zap, LayoutDashboard, Users, Calendar, MessageSquare, User, LogOut, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const menuItems = [
  { name: "Overview", href: "/trainer/dashboard", icon: LayoutDashboard },
  { name: "Murid Saya", href: "/trainer/murid", icon: Users },
  { name: "Jadwal Sesi", href: "/trainer/jadwal", icon: Calendar, badge: "2" },
  { name: "Pesan", href: "/trainer/pesan", icon: MessageSquare, badge: "5" },
  { name: "Profil", href: "/trainer/profil", icon: User }
];

export default function TrainerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border-color hidden md:flex flex-col fixed inset-y-0 shadow-sm z-40">
        <div className="h-16 flex items-center px-6 border-b border-border-color bg-surface/50">
          <Link href="/" className="flex items-center gap-2 group">
            <Zap className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="font-extrabold text-xl tracking-tight text-primary-dark">KerjaKamu</span>
          </Link>
        </div>

        <div className="p-6 border-b border-border-color text-center">
           <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center font-bold text-xl text-primary mx-auto mb-3">
             RK
           </div>
           <h3 className="font-bold text-text-primary text-sm">Rina Kusuma</h3>
           <p className="text-xs text-text-muted">Graphic Designer</p>
           <div className="mt-2 bg-success/10 text-success text-xs font-bold px-2 py-1 rounded-full inline-block">Verified Trainer</div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-text-muted hover:bg-surface hover:text-text-primary'
                }`}
              >
                <div className="flex items-center content-center gap-3">
                  <Icon size={20} className={isActive ? 'text-white' : 'text-text-muted'} />
                  <span className="text-sm">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-color">
          <button 
            onClick={toggleTheme} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-surface transition-colors mb-2 text-sm font-medium"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} 
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors text-sm font-bold">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <div className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
