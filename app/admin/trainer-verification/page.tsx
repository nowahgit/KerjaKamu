"use client";

import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle2, XCircle, FileText, ChevronDown, DownloadCloud } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { verifyTrainer, rejectTrainer } from "@/lib/firebase/admin";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrainerVerification() {
  const [filter, setFilter] = useState("pending");
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "trainer_applications"));
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrainers(apps);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat aplikasi trainer.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleVerify = async (uid: string) => {
    try {
      if (!auth.currentUser) throw new Error("Not logged in");
      await verifyTrainer(uid, auth.currentUser.uid);
      toast.success("Trainer berhasil diverifikasi.");
      fetchApplications();
    } catch (error) {
      toast.error("Gagal memverifikasi trainer.");
    }
  };

  const handleReject = async (uid: string) => {
    try {
      if (!auth.currentUser) throw new Error("Not logged in");
      await rejectTrainer(uid, auth.currentUser.uid, "Tidak memenuhi standar portofolio");
      toast.info("Aplikasi trainer ditolak.");
      fetchApplications();
    } catch (error) {
      toast.error("Gagal menolak trainer.");
    }
  };

  const filtered = filter === "semua" ? trainers : trainers.filter(t => t.status === filter);

  return (
    <div>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary">Verifikasi Trainer</h1>
        <p className="text-text-muted mt-1">Kelola permohonan pendaftaran mentor berdasarkan validitas SKCK dan Portofolio.</p>
      </div>

      <div className="bg-card border border-border-color rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-border-color flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface/50">
          
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Cari nama atau email..." 
              className="w-full bg-background border border-border-color rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-primary"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
             <Filter size={18} className="text-text-muted hidden sm:block" />
             <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-background border border-border-color rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary focus:outline-none focus:border-primary appearance-none cursor-pointer pr-10 relative flex-1"
             >
               <option value="semua">Semua Status</option>
               <option value="pending">Tertunda (Pending)</option>
               <option value="approved">Terverifikasi</option>
               <option value="rejected">Ditolak</option>
             </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-card border-b border-border-color text-text-muted">
                <th className="px-6 py-4 font-bold tracking-wider">NAMA & INFO</th>
                <th className="px-6 py-4 font-bold tracking-wider">SPESIALISASI</th>
                <th className="px-6 py-4 font-bold tracking-wider">TANGGAL</th>
                <th className="px-6 py-4 font-bold tracking-wider">DOKUMEN</th>
                <th className="px-6 py-4 font-bold tracking-wider">STATUS</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color bg-card">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8">
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </td>
                </tr>
              ) : filtered.map((t) => (
                <tr key={t.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-text-primary">{t.namaLengkap || t.name || "-"}</div>
                    <div className="text-xs text-text-muted">{t.email || t.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-surface border border-border-color px-2 py-0.5 rounded text-xs font-bold text-text-muted">Multiskill</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{new Date(t.submittedAt || Date.now()).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium px-3 py-1.5 bg-primary/5 rounded-md border border-primary/20 transition-colors cursor-default">
                      <FileText size={16} /> {t.skckData?.name || t.skck || "Dokumen.pdf"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded inline-flex text-xs font-bold ${
                      t.status === 'approved' ? 'bg-success/10 text-success' : t.status === 'rejected' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {t.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleVerify(t.id)} className="p-2 bg-success text-white rounded-lg hover:brightness-110 shadow-sm" title="Terima">
                          <CheckCircle2 size={18} />
                        </button>
                        <button onClick={() => handleReject(t.id)} className="p-2 bg-error text-white rounded-lg hover:brightness-110 shadow-sm" title="Tolak">
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <button className="text-primary font-bold hover:underline text-xs">Detail</button>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-border-color flex justify-between items-center text-sm font-medium text-text-muted bg-surface/30">
          <span>Menampilkan 1-4 dari 4 data</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border-color rounded hover:bg-surface disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-primary text-white rounded shadow-sm">1</button>
            <button className="px-3 py-1 border border-border-color rounded hover:bg-surface disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
