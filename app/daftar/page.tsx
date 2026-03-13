"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createUserProfile, setAuthCookies } from "@/lib/auth-utils";
import { useRouter } from "next/navigation";
import { PROVINCES } from "@/data/provinces";

export default function Daftar() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const provinces = PROVINCES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Create profile in Firestore
      await createUserProfile(user.uid, {
        email: formData.email,
        displayName: formData.name,
        role: "user",
        location: formData.location
      });

      // Set cookies for middleware
      setAuthCookies("user");

      router.push("/tes");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Email sudah terdaftar");
      } else {
        setError("Terdapat kesalahan saat mendaftar. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // For Google sign in, we default to "user" role if not exist
      await createUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName,
        role: "user"
      });

      setAuthCookies("user");
      router.push("/tes");
    } catch (err: any) {
      console.error(err);
      setError("Gagal masuk dengan Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 group mb-6">
          <Zap className="h-10 w-10 text-primary" fill="currentColor" />
          <span className="font-sans font-extrabold text-3xl tracking-tight text-primary-dark dark:text-primary">
            KerjaKamu
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
          Buat Akun Gratis
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-medium text-primary hover:text-primary-dark">
            Masuk di sini
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-xl border border-border-color sm:rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary">
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-border-color rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-primary"
                  placeholder="Budi Santoso"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                Alamat Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-border-color rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-primary"
                  placeholder="anda@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-primary">
                Lokasi Domisili
              </label>
              <div className="mt-1">
                <select
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-border-color rounded-md shadow-sm bg-surface text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="" disabled>Pilih Provinsi</option>
                  {provinces.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-border-color rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-primary"
                  placeholder="Minimal 8 karakter"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary">
                Konfirmasi Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-border-color rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-primary"
                  placeholder="Ulangi password"
                />
              </div>
            </div>

            {error && (
              <div className="text-error text-sm font-medium">{error}</div>
            )}

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-border-color rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-text-muted">
                Saya menyetujui <a href="#" className="font-medium text-primary hover:text-primary-dark">Syarat & Ketentuan</a> dan <a href="#" className="font-medium text-primary hover:text-primary-dark">Kebijakan Privasi</a>.
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70"
              >
                {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-color" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-text-muted">Atau daftar dengan</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-border-color rounded-lg shadow-sm bg-surface text-sm font-medium text-text-primary hover:bg-border-color/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70"
              >
                <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Daftar dengan Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
