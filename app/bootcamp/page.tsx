"use client";

import { Navbar } from "@/components/Navbar";
import { CheckCircle2, Lock, PlayCircle, BookOpen, Download, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getAllCourses, getUserBootcampProgress, markDayComplete } from "@/lib/firebase/bootcamp";
import { generateAndSaveCertificate } from "@/lib/certificates/generate";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";

const defaultDays = [
  { id: 1, title: "Pengenalan UI/UX Dasar", status: "locked", duration: "15 min" },
  { id: 2, title: "Tools Canva & Layouting", status: "locked", duration: "20 min" },
  { id: 3, title: "Social Media Analytics", status: "locked", duration: "18 min" },
  { id: 4, title: "Copywriting Engagement", status: "locked", duration: "15 min" },
  { id: 5, title: "Memahami Algoritma", status: "locked", duration: "22 min" },
  { id: 6, title: "Content Calendar Planning", status: "locked", duration: "18 min" },
  { id: 7, title: "Final Project & Sertifikasi", status: "locked", duration: "30 min" },
];

export default function Bootcamp() {
  const [activeDay, setActiveDay] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [daysState, setDaysState] = useState(defaultDays);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const toast = useToast();

  const COURSE_ID = "canva-mastery-v1"; // Using dummy ID for the demo

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        try {
          // In real app, we'd getAllCourses first or parallel
          const courses = await getAllCourses();
          const progress = await getUserBootcampProgress(user.uid, COURSE_ID);
          
          let lastUnlockedDay = 1;
          const updatedDays = defaultDays.map(day => {
            const isCompleted = progress?.completedDays?.[day.id];
            if (isCompleted) {
              lastUnlockedDay = Math.max(lastUnlockedDay, day.id + 1);
              return { ...day, status: "done" };
            }
            return day;
          });

          // Set the "current" active day
          const finalDays = updatedDays.map(day => {
            if (day.id === lastUnlockedDay) return { ...day, status: "current" };
            if (day.id > lastUnlockedDay) return { ...day, status: "locked" };
            return day;
          });

          setDaysState(finalDays);
          setActiveDay(Math.min(lastUnlockedDay, 7));
        } catch (error) {
          console.error("Bootcamp load error:", error);
          toast.error("Gagal memuat progres kelas.");
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);

  const handleFinish = () => {
    setShowQuiz(true);
  };

  const handleQuizSubmit = async () => {
    setQuizScore(100);
    if (uid) {
      try {
        await markDayComplete(uid, COURSE_ID, activeDay);
        toast.success(`Hari ${activeDay} selesai! 🎉`);
        
        // Update local state to unlock next day
        setDaysState(prev => prev.map(d => {
          if (d.id === activeDay) return { ...d, status: "done" };
          if (d.id === activeDay + 1) return { ...d, status: "current" };
          return d;
        }));
        
        if (activeDay < 7) {
          setActiveDay(activeDay + 1);
        }
      } catch (error) {
        toast.error("Gagal menyimpan progres.");
      }
    }
  };

  const isCompletedCourse = daysState[6].status === "done";

  const handleGenerateCert = async () => {
    if (!auth.currentUser) return;
    setIsGeneratingCert(true);
    try {
      toast.success("Sedang membuat sertifikat...");
      await generateAndSaveCertificate(
        "Canva untuk Marketing Digital",
        auth.currentUser.displayName || "Peserta"
      );
      toast.success("Sertifikat berhasil diunduh dan disimpan!");
    } catch (error) {
      toast.error("Gagal membuat sertifikat. Silakan coba lagi.");
      console.error(error);
    } finally {
      setIsGeneratingCert(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR: NAVIGATOR */}
          <div className="lg:w-1/3 xl:w-1/4 shrink-0">
            <div className="bg-card border border-border-color rounded-2xl p-5 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg text-text-primary mb-5 px-2">Bootcamp Canva 7 Hari</h2>
              
              {isLoading ? (
                <div className="space-y-3 px-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {daysState.map((day) => {
                  let btnClass = "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ";
                  
                  if (day.status === "done") {
                    if (activeDay === day.id) {
                      btnClass += "bg-primary/10 border border-primary/20 text-text-primary shadow-sm";
                    } else {
                      btnClass += "bg-transparent text-text-muted hover:bg-surface";
                    }
                  } else if (day.status === "current") {
                    btnClass += "bg-primary text-white shadow-lg shadow-primary/20";
                  } else {
                    btnClass += "bg-surface text-text-muted opacity-60 cursor-not-allowed";
                  }

                  return (
                    <button 
                      key={day.id}
                      onClick={() => day.status !== "locked" && setActiveDay(day.id)}
                      disabled={day.status === "locked"}
                      className={btnClass}
                    >
                      <div className="shrink-0">
                        {day.status === "done" && <CheckCircle2 className={activeDay === day.id ? "text-primary" : "text-success"} size={20} />}
                        {day.status === "current" && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold font-mono">3</span>}
                        {day.status === "locked" && <Lock size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm truncate ${day.status === "current" ? "text-white" : ""}`}>
                          Day {day.id}: {day.title}
                        </div>
                        <div className={`text-xs ${day.status === "current" ? "text-white/80" : "text-text-muted"}`}>
                          {day.duration}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              )}

              <div className="mt-8 pt-6 border-t border-border-color px-2">
                <button 
                  disabled={!isCompletedCourse || isGeneratingCert} 
                  onClick={handleGenerateCert}
                  className={`w-full border py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${isCompletedCourse ? 'bg-primary border-primary text-white hover:brightness-90 cursor-pointer shadow-lg shadow-primary/20' : 'bg-surface border-border-color text-text-muted cursor-not-allowed opacity-80'}`}
                >
                  <Download size={18} /> {isGeneratingCert ? "Memproses..." : "Generate Sertifikat"}
                </button>
                <p className="text-xs text-center text-text-muted mt-2">
                  {isCompletedCourse ? "Sertifikat siap diunduh!" : "Selesaikan Day 7 untuk membuka."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT MAIN: CONTENT */}
          <div className="lg:w-2/3 xl:w-3/4 flex-1">
            <div className="bg-card border border-border-color rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
              
              {/* Video Placeholder */}
              <div className="aspect-video bg-surface border-b border-border-color relative group flex items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center opacity-40"></div>
                <div className="relative z-10 w-20 h-20 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xl border border-border-color cursor-pointer">
                  <PlayCircle size={40} className="ml-1" />
                </div>
                
                <div className="absolute bottom-4 right-4 bg-background/90 text-text-primary px-3 py-1 rounded-md text-sm font-bold font-mono border border-border-color">
                  18:45
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-10 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-accent/10 text-accent font-bold text-xs px-2.5 py-1 rounded uppercase tracking-wider">Social Media</span>
                  <span className="bg-surface text-text-muted font-bold text-xs px-2.5 py-1 rounded max-w-fit">Day {activeDay}</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-6">{daysState[activeDay - 1]?.title || "Materi Pembelajaran"}</h1>
                
                <div className="prose prose-zinc max-w-none text-text-primary mb-12">
                  <p>
                    Dalam sesi ini, kita akan mempelajari cara membaca analitik bawaan (insights) di platform seperti Instagram, TikTok, dan LinkedIn. Mengerti data adalah kunci untuk membuat konten yang lebih baik di hari-hari selanjutnya.
                  </p>
                  <h3>Apa yang akan kita pelajari:</h3>
                  <ul>
                    <li>Pengertian Reach, Impressions, dan Engagement Rate.</li>
                    <li>Cara menghitung Engagement Rate sesungguhnya.</li>
                    <li>Menganalisis waktu posting terbaik berdasarkan demografi follower.</li>
                    <li>Merencanakan iterasi konten Canva dari data insight.</li>
                  </ul>
                  
                  <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl my-8 text-primary-dark">
                    <strong>Pro Tip:</strong> Jangan hanya fokus pada 'Likes'. 'Saves' dan 'Shares' adalah indikator utama bahwa konten Canva kamu memiliki retensi dan nilai yang riil di mata algoritma.
                  </div>
                </div>

                {/* Interactive Quiz Area */}
                {showQuiz ? (
                  <div className="bg-surface border border-border-color rounded-2xl p-6 md:p-8 mt-12 mb-6 animate-fade-in">
                    <h3 className="font-bold text-lg text-text-primary flex items-center gap-2 mb-6">
                      <BookOpen className="text-primary" /> Kuis Harian: Day {activeDay}
                    </h3>
                    
                    {quizScore === null ? (
                      <div className="space-y-6">
                        <div className="bg-card p-5 rounded-xl border border-border-color shadow-sm">
                          <p className="font-bold text-text-primary mb-4">
                            Metrik mana yang paling penting untuk mengukur "Bermanfaat atau tidaknya" sebuah konten edukasi?
                          </p>
                          <div className="space-y-3">
                            {["Jumlah Likes", "Jumlah Saves/Shares", "Jumlah Views", "Jumlah Comment"].map((opt, i) => (
                              <button key={i} className="w-full text-left px-5 py-3 rounded-lg border border-border-color hover:border-primary hover:bg-primary/5 text-sm font-medium transition-colors bg-background text-text-primary">
                                {String.fromCharCode(65 + i)}. {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={handleQuizSubmit}
                          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold btn-hover"
                        >
                          Submit Jawaban
                        </button>
                      </div>
                    ) : (
                      <div className="bg-success/5 border border-success/30 p-6 rounded-xl flex items-start gap-4">
                         <CheckCircle2 className="text-success h-8 w-8 shrink-0 mt-1" />
                         <div>
                           <h4 className="font-bold text-lg text-success mb-2">Jawaban Benar! Skor 100</h4>
                            <p className="text-sm text-text-muted mb-4 leading-relaxed">Saves menunjukkan audiens ingin kembali melihat konten, sementara Shares memperluas jangkauan organik. Ini esensial untuk konten Canva edukatif.</p>
                           {activeDay < 7 ? (
                             <button onClick={() => { setShowQuiz(false); setQuizScore(null); }} className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm btn-hover inline-flex items-center gap-2">
                               Lanjut ke Day {activeDay + 1}
                             </button>
                           ) : (
                             <div className="font-bold text-success text-sm flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Bootcamp Selesai!</div>
                           )}
                           </div>
                      </div>
                    )}
                  </div>
                ) : daysState[activeDay - 1]?.status !== "done" ? (
                  <div className="mt-12 flex justify-end">
                    <button 
                      onClick={handleFinish}
                      className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold btn-hover shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      Tandai Selesai & Mainkan Kuis <CheckCircle2 size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="mt-12 flex justify-end">
                    <div className="text-success font-bold flex items-center gap-2 bg-success/10 px-5 py-3 rounded-xl border border-success/20">
                      <CheckCircle2 size={20} /> Materi ini telah kamu selesaikan.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
