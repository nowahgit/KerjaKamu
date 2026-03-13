"use client";

import { Navbar } from "@/components/Navbar";
import { TrendingUp, Award, Clock, ArrowRight, Download, BookOpen, UserCircle, Briefcase, MapPin, CheckCircle2, AlertTriangle, MonitorPlay, Trophy, FileText } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "@/lib/firebase/users";
import { getMatchingJobs } from "@/lib/firebase/jobs";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Hasil() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bootcampProgress, setBootcampProgress] = useState<any>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !hasFetched.current) {
        hasFetched.current = true;
        try {
          setIsLoading(true);
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
          
            if (userProfile) {
              const fetchedJobs = await getMatchingJobs(user.uid);
              setJobs(fetchedJobs);

              // Fetch bootcamp progress for "Canva" course as default example
              try {
                const { getUserBootcampProgress } = await import("@/lib/firebase/bootcamp");
                const progress = await getUserBootcampProgress(user.uid, "canva-marketing-digital"); // Slug from seed or constant
                setBootcampProgress(progress);
              } catch (e) {
                // Silently fail if no progress
              }
            }
        } catch (error) {
          console.error("Error fetching data", error);
        } finally {
          setIsLoading(false);
        }
      } else if (!user) {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const costOfLiving = [
    { city: "Jakarta", salary: "Rp6.000.000", cost: "Rp1.200.000", effective: "Rp4.800.000", top: false },
    { city: "Batam", salary: "Rp5.500.000", cost: "Rp600.000", effective: "Rp4.900.000", top: true },
    { city: "Bali", salary: "Rp5.500.000", cost: "Rp300.000", effective: "Rp5.200.000", top: false },
    { city: "Solo", salary: "Rp4.000.000", cost: "Rp400.000", effective: "Rp3.600.000", top: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-text-primary">Dashboard AI Report</h1>
          <p className="text-text-muted mt-1">Analisis lengkap keterampilan dan rencana personalisasimu.</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* LEFT COLUMN: 65% */}
          <div className="xl:w-[65%] space-y-8">
            
            {isLoading ? (
              <div className="bg-card border border-border-color rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-8">
                  <Skeleton className="w-40 h-40 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-48 h-8" />
                    <Skeleton className="w-full h-16" />
                  </div>
                </div>
              </div>
            ) : profile?.skillScores === null ? (
              <div className="bg-warning/5 border border-warning/20 rounded-2xl p-10 text-center shadow-sm">
                <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={40} className="text-warning" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-3">Analisis Belum Tersedia</h2>
                <p className="text-text-muted mb-8 max-w-md mx-auto">
                  Kamu belum melakukan Tes Keterampilan AI. Selesaikan tes selama 5 menit untuk mendapatkan Match Score dan rekomendasi lowongan kerja.
                </p>
                <Link href="/tes" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold btn-hover shadow-lg shadow-primary/20">
                  Mulai Tes Sekarang <ArrowRight size={20} />
                </Link>
              </div>
            ) : (
            <div className="bg-card border border-border-color rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -z-10"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* SVG Progress Ring */}
                <div className="relative w-40 h-40 shrink-0">
                  {mounted && (
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - (profile?.matchScore || 0) / 100)} className="text-primary transition-all duration-1000 ease-out" />
                    </svg>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-4xl font-bold text-text-primary">{profile?.matchScore || 0}<span className="text-2xl">%</span></span>
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">Match Score</span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-success/10 text-success text-xs font-bold uppercase tracking-wider mb-3">
                    <Award size={14} /> Kandidat Top 10%
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">{profile?.recommendedJob || "Belum Ada Data"}</h2>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-text-muted mb-4">
                    <span className="flex items-center gap-1"><Briefcase size={16} /> Gaji Efektif: Rp4.9Jt (Batam)</span>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed">
                    AI merekomendasikan peran ini berdasarkan skormu yang tinggi di Literasi Digital dan Bahasa Inggris. Ada peluang besar dengan persaingan rendah di luar Jakarta.
                  </p>
                </div>
              </div>
            </div>
            )}

            {/* SKILL GAP & BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border-color rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
                  <TrendingUp className="text-primary" /> Skill Breakdown
                </h3>
                
                <div className="space-y-5">
                  {[
                    { name: "Microsoft Excel", id: "excel", val: profile?.skillScores?.excel || 0, color: "bg-success", text: "text-success", icon: <CheckCircle2 className="w-4 h-4" /> },
                    { name: "Bahasa Inggris", id: "english", val: profile?.skillScores?.english || 1, color: "bg-success", text: "text-success", icon: <CheckCircle2 className="w-4 h-4" /> },
                    { name: "Canva Design", id: "canva", val: profile?.skillScores?.canva || 1, color: "bg-warning", text: "text-warning", icon: <AlertTriangle className="w-4 h-4" /> },
                    { name: "Literasi Digital", id: "digitalLiteracy", val: profile?.skillScores?.digitalLiteracy || 1, color: "bg-primary", text: "text-primary", icon: <CheckCircle2 className="w-4 h-4" /> }

                  ].map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5 font-medium">
                        <span className="text-text-primary">{s.name}</span>
                        <span className={`font-mono ${s.text}`}>{s.val}% {profile?.skillScores ? s.icon : ''}</span>
                      </div>
                      <div className="h-2.5 w-full bg-surface rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.color} transition-all duration-1000`} style={{ width: mounted ? `${s.val}%` : '0%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GAP ALERT */}
              <div className="bg-warning/5 border border-warning/30 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning shrink-0">
                     <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">Perhatian: Skill Gap</h3>
                    <p className="text-xs text-text-muted">Ditemukan kekurangan yang krusial</p>
                  </div>
                </div>
                
                <p className="text-sm text-text-primary mb-6 leading-relaxed flex-1">
                  Skor <span className="font-bold">Canva (60%)</span> kamu berada di bawah standar minimum industri untuk Social Media Specialist (Target: 80%). Ini akan menghambat lolos screening CV.
                </p>

                <div className="bg-card border border-warning/20 p-4 rounded-xl">
                  <div className="text-sm font-bold text-text-primary mb-2">Rekomendasi AI:</div>
                  <Link href="/bootcamp" className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-border-color transition-colors group">
                    <div className="flex items-center gap-3">
                      <MonitorPlay className="text-primary h-5 w-5" />
                      <div>
                        <div className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">Bootcamp Canva 7 Hari</div>
                        <div className="text-xs text-text-muted">+20% Match Score</div>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-text-muted group-hover:text-primary" />
                  </Link>
                </div>
              </div>
            </div>

            {/* COST OF LIVING TABLE */}
            <div className="bg-card border border-border-color rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-5">Rekomendasi Lokasi Karir Optimal</h3>
              <p className="text-sm text-text-muted mb-6">Analisis perbandingan gaji standar vs biaya hidup daerah (Gaji Efektif = Sisa uang).</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border-color">
                      <th className="pb-3 pt-2 px-4 font-semibold text-text-muted font-mono tracking-wider">KOTA</th>
                      <th className="pb-3 pt-2 px-4 font-semibold text-text-muted font-mono tracking-wider">GAJI STANDAR</th>
                      <th className="pb-3 pt-2 px-4 font-semibold text-text-muted font-mono tracking-wider">BIAYA HIDUP</th>
                      <th className="pb-3 pt-2 px-4 font-semibold text-primary font-mono tracking-wider">GAJI EFEKTIF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {costOfLiving.map((row, i) => (
                      <tr key={i} className={`hover:bg-surface/50 transition-colors ${row.top ? 'bg-primary/5' : ''}`}>
                        <td className="py-3 px-4 font-medium text-text-primary flex items-center gap-2">
                          {row.city} {row.top && <span className="inline-flex items-center" title="Rekomendasi Terbaik"><Trophy className="w-5 h-5 text-yellow-500" /></span>}
                        </td>
                        <td className="py-3 px-4 font-mono">{row.salary}</td>
                        <td className="py-3 px-4 font-mono text-error/80">{row.cost}</td>
                        <td className={`py-3 px-4 font-mono font-bold ${row.top ? 'text-success' : 'text-text-primary'}`}>{row.effective}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* JOB RECOMMENDATIONS */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-text-primary">Lowongan Teratas untukmu</h3>
                <Link href="/jobs" className="text-sm font-medium text-primary hover:text-primary-dark">Lihat Semua</Link>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-border-color rounded-xl p-5 space-y-3 bg-card">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-9 w-full mt-2" />
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <EmptyState
                  icon={<Briefcase className="w-12 h-12" />}
                  title="Belum ada lowongan yang cocok"
                  description="Kerjakan tes keterampilan untuk mendapatkan rekomendasi lowongan yang tepat"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {jobs.map((job, i) => (
                    <div key={i} className="bg-card border border-border-color p-5 rounded-2xl shadow-sm hover-card flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-mono text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">{job.matchScore || 80}% MATCH</div>
                      </div>
                      <h4 className="font-bold text-text-primary mb-1">{job.title}</h4>
                      <div className="text-sm font-medium text-text-muted mb-1">{job.company}</div>
                      <div className="text-xs text-text-muted mb-5 flex items-center gap-1"><MapPin size={12}/> {job.location || "Indonesia"}</div>
                      
                      <div className="mt-auto">
                        <button className="w-full bg-surface border border-border-color text-text-primary py-2 rounded-lg text-sm font-medium hover:bg-border-color transition-colors">
                          Apply Otomatis
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR: 35% */}
          <div className="xl:w-[35%] space-y-6">
            
            {/* USER PROFILE */}
            <div className="bg-card border border-border-color rounded-2xl p-6 shadow-sm text-center">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-6" />
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-surface border-4 border-card shadow-sm mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-primary">
                    {profile?.displayName ? profile.displayName.split(' ').map((n: string) => n[0]).join('') : "P"}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">{profile?.displayName || "Pengguna"}</h3>
                  <p className="text-sm text-text-muted flex items-center justify-center gap-1 mb-6">
                    <MapPin size={14} /> {profile?.location || "Indonesia"}
                  </p>
                </>
              )}
              
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-surface p-3 rounded-xl border border-border-color">
                  <div className="text-xs text-text-muted mb-1 font-medium">Status</div>
                  <div className="text-sm font-bold text-warning flex items-center gap-1">
                    <Clock size={14} /> Menunggu Verifikasi
                  </div>
                </div>
                <div className="bg-surface p-3 rounded-xl border border-border-color">
                  <div className="text-xs text-text-muted mb-1 font-medium">CV</div>
                  <div className="text-sm font-bold text-primary flex items-center gap-1">
                    Auto-generated
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-card border border-border-color rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-color bg-surface/50">
                <h3 className="font-bold text-text-primary">Tindakan Selanjutnya</h3>
              </div>
              <div className="divide-y divide-border-color">
                <Link href="/bootcamp" className="flex items-center gap-4 p-5 hover:bg-surface transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <MonitorPlay size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-text-primary text-sm mb-0.5 group-hover:text-primary transition-colors">
                      {bootcampProgress && bootcampProgress.completedDays?.length > 0 ? "Lanjutkan Bootcamp" : "Mulai Bootcamp"}
                    </div>
                    <div className="text-xs text-text-muted">
                      {bootcampProgress ? `Day ${bootcampProgress.currentDay || 1}: ${bootcampProgress.currentDay === 1 ? 'Mengenal Tools' : 'Materi Selanjutnya'}` : 'Tingkatkan skill desainmu'}
                    </div>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-text-muted" />
                </Link>
                
                <Link href="/wawancara" className="flex items-center gap-4 p-5 hover:bg-surface transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <UserCircle size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-text-primary text-sm mb-0.5 group-hover:text-accent transition-colors">Simulasi Wawancara</div>
                    <div className="text-xs text-text-muted">Latih mental bersama AI HRD</div>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-text-muted" />
                </Link>

                <Link href="/trainer" className="flex items-center gap-4 p-5 hover:bg-surface transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-text-primary text-sm mb-0.5 group-hover:text-success transition-colors">Cari Mentor Privat</div>
                    <div className="text-xs text-text-muted">1-on-1 dengan ahli industri</div>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-text-muted" />
                </Link>
              </div>
            </div>

            {/* CERTIFICATE (LOCKED) */}
            {profile?.certificates && profile.certificates.length > 0 ? (
              <div className="bg-card border border-primary/20 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2">
                   <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded italic">TERVERIFIKASI</div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">Sertifikat Tersedia</h4>
                    <p className="text-xs text-text-muted">{profile.certificates.length} Sertifikat Aktif</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {profile.certificates.map((cert: any, idx: number) => (
                    <a 
                      key={idx} 
                      href={cert.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border-color hover:border-primary transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-primary">
                           <FileText size={16} />
                         </div>
                         <div className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">{cert.title}</div>
                      </div>
                      <Download size={14} className="text-text-muted group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-surface border border-border-color rounded-2xl p-6 text-center shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-card/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-md mb-3 border border-border-color">
                    <svg className="w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-text-primary text-sm">Sertifikat Terkunci</h4>
                  <p className="text-xs text-text-muted mt-1">Selesaikan Bootcamp 7 Hari untuk mengunduh</p>
                </div>
                
                <div className="opacity-50 blur-sm pointer-events-none">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded mb-4 flex items-center justify-center"><Award className="text-primary h-8 w-8"/></div>
                  <div className="h-4 w-3/4 mx-auto bg-border-color rounded mb-2"></div>
                  <div className="h-3 w-1/2 mx-auto bg-border-color rounded"></div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
