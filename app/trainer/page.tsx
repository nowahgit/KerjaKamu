"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Star, MapPin, Video, MessageSquare, Search, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { getAllVerifiedTrainers, createSession } from "@/lib/firebase/trainers";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const trainers = [
  {
    id: 1,
    name: "Rina Kusuma",
    avatar: "RK",
    bg: "bg-pink-100 text-pink-700",
    role: "Senior Graphic Designer @ Tokopedia",
    location: "Jakarta, Remote",
    rating: 4.9,
    sessions: 47,
    specializations: ["Canva", "Photoshop", "UI/UX"],
    price: "Gratis (Subsidi)",
  },
  {
    id: 2,
    name: "Dimas Pratama",
    avatar: "DP",
    bg: "bg-blue-100 text-blue-700",
    role: "Data Analyst @ Gojek",
    location: "Bandung, Remote",
    rating: 4.8,
    sessions: 31,
    specializations: ["Excel", "SQL", "Public Speaking"],
    price: "Gratis (Subsidi)",
  },
  {
    id: 3,
    name: "Sarah Wijaya",
    avatar: "SW",
    bg: "bg-purple-100 text-purple-700",
    role: "English Tutor & Content Creator",
    location: "Bali, Remote",
    rating: 5.0,
    sessions: 124,
    specializations: ["Bahasa Inggris", "Interview Prep"],
    price: "Gratis (Subsidi)",
  },
  {
    id: 4,
    name: "Ahmad Fauzi",
    avatar: "AF",
    bg: "bg-emerald-100 text-emerald-700",
    role: "Digital Marketing Lead @ Shopee",
    location: "Jakarta, Remote",
    rating: 4.7,
    sessions: 89,
    specializations: ["Digital Marketing", "SEO", "Copywriting"],
    price: "Gratis (Subsidi)",
  }
];

export default function CariTrainer() {
  const [search, setSearch] = useState("");
  const [trainersData, setTrainersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function fetchTrainers() {
      try {
        const data = await getAllVerifiedTrainers();
        // Fallback to static if empty for demo purposes, or just show empty state
        if (data.length > 0) {
          setTrainersData(data);
        } else {
          setTrainersData(trainers.map(t => ({ ...t, id: t.id.toString() })));
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat daftar trainer.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrainers();
  }, [toast]);

  const handleRequestSession = async (trainerId: string) => {
    if (!auth.currentUser) {
      toast.error("Silakan login dulu untuk request sesi.");
      return;
    }
    try {
      await createSession({
        trainerId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        status: "pending"
      });
      toast.success("Request sesi berhasil dikirim!");
    } catch (error) {
      toast.error("Gagal mengirim request sesi.");
    }
  };

  const filteredTrainers = trainersData.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    (t.specializations && t.specializations.some((s: string) => s.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header Section */}
        <div className="bg-primary text-white rounded-3xl p-8 md:p-12 mb-10 overflow-hidden relative shadow-xl shadow-primary/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Cari Mentor Privat. Belajar 1-on-1.</h1>
            <p className="text-lg text-white/80 mb-8 font-medium">
              Bimbingan karir gratis dari para ahli industri. Disubsidi penuh oleh Program PIDI 2026.
            </p>
            
            <div className="relative">
               <input 
                 type="text" 
                 placeholder="Cari skill (misal: Excel, Canva, Bahasa Inggris)"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full bg-white text-text-primary px-6 py-4 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-white/30 text-lg font-medium"
               />
               <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Filters (Desktop) */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 border-b border-border-color pb-4">
           {["Semua Spesialisasi", "Canva", "Excel", "Bahasa Inggris", "Digital Marketing", "UI/UX"].map(f => (
             <button key={f} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${f === 'Semua Spesialisasi' ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:bg-border-color border border-border-color'}`}>
               {f}
             </button>
           ))}
        </div>

        {/* Grid Trainers */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border-color rounded-2xl p-6 flex flex-col h-[300px]">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="mt-auto space-y-3">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTrainers.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="w-12 h-12" />}
            title="Belum ada trainer tersedia"
            description="Trainer sedang dalam proses verifikasi, coba lagi nanti"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTrainers.map((t) => (
              <div key={t.id} className="bg-card border border-border-color rounded-2xl shadow-sm hover-card overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border-color relative">
                  <div className="absolute top-4 right-4 bg-primary/10 text-primary-dark font-bold text-xs px-2.5 py-1 rounded badge">
                    Verified Trainer
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                     <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-sm border border-black/5 ${t.bg || "bg-primary/20 text-primary"}`}>
                       {t.avatar || (t.name ? t.name.substring(0, 2).toUpperCase() : "TR")}
                     </div>
                     <div>
                       <h3 className="font-extrabold text-lg text-text-primary">{t.name}</h3>
                       <div className="flex items-center gap-1 text-sm font-bold text-success mb-1">
                         <Star className="fill-success h-4 w-4" /> {t.rating || "5.0"} <span className="text-text-muted font-normal">({t.sessions || 0} sesi)</span>
                       </div>
                     </div>
                  </div>

                  <div className="text-sm font-medium text-text-muted flex items-center gap-2 mb-1.5"><Briefcase size={16} /> {t.role || "Mentor Profesional"}</div>
                  <div className="text-sm font-medium text-text-muted flex items-center gap-2"><MapPin size={16} /> {t.location || "Indonesia"}</div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                   <div className="font-bold text-sm text-text-primary mb-3">Spesialisasi:</div>
                   <div className="flex flex-wrap gap-2 mb-6">
                     {(t.specializations || []).map((s: string) => (
                       <span key={s} className="bg-surface border border-border-color text-text-muted text-xs font-bold px-2 py-1 rounded">
                         {s}
                       </span>
                     ))}
                   </div>

                   <div className="mt-auto flex gap-3">
                     <button onClick={() => handleRequestSession(t.id)} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm btn-hover flex items-center justify-center gap-2 shadow-md shadow-primary/20">
                       <Video size={18} /> Request Sesi
                     </button>
                     <button className="w-12 h-[44px] bg-surface border border-border-color rounded-xl flex items-center justify-center text-primary hover:bg-border-color transition-colors">
                       <MessageSquare size={20} />
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Trainer */}
        <div className="bg-surface border border-border-color rounded-3xl p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <GraduationCap className="text-primary h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Punya Keahlian yang Bisa Dibagikan?</h2>
          <p className="text-text-muted mb-6 max-w-lg">Bantu pencari kerja di Indonesia meningkatkan skill mereka. Daftar menjadi trainer terverifikasi dan dapatkan insentif dari program kami.</p>
          <Link href="/daftar-trainer" className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold btn-hover shadow-lg">
            Daftar Sebagai Trainer
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
