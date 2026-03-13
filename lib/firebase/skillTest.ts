import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export async function getSkillTestQuestions() {
  const snap = await getDoc(doc(db, 'skill_test_questions', 'v1'))
  if (!snap.exists()) throw new Error('Soal belum tersedia di database')
  const data = snap.data()
  const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5).slice(0, 5)
  return {
    excel: shuffle(data.excel),
    canva: shuffle(data.canva),
    english: shuffle(data.english),
    digitalLiteracy: shuffle(data.digitalLiteracy),
  }
}

export async function saveSkillTestResult(uid: string, scores: Record<string, number>) {
  const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
  const { db } = await import('../firebase')

  const matchScore = Math.round(
    (scores.excel * 0.3) + (scores.canva * 0.3) +
    (scores.english * 0.2) + (scores.digitalLiteracy * 0.2)
  )

  const recommendedJob =
    scores.canva >= 70 ? 'Social Media Specialist' :
    scores.excel >= 70 ? 'Data Entry & Admin' :
    scores.english >= 70 ? 'Marketing Assistant' : 'Admin & Keuangan'

  await updateDoc(doc(db, 'users', uid), {
    skillScores: scores,
    matchScore,
    recommendedJob,
    testCompletedAt: serverTimestamp(),
  })

  return { matchScore, recommendedJob }
}
