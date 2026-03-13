import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export async function getSkillTestQuestions() {
  const snap = await getDoc(doc(db, 'skill_test_questions', 'v1'))
  if (!snap.exists()) throw new Error('Soal belum tersedia')
  const data = snap.data()

  // Ambil 5 soal random per kategori
  const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5).slice(0, 5)

  return {
    excel: shuffle(data.excel),
    canva: shuffle(data.canva),
    english: shuffle(data.english),
    digitalLiteracy: shuffle(data.digitalLiteracy),
  }
}

export function calculateSkillScores(answers: any, correctAnswers: any) {
  const scores: Record<string, number> = {}
  Object.entries(answers).forEach(([skill, userAnswers]) => {
    const arr = userAnswers as number[]
    const correctArr = correctAnswers[skill]
    if (arr && correctArr && Array.isArray(arr) && Array.isArray(correctArr)) {
       const correct = arr.filter((ans, i) => ans === (correctArr[i] as any).correctIndex).length
       scores[skill] = Math.round((correct / arr.length) * 100)
    } else {
       scores[skill] = 0;
    }
  })
  return scores
}
