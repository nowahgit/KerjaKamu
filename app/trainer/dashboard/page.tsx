"use client";

import { useState, useEffect } from "react";
import { Users, Video, Star, Wallet, CalendarRange, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getTrainerStudents } from "@/lib/firebase/trainers";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrainerDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [trainerName, setTrainerName] = useState("Trainer");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setTrainerName(user.displayName?.split(" ")[0] || "Trainer");
        try {
          const students = await getTrainerStudents(user.uid);
          // Simple unique student count parsing
          const uniqueIds = new Set(students.map(s => s.userId));
          setStudentCount(uniqueIds.size);
        } catch (error) {
          console.error("Error fetching students", error);
        }

        const q = query(collection(db, "sessions"), where("trainerId", "==", user.uid));
        const unsubscribeSnap = onSnapshot(q, (snapshot) => {
          const fetchedSessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSessions(fetchedSessions);
          setIsLoading(false);
        });

        return () => unsubscribeSnap();
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const stats = [
    { label: "Total Murid", value: studentCount.toString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Sesi Minggu Ini", value: sessions.length.toString(), icon: CalendarRange, color: "text-accent", bg: "bg-accent/10" },
    { label: "Rating Rata-rata", value: "4.9", icon: Star, color: "text-warning", bg: "bg-warning/10" },
    { label: "Estimasi Honor", value: "Rp" + (sessions.length * 150) + "Rb", icon: Wallet, color: "text-success", bg: "bg-success/10" }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary">Selamat datang, {trainerName}! 👋</h1>
        <p className="text-text-muted mt-1">Ini ringkasan aktivitas mengajar Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border-color rounded-2xl p-6 shadow-sm hover-card">
            <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                 <s.icon className={s.color} size={24} />
               </div>
            </div>
            <div className={`font-mono text-3xl font-bold mb-1 ${s.color === "text-warning" ? "text-warning flex items-center gap-1" : "text-text-primary"}`}>
               {s.value} {s.color === "text-warning" && <Star size={20} className="fill-warning mt-1" />}
            </div>
            <div className="text-sm font-bold text-text-muted uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jadwal Hari Ini */}
        <div className="lg:col-span-2 bg-card border border-border-color rounded-2xl shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-border-color flex justify-between items-center bg-surface/30">
             <h3 className="font-bold text-text-primary">Jadwal Sesi Hari Ini</h3>
             <button className="text-sm text-primary font-bold hover:underline">Lihat Kalender</button>
           </div>
           
           <div className="p-6 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-border-color rounded-xl">
                  <p className="text-sm text-text-muted mb-4">Belum ada sesi terjadwal hari ini.</p>
                  <button className="border border-border-color bg-surface hover:bg-border-color px-6 py-2.5 rounded-lg text-sm font-bold text-text-primary transition-colors">
                    + Buka Slot Sesi Baru
                  </button>
                </div>
              ) : sessions.map((s, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 p-5 bg-surface border border-border-color rounded-xl hover:bg-border-color/50 transition-colors">
                  <div className="flex items-center gap-2 font-mono font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg shrink-0 w-fit">
                    <Clock size={16} /> 14:00 - 15:00
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-text-primary mb-1">{s.userName || "User ID: " + s.userId.substring(0, 5)}</div>
                    <div className="text-sm text-text-muted">{s.status === "pending" ? "Menunggu Konfirmasi" : "Sesi Aktif"}</div>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold btn-hover shadow-sm flex items-center gap-2">
                       <Video size={16} /> Buka Google Meet
                    </button>
                  </div>
                </div>
              ))}
              
              {!isLoading && sessions.length > 0 && (
                <div className="text-center p-4 mt-4">
                  <button className="border border-border-color bg-surface hover:bg-border-color px-4 py-2 rounded-lg text-sm font-bold text-text-primary transition-colors">
                    + Buka Slot Sesi Baru
                  </button>
                </div>
              )}
           </div>
        </div>

        {/* Murid Butuh Perhatian */}
        <div className="bg-card border border-border-color rounded-2xl shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-border-color flex justify-between items-center bg-error/5">
             <h3 className="font-bold text-error flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Murid Butuh Bantuan</h3>
           </div>
           
           <div className="p-6 space-y-6 flex-1">
              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface shrink-0 flex items-center justify-center font-bold text-text-primary border border-border-color shadow-sm">
                    RK
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary mb-0.5">Rendi Kurniawan</div>
                    <div className="text-xs text-error font-medium mb-1">Gagal Kuis Day 4 (2x)</div>
                    <div className="text-xs text-text-muted mb-3">Kesulitan di materi Layouting Canva.</div>
                    <button className="text-xs font-bold text-primary hover:underline">Kirim Pesan Dukungan</button>
                  </div>
              </div>
              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface shrink-0 flex items-center justify-center font-bold text-text-primary border border-border-color shadow-sm">
                    DA
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary mb-0.5">Dewi Anggraini</div>
                    <div className="text-xs text-warning font-medium mb-1">Tidak aktif 3 hari</div>
                    <div className="text-xs text-text-muted mb-3">Tersendat di Day 2 Bootcamp.</div>
                    <button className="text-xs font-bold text-primary hover:underline">Ingatkan Jadwal</button>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
