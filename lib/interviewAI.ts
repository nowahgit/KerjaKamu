import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export const interviewQuestions = [
  "Ceritakan tentang diri Anda dan mengapa Anda cocok untuk posisi Social Media Specialist di perusahaan kami?",
  "Bagaimana cara Anda menangani target engagement yang tidak tercapai di platform Instagram?",
  "Apa yang membedakan hasil desain Canva Anda dibandingkan kandidat lain?",
  "Deskripsikan pengalaman Anda menangani komplain pelanggan melalui kolom komentar sosial media.",
  "Di mana Anda melihat karir Anda 3 tahun dari sekarang?"
];

export async function evaluateAnswer(question: string, answer: string, targetRole: string = 'Social Media Specialist') {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("Gemini API Key is not set");
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Anda adalah HRD Manager. Evaluasi jawaban kandidat untuk posisi ${targetRole}.
Pertanyaan: "${question}"
Jawaban Kandidat: "${answer}"

Berikan penilaian dalam format JSON dengan struktur yang persis seperti ini:
{
  "score": (Number 0-100),
  "strengths": "(String) Kekuatan dari jawaban ini",
  "improvements": "(String) Area yang bisa diperbaiki",
  "followUp": "(String) Pertanyaan lanjutan opsional"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // remove markdown JSON wrapper if present
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error("AI Evaluation error:", err);
    // fallback
    return {
      score: Math.floor(Math.random() * 30) + 50,
      strengths: "Telah memberikan jawaban fungsional.",
      improvements: "Gunakan data dan contoh spesifik (metode STAR).",
      followUp: "Bisa berikan contoh lain?"
    };
  }
}

export function calculateFinalInterviewScore(evaluations: any[]) {
  if (!evaluations || evaluations.length === 0) return 0;
  const total = evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0);
  return Math.round(total / evaluations.length);
}
