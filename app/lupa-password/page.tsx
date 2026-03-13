"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useState } from "react";

export default function LupaPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // TODO: implement Firebase sendPasswordResetEmail
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
          Lupa Password?
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted px-4">
          Masukkan email yang Anda gunakan saat mendaftar dan kami akan mengirimkan link untuk mereset password Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-xl border border-border-color sm:rounded-2xl sm:px-10">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success/10 mb-4">
                <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Email Terkirim!</h3>
              <p className="text-sm text-text-muted mb-6">
                Cek inbox email Anda <b>{email}</b> untuk instruksi reset password.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-primary font-medium hover:text-primary-dark text-sm"
              >
                Kirim ulang email
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-border-color rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-primary"
                    placeholder="anda@email.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                >
                  Kirim Link Reset
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/masuk" className="font-medium text-primary hover:text-primary-dark text-sm inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
