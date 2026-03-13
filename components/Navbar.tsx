"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Menu, X, Zap, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { clearAuthCookies } from "@/lib/auth-utils";
import { getUserProfile } from "@/lib/firebase/users";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await getUserProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearAuthCookies();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getDashboardLink = () => {
    if (!profile) return "/hasil";
    if (profile.role === "admin") return "/admin";
    if (profile.role === "trainer") return "/trainer/dashboard";
    return "/hasil";
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border-color">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-muted hover:text-text-primary focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className="flex items-center flex-1 md:flex-none justify-center md:justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <Zap className="h-7 w-7 text-primary" fill="currentColor" />
              <span className="font-sans font-bold text-xl tracking-tight text-primary-dark dark:text-primary">
                KerjaKamu
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#solusi" className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">
              Solusi
            </Link>
            <Link href="/#fitur" className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">
              Fitur
            </Link>
            <Link href="/trainer" className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">
              Trainer
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors px-2 py-2 flex items-center gap-1.5"
                  >
                    <User size={18} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-bold text-error hover:bg-error/10 transition-colors px-4 py-2 rounded-lg flex items-center gap-1.5"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/masuk"
                    className="text-sm font-medium text-text-primary hover:text-primary transition-colors px-4 py-2"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/daftar"
                    className="text-sm font-medium bg-primary text-white px-5 py-2 rounded-lg btn-hover shadow-sm"
                  >
                    Daftar Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in border-t border-border-color bg-card">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link
              href="/#solusi"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-text-primary hover:bg-surface"
            >
              Solusi
            </Link>
            <Link
              href="/#fitur"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-text-primary hover:bg-surface"
            >
              Fitur
            </Link>
            <Link
              href="/trainer"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-muted hover:text-text-primary hover:bg-surface"
            >
              Trainer
            </Link>
            <div className="flex flex-col gap-2 mt-4 px-3 pb-4">
              {user ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-text-primary bg-surface border border-border-color"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={18} /> Profile & Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-white bg-error"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/masuk"
                    className="flex items-center justify-center px-4 py-2 border border-border-color rounded-lg text-sm font-medium text-text-primary bg-surface"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/daftar"
                    className="flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Daftar Gratis
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
