import jsPDF from 'jspdf'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'

export async function generateCertificate(uid: string, userName: string, courseName: string) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const W = 297, H = 210

  // Background
  pdf.setFillColor(248, 250, 255)
  pdf.rect(0, 0, W, H, 'F')

  // Border luar
  pdf.setDrawColor(26, 86, 219)
  pdf.setLineWidth(3)
  pdf.rect(10, 10, W - 20, H - 20)
  pdf.setLineWidth(0.5)
  pdf.rect(14, 14, W - 28, H - 28)

  // Header
  pdf.setFontSize(10)
  pdf.setTextColor(107, 114, 128)
  pdf.setFont('helvetica', 'normal')
  pdf.text('KERJAKAMU · PLATFORM KARIER DIGITAL INDONESIA', W / 2, 28, { align: 'center' })

  pdf.setFontSize(26)
  pdf.setTextColor(26, 86, 219)
  pdf.setFont('helvetica', 'bold')
  pdf.text('SERTIFIKAT PENYELESAIAN', W / 2, 48, { align: 'center' })

  pdf.setFontSize(11)
  pdf.setTextColor(107, 114, 128)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Dengan bangga diberikan kepada:', W / 2, 65, { align: 'center' })

  // Nama
  pdf.setFontSize(30)
  pdf.setTextColor(17, 24, 39)
  pdf.setFont('helvetica', 'bold')
  pdf.text(userName, W / 2, 85, { align: 'center' })

  pdf.setDrawColor(26, 86, 219)
  pdf.setLineWidth(1)
  pdf.line(W / 2 - 70, 91, W / 2 + 70, 91)

  // Course
  pdf.setFontSize(12)
  pdf.setTextColor(55, 65, 81)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Telah berhasil menyelesaikan:', W / 2, 106, { align: 'center' })

  pdf.setFontSize(17)
  pdf.setTextColor(26, 86, 219)
  pdf.setFont('helvetica', 'bold')
  pdf.text(courseName, W / 2, 120, { align: 'center' })

  // Detail
  pdf.setFontSize(10)
  pdf.setTextColor(107, 114, 128)
  pdf.setFont('helvetica', 'normal')
  const date = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  pdf.text(`Diselesaikan pada ${date}`, W / 2, 137, { align: 'center' })
  pdf.text('Durasi: 7 hari  ·  15 menit per hari  ·  Level: Pemula', W / 2, 145, { align: 'center' })

  // Garis tanda tangan
  pdf.setDrawColor(200, 200, 200)
  pdf.setLineWidth(0.5)
  pdf.line(W / 2 - 40, 168, W / 2 + 40, 168)
  pdf.setFontSize(9)
  pdf.setTextColor(107, 114, 128)
  pdf.text('Tim KerjaKamu', W / 2, 174, { align: 'center' })
  pdf.text('Platform Karier Digital Indonesia', W / 2, 180, { align: 'center' })

  // Cert ID
  const certId = `KK-${Date.now()}-${uid.slice(0, 6).toUpperCase()}`
  pdf.setFontSize(8)
  pdf.setTextColor(156, 163, 175)
  pdf.text(`ID Sertifikat: ${certId}`, W / 2, 195, { align: 'center' })

  // Upload ke Storage
  const pdfBlob = pdf.output('blob')
  const storageRef = ref(storage, `certificates/${uid}/${certId}.pdf`)
  await uploadBytes(storageRef, pdfBlob)
  const pdfUrl = await getDownloadURL(storageRef)

  // Simpan ke Firestore
  const certData = {
    id: certId,
    title: `${courseName} — Silver`,
    skillTarget: 'canva',
    issuedAt: new Date().toISOString(),
    pdfUrl,
  }
  await updateDoc(doc(db, 'users', uid), {
    certificates: arrayUnion(certData)
  })

  // Auto download
  pdf.save(`Sertifikat_${userName.replace(/\s/g, '_')}_KerjaKamu.pdf`)
  return certData
}
