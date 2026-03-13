import { GoogleGenerativeAI } from '@google/generative-ai'
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

export const interviewQuestions = [
  'Ceritakan tentang diri kamu dan mengapa kamu tertarik dengan posisi ini.',
  'Apa kelebihan utama kamu yang paling relevan dengan pekerjaan ini?',
  'Ceritakan pengalaman kamu menggunakan tools digital seperti Excel atau Canva.',
  'Bagaimana cara kamu mengelola pekerjaan dengan beberapa deadline bersamaan?',
  'Di mana kamu melihat dirimu 3 tahun dari sekarang?',
]

export async function evaluateAnswer(question: string, answer: string, jobTitle: string = 'Social Media Specialist') {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    return {
      score: 70, // Fallback as per rules
      strengths: 'Jawaban cukup jelas.',
      improvements: 'Gunakan metode STAR untuk hasil maksimal.',
      followUp: 'Bisa jelaskan lebih lanjut?'
    }
  }

  if (!answer.trim() || answer.trim().length < 10) {
    return {
      score: 30,
      strengths: 'Jawaban terlalu singkat untuk dievaluasi.',
      improvements: 'Berikan jawaban minimal 2-3 kalimat yang menjelaskan pengalamanmu.',
      followUp: 'Bisa jelaskan lebih detail tentang hal tersebut?'
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `Kamu adalah HR profesional Indonesia yang mengevaluasi jawaban wawancara untuk posisi ${jobTitle}.

Pertanyaan: "${question}"
Jawaban kandidat: "${answer}"

Berikan evaluasi dalam format JSON berikut (hanya JSON, tanpa markdown atau teks lain):
{
  "score": <angka 0-100>,
  "strengths": "<1-2 kalimat kelebihan jawaban dalam Bahasa Indonesia>",
  "improvements": "<1-2 kalimat saran perbaikan spesifik dalam Bahasa Indonesia>",
  "followUp": "<1 pertanyaan lanjutan natural dari HR dalam Bahasa Indonesia>"
}

Kriteria: Relevansi (30%), Struktur STAR (25%), Contoh konkret (25%), Bahasa (20%).`

    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json|```/g, '').trim()
    return JSON.parse(text)
  } catch (err) {
    console.error("Gemini Error:", err)
    return {
      score: 65,
      strengths: 'Jawaban menunjukkan pemahaman dasar yang baik.',
      improvements: 'Tambahkan contoh konkret dari pengalaman nyata untuk memperkuat jawaban.',
      followUp: 'Bisa ceritakan contoh spesifik dari situasi tersebut?'
    }
  }
}

export function calculateFinalInterviewScore(evaluations: any[]) {
  if (!evaluations || evaluations.length === 0) return 0
  const sum = evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0)
  return Math.round(sum / evaluations.length)
}

export async function saveInterviewResult(uid: string, evaluations: any[]) {
  const finalScore = calculateFinalInterviewScore(evaluations)
  await updateDoc(doc(db, 'users', uid), {
    interviewScore: finalScore,
    interviewCompletedAt: serverTimestamp(),
  })
  return finalScore
}
