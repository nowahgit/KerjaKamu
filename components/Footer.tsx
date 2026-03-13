"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border-color py-12 lg:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
           <Link href="/" className="flex items-center gap-2 group mb-4">
              <Zap className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="font-sans font-bold text-lg tracking-tight text-primary-dark dark:text-primary">
                KerjaKamu
              </span>
            </Link>
          <p className="text-sm text-text-muted">
            Platform AI pertama Indonesia yang mempersiapkan kamu dari tes keterampilan, bootcamp 7 hari, hingga auto-apply CV ke HRD.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-4">Pencari Kerja</h4>
          <ul className="space-y-3">
            <li><Link href="/tes" className="text-sm text-text-muted hover:text-primary transition-colors">Skill Test Gratis</Link></li>
            <li><Link href="/bootcamp" className="text-sm text-text-muted hover:text-primary transition-colors">Bootcamp 7 Hari</Link></li>
            <li><Link href="/wawancara" className="text-sm text-text-muted hover:text-primary transition-colors">Simulasi Wawancara</Link></li>
            <li><Link href="/trainer" className="text-sm text-text-muted hover:text-primary transition-colors">Cari Trainer</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-4">Trainer</h4>
          <ul className="space-y-3">
            <li><Link href="/daftar-trainer" className="text-sm text-text-muted hover:text-primary transition-colors">Daftar Jadi Trainer</Link></li>
            <li><Link href="/trainer/dashboard" className="text-sm text-text-muted hover:text-primary transition-colors">Dashboard Trainer</Link></li>
            <li><Link href="/panduan" className="text-sm text-text-muted hover:text-primary transition-colors">Panduan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-4">Perusahaan</h4>
          <ul className="space-y-3">
            <li><Link href="/tentang" className="text-sm text-text-muted hover:text-primary transition-colors">Tentang Kami</Link></li>
            <li><Link href="/kontak" className="text-sm text-text-muted hover:text-primary transition-colors">Kontak</Link></li>
            <li><Link href="/privasi" className="text-sm text-text-muted hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
            <li><Link href="/syarat" className="text-sm text-text-muted hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border-color max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
        <p>© 2026 KerjaKamu. PIDI Hackathon Submission. Dibangun oleh MejaLuar.</p>
        <p className="mt-2 md:mt-0 font-mono text-xs">V0.1.0-BETA</p>
      </div>
    </footer>
  );
}
