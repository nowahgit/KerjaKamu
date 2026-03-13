'use client'
import { useState } from 'react'
import { db, auth } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import {
  doc, setDoc, addDoc, collection, serverTimestamp
} from 'firebase/firestore'

export default function SeedPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const log = (msg: string) => setLogs(prev => [...prev, msg])

  const runSeed = async () => {
    setRunning(true)

    // ── ADMIN ──────────────────────────────────────
    try {
      const c = await createUserWithEmailAndPassword(auth, 'admin@kerjakamu.id', 'Admin123!')
      await updateProfile(c.user, { displayName: 'Admin KerjaKamu' })
      await setDoc(doc(db, 'users', c.user.uid), {
        name: 'Admin KerjaKamu', email: 'admin@kerjakamu.id',
        role: 'admin', location: 'DKI Jakarta', avatarUrl: '',
        skillScores: null, matchScore: null, recommendedJob: null,
        bootcampProgress: {}, interviewScore: null,
        certificates: [], appliedJobs: [], trainerId: null,
        createdAt: serverTimestamp(),
      })
      log('✅ Admin: admin@kerjakamu.id / Admin123!')
    } catch (e: any) { log('⚠️ Admin: ' + e.message) }

    // ── TRAINER ────────────────────────────────────
    try {
      const c = await createUserWithEmailAndPassword(auth, 'trainer@kerjakamu.id', 'Trainer123!')
      await updateProfile(c.user, { displayName: 'Rina Kusuma' })
      await setDoc(doc(db, 'users', c.user.uid), {
        name: 'Rina Kusuma', email: 'trainer@kerjakamu.id',
        role: 'trainer', status: 'verified', location: 'Jawa Tengah',
        avatarUrl: '', skillScores: null, matchScore: null,
        recommendedJob: null, bootcampProgress: {}, interviewScore: null,
        certificates: [], appliedJobs: [], trainerId: null,
        createdAt: serverTimestamp(),
      })
      await setDoc(doc(db, 'trainers', c.user.uid), {
        name: 'Rina Kusuma', email: 'trainer@kerjakamu.id',
        status: 'verified', specializations: ['canva', 'photoshop'],
        bio: 'Desainer grafis 5 tahun, spesialis Canva dan Photoshop untuk marketing digital UKM Indonesia.',
        experience: '5 tahun freelance designer dan content creator',
        skckUrl: '', students: [], rating: 4.9, totalSessions: 47,
        ratePerSession: 75000, verifiedAt: serverTimestamp(),
      })
      log('✅ Trainer: trainer@kerjakamu.id / Trainer123!')
    } catch (e: any) { log('⚠️ Trainer: ' + e.message) }

    // ── JOBS ───────────────────────────────────────
    const jobs = [
      {
        title: 'Social Media Specialist', company: 'PT Maju Digital Indonesia',
        companyType: 'Startup', salary: 5500000, salaryEffective: 4900000,
        location: 'Batam', region: 'Kepulauan Riau',
        requiredSkills: { excel: 60, canva: 80, english: 70, photoshop: 50 },
        description: 'Mengelola konten media sosial, membuat laporan performa mingguan, koordinasi dengan tim marketing.',
        requirements: ['Mahir Canva', 'Pengalaman manage IG/TikTok', 'Bisa analitik dasar'],
        isActive: true, createdAt: serverTimestamp(),
      },
      {
        title: 'Content Creator', company: 'CV Kreatif Nusantara',
        companyType: 'Agency', salary: 4800000, salaryEffective: 3600000,
        location: 'Jakarta Selatan', region: 'DKI Jakarta',
        requiredSkills: { excel: 40, canva: 90, english: 60, photoshop: 70 },
        description: 'Membuat konten visual untuk klien agency: postingan sosmed, banner promosi, materi iklan digital.',
        requirements: ['Portfolio minimal 10 karya', 'Canva Pro dan Photoshop', 'Kreatif dan on-trend'],
        isActive: true, createdAt: serverTimestamp(),
      },
      {
        title: 'Marketing Assistant', company: 'Startup Aksara',
        companyType: 'Startup', salary: 4200000, salaryEffective: 3800000,
        location: 'Solo', region: 'Jawa Tengah',
        requiredSkills: { excel: 70, canva: 60, english: 50, photoshop: 30 },
        description: 'Membantu riset pasar, laporan Excel bulanan, koordinasi kampanye digital, input data CRM.',
        requirements: ['Excel pivot table dan VLOOKUP', 'Familiar Google Workspace', 'Teliti dan detail'],
        isActive: true, createdAt: serverTimestamp(),
      },
      {
        title: 'Data Entry & Admin', company: 'PT Logistik Cepat',
        companyType: 'Corporate', salary: 3800000, salaryEffective: 3400000,
        location: 'Surabaya', region: 'Jawa Timur',
        requiredSkills: { excel: 90, canva: 20, english: 40, photoshop: 10 },
        description: 'Input dan validasi data pengiriman harian, generate laporan Excel, koordinasi gudang.',
        requirements: ['Excel mahir wajib', 'Mengetik 50 wpm', 'Familiar ERP sederhana'],
        isActive: true, createdAt: serverTimestamp(),
      },
      {
        title: 'Admin & Keuangan', company: 'UD Makmur Jaya',
        companyType: 'UKM', salary: 3500000, salaryEffective: 3100000,
        location: 'Semarang', region: 'Jawa Tengah',
        requiredSkills: { excel: 85, canva: 30, english: 30, photoshop: 10 },
        description: 'Administrasi kantor harian, pembukuan sederhana, laporan keuangan bulanan.',
        requirements: ['Excel laporan keuangan', 'Jujur dan dapat dipercaya', 'Pengalaman admin diutamakan'],
        isActive: true, createdAt: serverTimestamp(),
      },
      {
        title: 'Graphic Designer', company: 'Agensi Kreatif Nusantara',
        companyType: 'Agency', salary: 5000000, salaryEffective: 4400000,
        location: 'Yogyakarta', region: 'DI Yogyakarta',
        requiredSkills: { excel: 30, canva: 85, english: 55, photoshop: 90 },
        description: 'Desain materi visual untuk klien: brosur, banner, packaging, identitas brand.',
        requirements: ['Portfolio kuat', 'Mahir Photoshop', 'Memahami prinsip branding'],
        isActive: true, createdAt: serverTimestamp(),
      },
    ]
    for (const job of jobs) await addDoc(collection(db, 'jobs'), job)
    log('✅ 6 jobs ditambahkan')

    // ── BOOTCAMP ───────────────────────────────────
    const courseRef = await addDoc(collection(db, 'bootcamp_courses'), {
      title: 'Canva untuk Marketing Digital',
      description: 'Kuasai Canva dari nol hingga bisa buat konten profesional untuk marketing digital.',
      totalDays: 7, skillTarget: 'canva', level: 'Pemula',
      estimatedTime: '15 menit/hari', createdAt: serverTimestamp(),
    })

    const days = [
      { dayNumber: 1, title: 'Mengenal Interface & Tools Dasar Canva', duration: 15,
        content: '## Apa itu Canva?\n\nCanva adalah platform desain grafis berbasis web yang memungkinkan siapa saja membuat konten visual profesional.\n\n## Tools Utama\n\n**Canvas Area** — Area kerja utama\n**Toolbar Kiri** — Template, elemen, teks, foto\n**Toolbar Atas** — Font, ukuran, warna, align\n\n## Shortcut Penting\n\n- **T** = tambah teks\n- **R** = tambah rectangle\n- **Ctrl+D** = duplikasi elemen\n- **Ctrl+Z** = undo',
        quiz: [
          { question: 'Ukuran standar postingan Instagram feed adalah?', options: ['1920x1080px', '1080x1080px', '800x600px', '1280x720px'], correctIndex: 1, explanation: '1080x1080px adalah rasio 1:1 standar Instagram feed.' },
          { question: 'Shortcut duplikasi elemen di Canva?', options: ['Ctrl+C', 'Ctrl+V', 'Ctrl+D', 'Ctrl+Z'], correctIndex: 2, explanation: 'Ctrl+D langsung menduplikasi tanpa perlu copy-paste.' },
          { question: 'Toolbar kiri Canva berisi?', options: ['Pengaturan akun', 'Template, elemen, teks, foto', 'Ukuran kanvas', 'Export settings'], correctIndex: 1, explanation: 'Toolbar kiri adalah panel utama untuk semua aset desain.' },
        ]
      },
      { dayNumber: 2, title: 'Typography: Memilih & Memadukan Font', duration: 15,
        content: '## Aturan Dasar Typography\n\n**Maksimal 2-3 Font** — Lebih dari itu terlihat berantakan\n**Kontras Ukuran** — Judul besar + body sedang\n**Pasangan Font Terbukti:**\n- Montserrat + Open Sans (bisnis)\n- Poppins + DM Sans (startup)\n\n## Hierarki Teks\n\n1. Headline — paling besar, paling bold\n2. Subheadline — medium, semi-bold\n3. Body — kecil, regular',
        quiz: [
          { question: 'Maksimal berapa jenis font dalam satu desain?', options: ['1 font', '2-3 font', '4-5 font', 'Bebas'], correctIndex: 1, explanation: '2-3 font menjaga konsistensi dan keterbacaan.' },
          { question: 'Pasangan font terbaik untuk desain bisnis profesional?', options: ['Comic Sans + Arial', 'Montserrat + Open Sans', 'Impact + Papyrus', 'Cursive + Decorative'], correctIndex: 1, explanation: 'Montserrat + Open Sans adalah kombinasi profesional yang terbukti.' },
          { question: 'Tujuan hierarki teks dalam desain?', options: ['Lebih berwarna', 'Mengarahkan mata ke info terpenting', 'Lebih banyak font', 'File lebih kecil'], correctIndex: 1, explanation: 'Hierarki memandu mata dari info paling penting ke detail.' },
        ]
      },
      { dayNumber: 3, title: 'Teori Warna & Color Palette', duration: 15,
        content: '## Aturan 60-30-10\n\n- **60%** warna dominan (background)\n- **30%** warna sekunder (elemen utama)\n- **10%** warna aksen (CTA, highlight)\n\n## Psikologi Warna\n\n| Warna | Asosiasi | Industri |\n|-------|----------|----------|\n| Biru | Kepercayaan | Fintech, korporat |\n| Merah | Energi | Promo, food |\n| Hijau | Alam | Organik, finance |\n\n## Tools\n\n- coolors.co — generator palette\n- color.adobe.com — color wheel',
        quiz: [
          { question: 'Porsi warna aksen dalam aturan 60-30-10?', options: ['60%', '30%', '10%', '20%'], correctIndex: 2, explanation: 'Warna aksen 10% untuk elemen penting agar menonjol.' },
          { question: 'Warna yang diasosiasikan dengan kepercayaan untuk fintech?', options: ['Merah', 'Kuning', 'Biru', 'Orange'], correctIndex: 2, explanation: 'Biru = kepercayaan, stabilitas, profesionalisme.' },
          { question: 'Tool gratis untuk generate color palette harmonis?', options: ['Figma', 'coolors.co', 'Photoshop', 'Illustrator'], correctIndex: 1, explanation: 'coolors.co adalah generator palette populer dan gratis.' },
        ]
      },
      { dayNumber: 4, title: 'Layout & Komposisi Desain', duration: 15,
        content: '## Rule of Thirds\n\nBagi kanvas menjadi 9 bagian (3x3). Letakkan elemen penting di titik persimpangan.\n\n## White Space\n\nRuang kosong bukan pemborosan — ini napas desain. Brand premium selalu punya banyak white space.\n\n## Alignment\n\nSelalu align elemen ke satu sumbu. Desain tidak ter-align terlihat amatir.\n\n## Grid System\n\nAktifkan: View → Show rulers & guides',
        quiz: [
          { question: 'Rule of thirds: elemen penting diletakkan di?', options: ['Tepat tengah', 'Titik persimpangan grid 3x3', 'Pojok kiri atas', 'Bagian bawah'], correctIndex: 1, explanation: 'Persimpangan 3x3 lebih menarik perhatian dari pusat.' },
          { question: 'Mengapa white space penting?', options: ['Hemat tinta', 'Meningkatkan keterbacaan dan kesan premium', 'File lebih kecil', 'Standar ISO'], correctIndex: 1, explanation: 'White space meningkatkan fokus dan memberi kesan premium.' },
          { question: 'Cara aktifkan guides di Canva?', options: ['File → Guides', 'View → Show rulers & guides', 'Edit → Add guides', 'Insert → Grid'], correctIndex: 1, explanation: 'View → Show rulers & guides mengaktifkan ruler dan drag guide.' },
        ]
      },
      { dayNumber: 5, title: 'Desain Konten Media Sosial', duration: 15,
        content: '## Ukuran per Platform\n\n| Platform | Format | Ukuran |\n|----------|--------|--------|\n| Instagram Feed | Square | 1080x1080px |\n| Instagram Story | Vertikal | 1080x1920px |\n| LinkedIn Post | Landscape | 1200x627px |\n| LinkedIn Banner | Wide | 1584x396px |\n\n## Template Strategy\n\nBuat template sekali → duplikasi → ganti teks dan foto. Konsistensi lebih penting dari kreativitas.',
        quiz: [
          { question: 'Ukuran Instagram Story?', options: ['1080x1080px', '1080x1920px', '1920x1080px', '600x600px'], correctIndex: 1, explanation: '1080x1920px mengisi penuh layar smartphone secara vertikal.' },
          { question: 'Mengapa konten sosmed tidak boleh terlalu banyak teks?', options: ['Mahal', 'Platform turunkan jangkauan konten teks berlebihan', 'Tidak bisa dibaca mobile', 'Standar ISO'], correctIndex: 1, explanation: 'Facebook/Instagram mengurangi distribusi konten dengan teks >20% area.' },
          { question: 'Cara paling efisien buat banyak konten konsisten?', options: ['Buat ulang dari nol', 'Template duplikasi dan edit', 'Download tema internet', 'Minta desainer'], correctIndex: 1, explanation: 'Template duplikasi menjamin konsistensi brand dan mempercepat produksi.' },
        ]
      },
      { dayNumber: 6, title: 'Membuat Presentasi Profesional', duration: 15,
        content: '## Struktur Presentasi Efektif\n\n1. Cover — judul + nama + tanggal\n2. Agenda — outline max 5 poin\n3. Problem — masalah yang dihadapi\n4. Solution — solusi ditawarkan\n5. Data — bukti dan angka\n6. Action Plan — langkah selanjutnya\n7. Closing — pesan kuat + kontak\n\n## Aturan Presentasi\n\n**1 slide = 1 Ide** — Jangan jejalkan banyak info\n**Gunakan Angka** — "47%" lebih kuat dari "signifikan"\n**Minimal Bullet Points** — Gunakan visual',
        quiz: [
          { question: 'Berapa ide ideal per slide?', options: ['Sebanyak mungkin', 'Maksimal 3', '1 ide per slide', '5-7 ide'], correctIndex: 2, explanation: '1 slide = 1 ide membantu audiens fokus.' },
          { question: 'Format terbaik kirim presentasi ke HRD?', options: ['PNG', 'MP4', 'PDF', 'PSD'], correctIndex: 2, explanation: 'PDF mempertahankan layout sempurna di semua device.' },
          { question: 'Pernyataan mana yang lebih efektif?', options: ['"Meningkat signifikan"', '"Tumbuh pesat"', '"Meningkat 47% dalam 3 bulan"', '"Sangat berkembang"'], correctIndex: 2, explanation: 'Data spesifik lebih kredibel dan mudah diingat.' },
        ]
      },
      { dayNumber: 7, title: 'Portfolio Digital & Persiapan Kerja', duration: 15,
        content: '## Yang HRD Cari\n\n1. Relevansi — karya sesuai posisi\n2. Proses — tunjukkan before/after\n3. Hasil — dampak nyata (traffic naik X%)\n4. Variasi — minimal 5-8 karya\n\n## Struktur Portfolio\n\n- Halaman 1: Cover\n- Halaman 2: About + keahlian\n- Halaman 3-7: Karya terpilih\n- Halaman 8: Kontak + CTA\n\n## Publish Online\n\nCanva → Share → Publish as website → dapat link portfolio.my.canva.site',
        quiz: [
          { question: 'Minimal karya dalam portfolio desain?', options: ['1-2', '3-4', '5-8', '15-20'], correctIndex: 2, explanation: '5-8 karya terpilih berkualitas lebih baik dari banyak karya biasa.' },
          { question: 'Cara publish portfolio Canva online?', options: ['Export PDF kirim WA', 'Share → Publish as website', 'Screenshot upload Drive', 'Print dan scan'], correctIndex: 1, explanation: 'Publish as website menghasilkan link yang bisa dibagikan di CV.' },
          { question: 'Yang membedakan portfolio biasa vs dilirik HRD?', options: ['Banyak karya', 'Warna mencolok', 'Menunjukkan proses dan dampak nyata', 'Template premium'], correctIndex: 2, explanation: 'HRD ingin tahu cara berpikir dan dampak karya — bukan sekadar hasil.' },
        ]
      },
    ]
    for (const day of days) {
      await addDoc(collection(db, 'bootcamp_courses', courseRef.id, 'days'), {
        ...day, createdAt: serverTimestamp()
      })
    }
    log('✅ Bootcamp 7 hari lengkap')

    // ── SKILL TEST QUESTIONS ───────────────────────
    await setDoc(doc(db, 'skill_test_questions', 'v1'), {
      excel: [
        { q: 'Fungsi Excel untuk mencari nilai berdasarkan kunci di kolom lain?', opts: ['SUMIF', 'VLOOKUP', 'COUNTIF', 'INDEX'], correct: 1, exp: 'VLOOKUP mencari nilai di kolom pertama dan mengembalikan nilai kolom lain.' },
        { q: 'Rumus menjumlahkan sel B2 hingga B10?', opts: ['=ADD(B2:B10)', '=SUM(B2:B10)', '=TOTAL(B2,B10)', '=PLUS(B2:B10)'], correct: 1, exp: '=SUM() adalah fungsi penjumlahan standar untuk range sel.' },
        { q: 'Kegunaan Pivot Table di Excel?', opts: ['Buat grafik otomatis', 'Meringkas dan menganalisis data besar', 'Mengunci sel', 'Beri warna otomatis'], correct: 1, exp: 'Pivot Table memungkinkan analisis data kompleks tanpa rumus.' },
        { q: 'Shortcut menyimpan file Excel?', opts: ['Ctrl+P', 'Ctrl+S', 'Ctrl+Z', 'Ctrl+A'], correct: 1, exp: 'Ctrl+S adalah shortcut universal save di semua Office.' },
        { q: 'Fungsi COUNTIF digunakan untuk?', opts: ['Jumlahkan total', 'Hitung sel yang memenuhi kriteria', 'Cari nilai tertinggi', 'Urutkan data'], correct: 1, exp: 'COUNTIF menghitung sel yang memenuhi kondisi tertentu.' },
        { q: 'Fitur untuk membekukan baris pertama saat scroll?', opts: ['Protect Sheet', 'Freeze Panes', 'Lock Row', 'Pin Header'], correct: 1, exp: 'Freeze Panes di View membekukan baris/kolom saat scroll.' },
        { q: 'Rumus nilai terbesar dari A1:A20?', opts: ['=LARGEST(A1:A20)', '=MAX(A1:A20)', '=HIGHEST(A1:A20)', '=TOP(A1:A20)'], correct: 1, exp: '=MAX() mengembalikan nilai numerik terbesar dari range.' },
      ],
      canva: [
        { q: 'Ukuran standar Instagram feed?', opts: ['1920x1080px', '1080x1080px', '800x600px', '1280x720px'], correct: 1, exp: '1080x1080px adalah rasio 1:1 standar Instagram feed.' },
        { q: 'Maksimal font dalam satu desain?', opts: ['1 font', '2-3 font', '5-6 font', 'Bebas'], correct: 1, exp: '2-3 font menjaga konsistensi dan keterbacaan.' },
        { q: 'Aturan 60-30-10 mengacu pada?', opts: ['Ukuran elemen', 'Proporsi warna dominan, sekunder, aksen', 'Jumlah halaman', 'Ukuran font'], correct: 1, exp: '60% dominan, 30% sekunder, 10% aksen = harmoni visual.' },
        { q: 'Format terbaik logo dengan latar transparan?', opts: ['JPG', 'PNG', 'BMP', 'TIFF'], correct: 1, exp: 'PNG mendukung transparansi — JPG tidak.' },
        { q: 'Fitur simpan warna dan font brand di Canva?', opts: ['Style Guide', 'Brand Kit', 'Design System', 'Theme Manager'], correct: 1, exp: 'Brand Kit menyimpan aset brand agar konsisten.' },
        { q: 'Ukuran optimal LinkedIn Banner?', opts: ['820x312px', '1584x396px', '1200x628px', '1080x1080px'], correct: 1, exp: '1584x396px adalah ukuran resmi LinkedIn banner.' },
        { q: 'Rule of Thirds berarti?', opts: ['Pakai 3 warna', 'Bagi 3x3, elemen di titik persimpangan', 'Buat 3 versi', 'Font 3 ukuran'], correct: 1, exp: 'Titik persimpangan 3x3 lebih menarik dari center.' },
      ],
      english: [
        { q: 'Terjemahan "I am experienced in data analysis"?', opts: ['Saya berpengalaman dalam analisis data', 'Saya senang analisis data', 'Saya belajar analisis data', 'Saya ahli data sains'], correct: 0, exp: '"Experienced in" = berpengalaman dalam.' },
        { q: 'Kalimat pembuka email lamaran formal?', opts: ['"Hey, I\'m Budi"', '"My name is Budi and I am writing to apply for..."', '"Budi here, wanna apply"', '"Call me Budi"'], correct: 1, exp: 'Email formal dimulai dengan perkenalan dan tujuan yang jelas.' },
        { q: '"Deadline" dalam konteks kerja berarti?', opts: ['Garis finish lomba', 'Batas waktu penyelesaian tugas', 'Tanggal mulai proyek', 'Rapat mingguan'], correct: 1, exp: 'Deadline = batas waktu yang tidak boleh dilewati.' },
        { q: '"As soon as possible" disingkat?', opts: ['ASAP', 'ASSP', 'AASP', 'ASP'], correct: 0, exp: 'ASAP = As Soon As Possible = sesegera mungkin.' },
        { q: '"Proactive" dalam konteks kerja berarti?', opts: ['Reaktif terhadap masalah', 'Ambil inisiatif sebelum diminta', 'Kerja perlahan', 'Tunggu instruksi'], correct: 1, exp: 'Proactive = ambil tindakan sebelum situasi memaksa.' },
        { q: 'Terjemahan "Please find attached my CV"?', opts: ['CV saya tidak ditemukan', 'Mohon temukan CV saya', 'Tolong pertimbangkan saya', 'CV saya terlampir untuk pertimbangan Anda'], correct: 3, exp: '"Please find attached" = memberi tahu ada lampiran.' },
        { q: '"Best regards" digunakan sebagai?', opts: ['Salam pembuka', 'Salam penutup', 'Subjek email', 'Tanda tangan'], correct: 1, exp: '"Best regards" adalah salam penutup email bisnis.' },
      ],
      digitalLiteracy: [
        { q: 'Google Workspace TIDAK mencakup?', opts: ['Google Docs', 'Google Sheets', 'Google Photoshop', 'Google Slides'], correct: 2, exp: 'Google Photoshop tidak ada. Workspace: Docs, Sheets, Slides, Drive, dll.' },
        { q: 'Fungsi utama Google Drive?', opts: ['Edit foto online', 'Menyimpan dan berbagi file via cloud', 'Buat website', 'Kirim email massal'], correct: 1, exp: 'Google Drive adalah penyimpanan cloud untuk akses file dari mana saja.' },
        { q: 'Tool kolaborasi dokumen real-time?', opts: ['Microsoft Word offline', 'Google Docs', 'Notepad', 'WordPad'], correct: 1, exp: 'Google Docs memungkinkan banyak orang edit bersamaan.' },
        { q: '"Phishing" dalam keamanan digital?', opts: ['Memancing ikan digital', 'Penipuan curi info via email/link palsu', 'Cara backup data', 'Antivirus'], correct: 1, exp: 'Phishing meniru entitas terpercaya untuk mencuri data sensitif.' },
        { q: 'Format terbaik dokumen tidak bisa diedit?', opts: ['DOCX', 'XLSX', 'PDF', 'TXT'], correct: 2, exp: 'PDF mempertahankan format dan tidak bisa diedit tanpa software khusus.' },
        { q: 'VPN berfungsi untuk?', opts: ['Percepat internet', 'Sembunyikan identitas dan enkripsi koneksi', 'Blokir iklan', 'Simpan password'], correct: 1, exp: 'VPN mengenkripsi traffic dan menyembunyikan IP untuk privasi.' },
        { q: '"Cloud computing" berarti?', opts: ['Hanya saat cuaca cerah', 'Akses computing via internet tanpa hardware lokal', 'Hanya perusahaan besar', 'Butuh CD/DVD'], correct: 1, exp: 'Cloud computing menyediakan resources via internet on-demand.' },
      ],
      updatedAt: serverTimestamp(),
    })
    log('✅ 28 soal skill test ditambahkan')

    setDone(true)
    setRunning(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold font-sans text-gray-900 dark:text-white mb-2">
          Seed Database
        </h1>
        <p className="text-gray-500 dark:text-slate-400 font-sans text-sm mb-6">
          Jalankan sekali untuk mengisi Firestore dengan data awal.
        </p>

        {!done && (
          <button
            onClick={runSeed}
            disabled={running}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-sans font-semibold py-3 rounded-lg transition-colors"
          >
            {running ? 'Sedang proses...' : 'Jalankan Seed'}
          </button>
        )}

        {logs.length > 0 && (
          <div className="mt-6 space-y-2 font-mono text-sm bg-gray-50 dark:bg-slate-900 rounded-lg p-4 max-h-64 overflow-y-auto">
            {logs.map((log, i) => (
              <p key={i} className="text-gray-700 dark:text-slate-300">{log}</p>
            ))}
          </div>
        )}

        {done && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="font-sans font-semibold text-green-700 dark:text-green-400 mb-3">
              Seed selesai! Akun yang dibuat:
            </p>
            <div className="space-y-1 font-mono text-sm text-green-600 dark:text-green-500">
              <p>Admin: admin@kerjakamu.id / Admin123!</p>
              <p>Trainer: trainer@kerjakamu.id / Trainer123!</p>
            </div>
            <p className="text-red-500 font-sans text-sm mt-4 font-medium">
              Hapus halaman /seed setelah ini!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
