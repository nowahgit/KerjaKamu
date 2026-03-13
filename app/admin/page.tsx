"use client";

import { Users, UserSquare2, Briefcase, FileText, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
  const stats = [
    { label: "Total User", value: "14,024", trend: "+12%", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Trainer Aktif", value: "342", trend: "+5%", icon: UserSquare2, color: "text-success", bg: "bg-success/10" },
    { label: "Lowongan Aktif", value: "8,950", trend: "+24%", icon: Briefcase, color: "text-accent", bg: "bg-accent/10" },
    { label: "Aplikasi Masuk", value: "124.5K", trend: "+102%", icon: FileText, color: "text-warning", bg: "bg-warning/10" }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Dashboard Overview</h1>
          <p className="text-text-muted mt-1">Ringkasan aktivitas platform KerjaKamu hari ini.</p>
        </div>
        <Link 
          href="/admin/trainer-verification" 
          className="bg-warning text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-warning/20 hover:brightness-110 flex items-center gap-2"
        >
          <span className="bg-white/20 px-2 py-0.5 rounded text-xs">3</span> Verifikasi Tertunda
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border-color rounded-2xl p-6 shadow-sm hover-card">
            <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                 <s.icon className={s.color} size={24} />
               </div>
               <span className="text-xs font-bold text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded">
                 {s.trend} <ArrowUpRight size={14} />
               </span>
            </div>
            <div className="font-mono text-3xl font-bold text-text-primary mb-1">{s.value}</div>
            <div className="text-sm font-bold text-text-muted uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border-color rounded-2xl shadow-sm overflow-hidden flex flex-col h-96">
           <div className="p-6 border-b border-border-color">
             <h3 className="font-bold text-text-primary">Registrasi User Baru (7 Hari)</h3>
           </div>
           
           <div className="flex-1 p-6 relative flex items-end justify-between px-10 gap-2">
             {/* Dummy SVG Bar Chart */}
             {[40, 60, 45, 80, 55, 90, 100].map((h, i) => (
                <div key={i} className="w-full bg-surface rounded-t-md hover:bg-primary transition-colors cursor-pointer group relative" style={{height: `${h}%`}}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-primary text-bg text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    +{h * 10}
                  </div>
                </div>
             ))}
           </div>
           
           <div className="flex justify-between px-10 pb-6 pt-2 text-xs text-text-muted font-bold">
             <span>Sen</span>
             <span>Sel</span>
             <span>Rab</span>
             <span>Kam</span>
             <span>Jum</span>
             <span>Sab</span>
             <span>Min</span>
           </div>
        </div>

        <div className="bg-card border border-border-color rounded-2xl shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-border-color flex justify-between items-center">
             <h3 className="font-bold text-text-primary">Aktivitas Terkini</h3>
           </div>
           
           <div className="p-6 space-y-6 flex-1 overflow-y-auto hide-scrollbar">
              {[
                { time: "10 menit lalu", title: "Aplikasi Masuk", detail: "Budi S. apply ke Gojek via Auto-Apply", color: "bg-success" },
                { time: "1 jam lalu", title: "Trainer Mendaftar", detail: "Reza M. mendaftar sebagai Trainer Canva", color: "bg-warning" },
                { time: "3 jam lalu", title: "Lowongan Baru", detail: "Tokopedia memposting Digital Marketing", color: "bg-primary" },
                { time: "5 jam lalu", title: "Sesi Selesai", detail: "Sesi Rina K. & Arief (UI/UX) selesai", color: "bg-accent" },
                { time: "Kemarin", title: "Sertifikat Digenerate", detail: "24 User menyelesaikan Bootcamp Excel", color: "bg-primary-dark" }
              ].map((a, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 shadow-sm ${a.color}`}></div>
                  <div>
                    <div className="text-sm font-bold text-text-primary mb-0.5">{a.title}</div>
                    <div className="text-xs text-text-muted mb-1">{a.detail}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold">{a.time}</div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
