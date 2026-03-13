import { db } from '../firebase'
import { collection, doc, setDoc, addDoc } from 'firebase/firestore'

export async function seedDatabase() {
  // JOBS
  const jobs = [
    {
      title: 'Social Media Specialist',
      company: 'PT Maju Digital Indonesia',
      companyType: 'Startup',
      salary: 5500000,
      salaryEffective: 4900000,
      location: 'Batam',
      region: 'Kepulauan Riau',
      requiredSkills: { excel: 60, canva: 80, english: 70, photoshop: 50 },
      description: 'Mengelola konten media sosial perusahaan, membuat laporan performa, dan koordinasi dengan tim marketing.',
      isActive: true,
      createdAt: new Date(),
    },
    {
      title: 'Content Creator',
      company: 'CV Kreatif Nusantara',
      companyType: 'Agency',
      salary: 4800000,
      salaryEffective: 3600000,
      location: 'Jakarta',
      region: 'DKI Jakarta',
      requiredSkills: { excel: 40, canva: 90, english: 60, photoshop: 70 },
      description: 'Membuat konten kreatif untuk berbagai platform digital klien agency.',
      isActive: true,
      createdAt: new Date(),
    },
    {
      title: 'Marketing Assistant',
      company: 'Startup Aksara',
      companyType: 'Startup',
      salary: 4200000,
      salaryEffective: 3800000,
      location: 'Solo',
      region: 'Jawa Tengah',
      requiredSkills: { excel: 70, canva: 60, english: 50, photoshop: 30 },
      description: 'Membantu tim marketing dalam riset pasar, pembuatan laporan, dan koordinasi kampanye.',
      isActive: true,
      createdAt: new Date(),
    },
    {
      title: 'Data Entry Specialist',
      company: 'PT Logistik Cepat',
      companyType: 'Corporate',
      salary: 3800000,
      salaryEffective: 3400000,
      location: 'Surabaya',
      region: 'Jawa Timur',
      requiredSkills: { excel: 90, canva: 20, english: 40, photoshop: 10 },
      description: 'Input dan validasi data logistik harian, pembuatan laporan Excel, koordinasi dengan gudang.',
      isActive: true,
      createdAt: new Date(),
    },
    {
      title: 'Admin & Keuangan',
      company: 'UD Makmur Jaya',
      companyType: 'UKM',
      salary: 3500000,
      salaryEffective: 3100000,
      location: 'Semarang',
      region: 'Jawa Tengah',
      requiredSkills: { excel: 85, canva: 30, english: 30, photoshop: 10 },
      description: 'Mengelola administrasi kantor, pembukuan sederhana, dan laporan keuangan bulanan.',
      isActive: true,
      createdAt: new Date(),
    },
  ]

  for (const job of jobs) {
    await addDoc(collection(db, 'jobs'), job)
  }

  // BOOTCAMP COURSES
  const course = {
    title: 'Canva untuk Marketing Digital',
    description: 'Kuasai Canva dari dasar hingga mahir untuk kebutuhan marketing digital profesional.',
    thumbnail: '',
    totalDays: 7,
    skillTarget: 'canva',
    createdAt: new Date(),
  }
  const courseRef = await addDoc(collection(db, 'bootcamp_courses'), course)

  const days = [
    { dayNumber: 1, title: 'Mengenal Interface Canva', duration: 15, videoUrl: '', content: 'Pelajari tampilan dasar Canva dan cara navigasi tools utama.', quiz: [{ question: 'Apa fungsi tombol "Resize" di Canva?', options: ['Mengubah ukuran font', 'Mengubah ukuran desain ke format lain', 'Menghapus elemen', 'Menyimpan desain'], correctIndex: 1, explanation: 'Tombol Resize digunakan untuk mengubah ukuran kanvas ke berbagai format sekaligus.' }] },
    { dayNumber: 2, title: 'Membuat Desain Pertamamu', duration: 15, videoUrl: '', content: 'Buat postingan Instagram pertamamu menggunakan template Canva.', quiz: [{ question: 'Ukuran standar postingan Instagram feed adalah?', options: ['1920x1080px', '1080x1080px', '800x600px', '1280x720px'], correctIndex: 1, explanation: '1080x1080px adalah ukuran square standar untuk Instagram feed.' }] },
    { dayNumber: 3, title: 'Typography & Warna', duration: 15, videoUrl: '', content: 'Memilih kombinasi font dan warna yang profesional untuk brand.', quiz: [{ question: 'Berapa maksimal jenis font yang disarankan dalam satu desain?', options: ['1 font', '2-3 font', '5-6 font', 'Tidak ada batasan'], correctIndex: 1, explanation: 'Maksimal 2-3 font menjaga desain tetap bersih dan profesional.' }] },
    { dayNumber: 4, title: 'Membuat Presentasi', duration: 15, videoUrl: '', content: 'Buat slide presentasi profesional untuk keperluan kerja.', quiz: [{ question: 'Rule of thirds dalam desain presentasi berarti?', options: ['Gunakan 3 warna saja', 'Bagi slide menjadi 9 bagian untuk komposisi', 'Gunakan 3 slide per topik', 'Font harus 3 ukuran berbeda'], correctIndex: 1, explanation: 'Rule of thirds membagi kanvas menjadi 9 bagian untuk penempatan elemen yang harmonis.' }] },
    { dayNumber: 5, title: 'Desain untuk Media Sosial', duration: 15, videoUrl: '', content: 'Buat konten untuk Instagram, Facebook, dan LinkedIn secara efisien.', quiz: [{ question: 'Ukuran cover LinkedIn yang benar adalah?', options: ['820x312px', '1080x1080px', '1584x396px', '1200x628px'], correctIndex: 2, explanation: '1584x396px adalah ukuran optimal untuk banner/cover LinkedIn.' }] },
    { dayNumber: 6, title: 'Membuat Logo Sederhana', duration: 15, videoUrl: '', content: 'Desain logo profesional sederhana menggunakan elemen Canva.', quiz: [{ question: 'Format file terbaik untuk logo dengan latar transparan adalah?', options: ['JPG', 'PNG', 'PDF', 'SVG'], correctIndex: 1, explanation: 'PNG mendukung transparansi (alpha channel) sehingga ideal untuk logo.' }] },
    { dayNumber: 7, title: 'Portfolio & Sertifikasi', duration: 15, videoUrl: '', content: 'Kumpulkan semua karya menjadi portfolio digital profesional.', quiz: [{ question: 'Apa yang membuat portfolio desain terlihat profesional?', options: ['Banyaknya karya tanpa seleksi', 'Karya terpilih dengan penjelasan proses', 'Hanya menampilkan karya terbaru', 'Menggunakan semua warna cerah'], correctIndex: 1, explanation: 'Portfolio profesional menampilkan karya terpilih disertai konteks dan proses kreatif.' }] },
  ]

  for (const day of days) {
    await addDoc(collection(db, 'bootcamp_courses', courseRef.id, 'days'), day)
  }

  console.log('Seed selesai! Jobs dan bootcamp berhasil ditambahkan ke Firestore.')
}
