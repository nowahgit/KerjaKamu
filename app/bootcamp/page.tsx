"use client";

import { Navbar } from "@/components/Navbar";
import { CheckCircle2, Lock, PlayCircle, BookOpen, Download, AlertCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getAllCourses, getCourseWithDays, getUserBootcampProgress, markDayComplete } from "@/lib/firebase/bootcamp";
import { generateCertificate } from "@/lib/certificates/generate";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";

const defaultDays: any[] = [];

export default function Bootcamp() {
  const [activeDay, setActiveDay] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
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
          const courses = await getAllCourses();
          if (courses.length === 0) {
            setIsLoading(false);
            return;
          }
          
          const activeCourse = courses[0];
          setCourseId(activeCourse.id);
          const courseData = await getCourseWithDays(activeCourse.id);
          const days = courseData.days;
          const progress = await getUserBootcampProgress(user.uid, activeCourse.id);
          
          // Re-ensure sorting as requested
          const sortedDays = days.sort((a: any, b: any) => a.dayNumber - b.dayNumber);
          
          let lastUnlockedDay = 1;
          const updatedDays = sortedDays.map((day: any) => {
            const isCompleted = progress?.completedDays?.includes(day.dayNumber);
            if (isCompleted) {
              lastUnlockedDay = Math.max(lastUnlockedDay, day.dayNumber + 1);
              return { ...day, status: "done" };
            }
            return day;
          });

          // Set the "current" active day
          const finalDays = updatedDays.map((day: any) => {
            if (day.dayNumber === lastUnlockedDay) return { ...day, status: "current" };
            if (day.dayNumber > lastUnlockedDay) return { ...day, status: "locked" };
            return day;
          });

          setDaysState(finalDays);
          setActiveDay(Math.min(lastUnlockedDay, sortedDays.length));
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
    const dayData = daysState[activeDay - 1];
    if (!dayData?.quiz) return;

    let correctCount = 0;
    dayData.quiz.forEach((q: any, i: number) => {
      if (selectedAnswers[i] === q.correctIndex) correctCount++;
    });

    const score = Math.round((correctCount / dayData.quiz.length) * 100);
    setQuizScore(score);

    if (score >= 70 && uid) {
      try {
        await markDayComplete(uid, courseId || COURSE_ID, activeDay, daysState.length);
        toast.success(`Hari ${activeDay} selesai!`);
        
        // Update local state to unlock next day
        setDaysState(prev => prev.map(d => {
          if (d.id === activeDay) return { ...d, status: "done" };
          if (d.id === activeDay + 1) return { ...d, status: "current" };
          return d;
        }));
        
        if (activeDay < 7) {
          // setActiveDay(activeDay + 1); // This will be handled by the "Lanjut ke Day X" button
        }
      } catch (error) {
        toast.error("Gagal menyimpan progres.");
      }
    }
  };

  const isCompletedCourse = daysState.length > 0 && daysState[daysState.length - 1]?.status === "done";

  const handleGenerateCert = async () => {
    if (!auth.currentUser) return;
    setIsGeneratingCert(true);
    try {
      toast.success("Sedang membuat sertifikat...");
      await generateCertificate(
        auth.currentUser.uid,
        auth.currentUser.displayName || "Peserta",
        "Canva untuk Marketing Digital"
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
                      key={day.dayNumber || day.id}
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
                          Day {day.dayNumber || day.id}: {day.title}
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
                  <span className="bg-surface text-text-muted font-bold text-xs px-2.5 py-1 rounded max-w-fit">Day {daysState[activeDay - 1]?.dayNumber || activeDay}</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-6">{daysState[activeDay - 1]?.title || "Materi Pembelajaran"}</h1>
                
                <div className="prose prose-zinc max-w-none text-text-primary mb-12">
                  <div className="whitespace-pre-wrap">
                    {daysState[activeDay - 1]?.content || "Memuat materi..."}
                  </div>
                </div>

                {/* Interactive Quiz Area */}
                {showQuiz ? (
                  <div className="bg-surface border border-border-color rounded-2xl p-6 md:p-8 mt-12 mb-6 animate-fade-in">
                    <h3 className="font-bold text-lg text-text-primary flex items-center gap-2 mb-6">
                      <BookOpen className="text-primary" /> Kuis Harian: Day {daysState[activeDay - 1]?.dayNumber || activeDay}
                    </h3>
                    
                    {quizScore === null ? (
                      <div className="space-y-8">
                        {daysState[activeDay - 1]?.quiz?.map((q: any, qi: number) => (
                          <div key={qi} className="bg-card p-5 rounded-xl border border-border-color shadow-sm">
                            <p className="font-bold text-text-primary mb-4">
                              {qi + 1}. {q.question}
                            </p>
                            <div className="space-y-3">
                              {q.options.map((opt: string, i: number) => (
                                <button 
                                  key={i} 
                                  onClick={() => {
                                    const next = [...selectedAnswers];
                                    next[qi] = i;
                                    setSelectedAnswers(next);
                                  }}
                                  className={`w-full text-left px-5 py-3 rounded-lg border transition-colors text-sm font-medium ${selectedAnswers[qi] === i ? 'border-primary bg-primary/10 text-primary' : 'border-border-color bg-background text-text-primary hover:border-primary/50'}`}
                                >
                                  {String.fromCharCode(65 + i)}. {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={handleQuizSubmit}
                          disabled={selectedAnswers.length < (daysState[activeDay - 1]?.quiz?.length || 0)}
                          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold btn-hover disabled:opacity-50"
                        >
                          Submit Jawaban
                        </button>
                      </div>
                    ) : quizScore >= 70 ? (
                      <div className="bg-success/5 border border-success/30 p-6 rounded-xl flex items-start gap-4">
                         <CheckCircle2 className="text-success h-8 w-8 shrink-0 mt-1" />
                         <div>
                            <h4 className="font-bold text-lg text-success mb-2">Lulus! Skor {quizScore}</h4>
                            <p className="text-sm text-text-muted mb-4 leading-relaxed">Selamat! Kamu memahami materi hari ini dengan sangat baik. Lanjutkan ke hari berikutnya.</p>
                            {activeDay < 7 ? (
                              <button onClick={() => { setShowQuiz(false); setQuizScore(null); setSelectedAnswers([]); setActiveDay(activeDay + 1); }} className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm btn-hover inline-flex items-center gap-2">
                                Lanjut ke Day {activeDay + 1}
                              </button>
                            ) : (
                              <div className="font-bold text-success text-sm flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Bootcamp Selesai!</div>
                            )}
                         </div>
                      </div>
                    ) : (
                      <div className="bg-error/5 border border-error/30 p-6 rounded-xl flex items-start gap-4">
                         <AlertTriangle className="text-error h-8 w-8 shrink-0 mt-1" />
                         <div>
                            <h4 className="font-bold text-lg text-error mb-2">Belum Lulus (Skor {quizScore})</h4>
                            <p className="text-sm text-text-muted mb-4 leading-relaxed">Minimal skor untuk lulus adalah 70. Silakan baca kembali materi dan coba lagi.</p>
                            <button onClick={() => { setQuizScore(null); setSelectedAnswers([]); }} className="bg-error text-white px-6 py-2.5 rounded-lg font-bold text-sm btn-hover inline-flex items-center gap-2">
                              Coba Lagi
                            </button>
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
