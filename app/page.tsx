import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Users, Briefcase, GraduationCap, AlertTriangle, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-extrabold text-text-primary tracking-tight mb-6">
                  Dari Tes ke Kerja dalam 
                  <span className="text-primary block mt-2">30 Hari</span>
                </h1>
                <p className="text-lg md:text-xl text-text-muted mb-8 leading-relaxed">
                  Platform AI pertama Indonesia yang mempersiapkan kamu dari tes keterampilan, bootcamp 7 hari, hingga auto-apply CV ke HRD.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/tes" className="inline-flex justify-center items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-lg font-medium btn-hover shadow-lg shadow-primary/30">
                    Mulai Tes Gratis
                    <ArrowRight size={20} />
                  </Link>
                  <Link href="#fitur" className="inline-flex justify-center items-center px-6 py-3.5 rounded-lg font-medium bg-surface text-text-primary border border-border-color hover:bg-border-color/50 transition-colors">
                    Lihat Cara Kerja
                  </Link>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-text-muted font-medium">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-success" /> Gratis</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-success" /> Tanpa daftar dulu</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-success" /> Hasil 5 menit</span>
                </div>
              </div>
              
              <div className="relative lg:ml-auto">
                {/* Mockup dashboard card */}
                <div className="glass-effect rounded-2xl p-6 shadow-xl border border-border-color transform lg:-rotate-1 lg:hover:rotate-0 transition-transform duration-500 w-full max-w-md mx-auto relative z-10 bg-card">
                  <div className="flex justify-between items-start mb-6 border-b border-border-color pb-4">
                    <div>
                      <div className="text-sm text-text-muted font-medium mb-1">Match Score AI</div>
                      <div className="text-3xl font-mono font-bold text-success flex items-center gap-2">
                        89% <TrendingUp size={24} />
                      </div>
                    </div>
                    <div className="h-14 w-14 rounded-full border-4 border-success flex items-center justify-center font-bold text-lg bg-surface relative">
                      <div className="absolute inset-0 rounded-full border-4 border-success animate-ping opacity-20"></div>
                      A-
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-text-primary">Microsoft Excel</span>
                        <span className="font-mono text-success flex items-center gap-1">87% <CheckCircle2 className="w-4 h-4" /></span>
                      </div>
                      <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                         <div className="h-full bg-success rounded-full w-[87%] animate-progress-fill"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-text-primary">Canva Design</span>
                        <span className="font-mono text-warning flex items-center gap-1">60% <AlertTriangle className="w-4 h-4" /></span>
                      </div>
                      <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                         <div className="h-full bg-warning rounded-full w-[60%] animate-progress-fill" style={{ animationDelay: '200ms'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="text-xs text-primary-dark dark:text-primary font-bold uppercase tracking-wider mb-1">Rekomendasi Karir</div>
                    <div className="font-semibold text-text-primary mb-1">Social Media Specialist</div>
                    <div className="text-sm text-text-muted flex justify-between">
                      <span>Rp5.500.000+</span>
                      <span>Hybrid</span>
                    </div>
                    <button className="w-full mt-3 bg-primary text-white py-2 rounded-lg text-sm font-medium btn-hover">
                      Apply Otomatis
                    </button>
                  </div>
                </div>
                
                {/* Decorative background circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="bg-primary-dark text-white py-12 border-y border-primary">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
              <div className="px-4">
                <div className="font-mono text-3xl md:text-4xl font-bold mb-2">14M+</div>
                <div className="text-white/80 text-sm font-medium uppercase tracking-wide">Pencari Kerja</div>
              </div>
              <div className="px-4">
                <div className="font-mono text-3xl md:text-4xl font-bold mb-2">89%</div>
                <div className="text-white/80 text-sm font-medium uppercase tracking-wide">Akurasi AI</div>
              </div>
              <div className="px-4">
                <div className="font-mono text-3xl md:text-4xl font-bold mb-2">300K</div>
                <div className="text-white/80 text-sm font-medium uppercase tracking-wide">Target Terserap</div>
              </div>
              <div className="px-4">
                <div className="font-mono text-3xl md:text-4xl font-bold mb-2">7 Hari</div>
                <div className="text-white/80 text-sm font-medium uppercase tracking-wide">Bootcamp</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section id="solusi" className="py-20 bg-surface">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Mengapa banyak yang sulit dapat kerja?</h2>
              <p className="text-lg text-text-muted">Tiga tantangan utama di Indonesia yang kami pecahkan menggunakan teknologi AI.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border border-border-color hover-card">
                <div className="w-14 h-14 bg-error/10 text-error rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">Skill Gap Terlalu Jauh</h3>
                <p className="text-text-muted leading-relaxed">Pendidikan formal sering kali tidak relevan dengan kebutuhan industri saat ini, mengakibatkan tingginya angka pengangguran terdidik.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border-color hover-card">
                <div className="w-14 h-14 bg-warning/10 text-warning rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">Tidak Ada Jaringan</h3>
                <p className="text-text-muted leading-relaxed">Banyak kandidat berbakat kalah dari pelamar yang memiliki jalur &apos;orang dalam&apos; atau koneksi luas di industri.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border-color hover-card">
                <div className="w-14 h-14 bg-primary/10 text-primary-dark dark:text-primary rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">Sistem HRD Kuno</h3>
                <p className="text-text-muted leading-relaxed">Platform job portal lama hanya melempar ribuan CV tanpa filter yang tepat, merugikan pelamar dan menyulitkan HRD perusahaan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="fitur" className="py-20 bg-background">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-primary font-bold tracking-wider text-sm uppercase mb-3">Langkah ke Sukses</div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Cara KerjaKamu Bekerja</h2>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between relative">
              <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-border-color -z-10"></div>
              
              <div className="flex-1 text-center px-4 mb-8 md:mb-0 relative group">
                <div className="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center border-4 border-background shadow-md mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <h4 className="font-bold text-lg text-text-primary mb-2">1. AI Skill Test</h4>
                <p className="text-sm text-text-muted">Ikuti tes 5 menit. AI akan menganalisis kekuatan dan kelemahanmu secara presisi.</p>
              </div>
              
              <div className="flex-1 text-center px-4 mb-8 md:mb-0 relative group">
                <div className="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center border-4 border-background shadow-md mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  <GraduationCap className="w-10 h-10 text-primary" />
                </div>

                <h4 className="font-bold text-lg text-text-primary mb-2">2. Bootcamp 7 Hari</h4>
                <p className="text-sm text-text-muted">Tingkatkan skill yang paling dibutuhkan industri dengan materi video dan kuis interaktif.</p>
              </div>

              <div className="flex-1 text-center px-4 mb-8 md:mb-0 relative group">
                 <div className="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center border-4 border-background shadow-md mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  <Users className="w-10 h-10 text-primary" />
                </div>

                <h4 className="font-bold text-lg text-text-primary mb-2">3. Mentor Privat</h4>
                <p className="text-sm text-text-muted">Dapatkan bimbingan 1-on-1 dari ahli dan simulasi wawancara langsung bersama AI.</p>
              </div>

              <div className="flex-1 text-center px-4 relative group">
                 <div className="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center border-4 border-background shadow-md mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  <Briefcase className="w-10 h-10 text-primary" />
                </div>

                <h4 className="font-bold text-lg text-text-primary mb-2">4. Auto Apply</h4>
                <p className="text-sm text-text-muted">Profil dan CV-mu disalurkan secara otomatis ke ratusan perusahaan yang cocok 90%+.</p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-20 bg-surface border-y border-border-color">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-12">Mengapa Memilih KerjaKamu?</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-card rounded-2xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-border-color bg-surface">
                    <th className="p-6 font-semibold text-text-primary w-1/3">Fitur Utama</th>
                    <th className="p-6 font-bold text-primary bg-primary/5 text-center flex justify-center items-center gap-1">KerjaKamu <Zap className="w-4 h-4" /></th>
                    <th className="p-6 font-medium text-text-muted text-center">Platform Lain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="p-6 text-text-primary font-medium">Analisis Skill AI</td>
                    <td className="p-6 text-center text-success"><CheckCircle2 className="mx-auto" /></td>
                    <td className="p-6 text-center text-text-muted">-</td>
                  </tr>
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="p-6 text-text-primary font-medium">Pelatihan/Bootcamp Terintegrasi</td>
                    <td className="p-6 text-center text-success"><CheckCircle2 className="mx-auto" /></td>
                    <td className="p-6 text-center text-text-muted">-</td>
                  </tr>
                   <tr className="hover:bg-surface/50 transition-colors">
                    <td className="p-6 text-text-primary font-medium">Simulasi Wawancara AI</td>
                    <td className="p-6 text-center text-success"><CheckCircle2 className="mx-auto" /></td>
                    <td className="p-6 text-center text-text-muted">-</td>
                  </tr>
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="p-6 text-text-primary font-medium">Auto-Apply ke Lowongan Match &gt; 90%</td>
                    <td className="p-6 text-center text-success"><CheckCircle2 className="mx-auto" /></td>
                    <td className="p-6 text-center text-text-muted">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-background">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Terbukti Membantu Meraih Karir</h2>
              <p className="text-lg text-text-muted">Cerita sukses dari beta tester kami di Solo dan sekitarnya.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Dewi Saputri", bg: "bg-blue-100 text-blue-700", job: "Admin Support", quote: "Awalnya bingung setelah lulus SMK N 6 Surakarta harus ngapain. Setelah ikut Bootcamp 7 hari di KerjaKamu, Excel saya jadi mahir dan langsung dapet panggilan kerja!" },
                { name: "Arif Nugroho", bg: "bg-green-100 text-green-700", job: "Graphic Designer", quote: "Fitur auto-apply sangat menghemat waktu. Dulu ngirim 100 CV nggak ada jawaban, pakai ini skor Canva saya yang 90% langsung ditangkap HRD Startup di Jogja." },
                { name: "Siti Rahma", bg: "bg-purple-100 text-purple-700", job: "Digital Marketer", quote: "Simulasi wawancaranya mirip banget sama HRD asli. Saya jadi nggak grogi waktu interview beneran. Rating 10/10 buat KerjaKamu!" }
              ].map((t, i) => (
                <div key={i} className="bg-card p-8 rounded-2xl border border-border-color hover-card" style={{animationDelay: `${i * 100}ms`}}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${t.bg}`}>
                      {t.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">{t.name}</div>
                      <div className="text-xs text-primary font-medium">{t.job}</div>
                    </div>
                  </div>
                  <p className="text-text-muted italic">&quot;{t.quote}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Siap Dapat Kerja dalam 30 Hari?</h2>
            <p className="text-xl text-white/80 mb-10">Bergabunglah dengan ribuan pencari kerja lainnya yang sudah membuktikan. Gratis dicoba, tanpa risiko.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tes" className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg btn-hover shadow-xl">
                Mulai Tes Gratis Sekarang
              </Link>
              <Link href="/daftar-trainer" className="bg-primary-dark border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg btn-hover">
                Daftar Jadi Trainer
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
