"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Zap, UploadCloud, CheckCircle2, ShieldCheck, MailCheck } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { submitTrainerApplication } from "@/lib/firebase/trainers";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";

export default function DaftarTrainer() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Anda harus login untuk mendaftar sebagai trainer.");
      return;
    }
    if (!uploadFile) {
      toast.error("Harap unggah SKCK.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      namaLengkap: formData.get("namaLengkap"),
      email: formData.get("email"),
      bio: formData.get("bio"),
      pengalaman: formData.get("pengalaman"),
    };

    try {
      // Simulate file upload metadata since Storage is disabled
      const skckFileMetadata = {
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
      };

      await submitTrainerApplication(auth.currentUser.uid, data, skckFileMetadata);
      setIsSubmitted(true);
      toast.info('Pendaftaran dikirim, menunggu verifikasi admin');
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim aplikasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {isSubmitted ? (
          <div className="max-w-2xl mx-auto bg-card border border-border-color rounded-2xl shadow-xl p-8 md:p-12 text-center mt-10">
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck size={48} className="text-success" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-text-primary mb-4">Aplikasi Berhasil Dikirim!</h2>
            <p className="text-lg text-text-muted mb-8 leading-relaxed">
              Terima kasih telah mendaftar sebagai Trainer KerjaKamu.
              <br/><br/>
              Tim admin kami sedang meninjau dokumen SKCK dan profil pengalaman Anda. Proses verifikasi biasanya memakan waktu <strong className="text-primary font-bold">1-3 hari kerja</strong>.
            </p>
            
            <div className="bg-surface border border-border-color p-4 rounded-xl text-left mb-8 flex gap-4 text-sm text-text-primary">
               <ShieldCheck className="text-primary shrink-0" size={20} />
               <div>
                 Kami akan mengirimkan notifikasi persetujuan ke email Anda. Pastikan untuk selalu mengecek folder Inbox atau Spam secara berkala.
               </div>
            </div>

            <Link href="/" className="inline-block bg-primary text-white px-8 py-3.5 rounded-xl font-bold btn-hover shadow-md">
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Form Section */}
            <div className="lg:w-3/5">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="text-primary" size={24} />
                  <span className="font-extrabold text-xl font-sans tracking-tight text-primary-dark">Program PIDI 2026</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">Daftar Menjadi Trainer</h1>
                <p className="text-text-muted">Bantu generasi muda Indonesia meraih karir impian mereka.</p>
              </div>

              <form onSubmit={handleSubmit} className="bg-card border border-border-color rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
                
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-text-primary border-b border-border-color pb-2">1. Data Pribadi & Akun</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-text-primary mb-1">Nama Lengkap</label>
                      <input type="text" name="namaLengkap" required className="w-full bg-surface border border-border-color rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Sesuai KTP" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-primary mb-1">Email Aktif</label>
                      <input type="email" name="email" required className="w-full bg-surface border border-border-color rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none" placeholder="anda@email.com" />
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-text-primary mb-1">Password Akun Trainer</label>
                     <input type="password" required className="w-full bg-surface border border-border-color rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Minimal 8 karakter" />
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-lg text-text-primary border-b border-border-color pb-2">2. Keahlian & Pengalaman</h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Spesialisasi (Bisa pilih lebih dari satu)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["Microsoft Excel", "Canva Design", "Adobe Photoshop", "Bahasa Inggris"].map(s => (
                        <label key={s} className="flex items-center gap-2 p-3 bg-surface border border-border-color rounded-lg cursor-pointer hover:bg-border-color transition-colors">
                          <input type="checkbox" value={s} className="w-4 h-4 text-primary focus:ring-primary rounded" />
                          <span className="text-sm font-medium text-text-primary">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">Bio Singkat (Max 150 kata)</label>
                    <textarea name="bio" required className="w-full bg-surface border border-border-color rounded-lg px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none resize-none h-24" placeholder="Ceritakan siapa Anda dan apa passion Anda..."></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">Pengalaman Profesional Terkait</label>
                    <textarea name="pengalaman" required className="w-full bg-surface border border-border-color rounded-lg px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none resize-none h-32" placeholder="Sebutkan pengalaman kerja, organisasi, atau mengajar yang relevan."></textarea>
                  </div>
                </div>

                {/* Docs */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-lg text-text-primary border-b border-border-color pb-2">3. Dokumen Verifikasi</h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Upload SKCK Aktif (Wajib)</label>
                    <div className="border-2 border-dashed border-border-color rounded-xl p-8 bg-surface text-center hover:bg-border-color/50 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                      <UploadCloud className="mx-auto h-12 w-12 text-primary mb-3" />
                      
                      {uploadFile ? (
                        <div className="text-sm font-bold text-success flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} /> {uploadFile.name} (Siap Diunggah)
                        </div>
                      ) : (
                        <>
                          <div className="text-sm font-bold text-primary mb-1">Klik untuk upload atau drag & drop</div>
                          <p className="text-xs text-text-muted">PDF, JPG, atau PNG (Maks. 5MB)</p>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      Dokumen ini diperlukan untuk memastikan keamanan seluruh pengguna platform KerjaKamu sesuai standar PIDI.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg btn-hover shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? "Mengirim..." : "Kirim Aplikasi Trainer"}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Benefits */}
            <div className="lg:w-2/5">
              <div className="bg-primary-dark rounded-2xl p-8 text-white sticky top-24 shadow-xl">
                 <h3 className="text-2xl font-extrabold mb-6">Mengapa Bergabung?</h3>
                 
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <span className="font-bold text-lg">1</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Dampak Sosial Nyata</h4>
                        <p className="text-white/80 text-sm leading-relaxed">Bantu ribuan pencari kerja mengentaskan pengangguran dan mendapatkan karir layak.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <span className="font-bold text-lg">2</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Insentif Mengajar</h4>
                        <p className="text-white/80 text-sm leading-relaxed">Dapatkan honorarium sesuai jumlah jam dari anggaran subsidi penuh program PIDI.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <span className="font-bold text-lg">3</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Waktu Fleksibel</h4>
                        <p className="text-white/80 text-sm leading-relaxed">Pilih jadwal luangmu sendiri. Remote sepenuhnya melalui platform KerjaKamu.</p>
                      </div>
                    </div>
                 </div>

                 <div className="mt-10 pt-6 border-t border-white/20">
                   <p className="text-sm text-white/60 italic text-center">
                     "Platform yang sangat memanusiakan trainer dan peserta. Saya bisa mengajar tanpa perlu pusing mencari murid." - Beta Tester Trainer
                   </p>
                 </div>
              </div>
            </div>

          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
