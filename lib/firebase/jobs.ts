import { collection, getDocs, query, where, doc, updateDoc, addDoc, serverTimestamp, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase'
import { getUserProfile } from './users'

export async function getMatchingJobs(uid: string) {
  const profile = await getUserProfile(uid)
  const scores = profile?.skillScores ?? { excel: 0, canva: 0, english: 0, digitalLiteracy: 0 }

  const snap = await getDocs(query(collection(db, 'jobs'), where('isActive', '==', true)))

  const jobs = snap.docs.map(d => {
    const job = { id: d.id, ...d.data() } as any
    const required = job.requiredSkills || {}
    let totalScore = 0, totalWeight = 0

    Object.entries(required).forEach(([skill, requiredLevel]) => {
      const reqLvl = requiredLevel as number;
      const userLevel = scores[skill] ?? 0
      const weight = reqLvl
      const skillMatch = Math.min(100, (userLevel / reqLvl) * 100)
      totalScore += skillMatch * weight
      totalWeight += weight
    })

    job.matchScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
    job.skillGaps = Object.entries(required)
      .filter(([skill, req]) => (scores[skill] ?? 0) < (req as number))
      .map(([skill, req]) => ({
        skill,
        userScore: scores[skill] ?? 0,
        required: req,
        gap: (req as number) - (scores[skill] ?? 0),
      }))

    return job
  })

  return jobs
    .filter(j => j.matchScore > 30)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6)
}

export async function applyToJob(uid: string, jobId: string, jobTitle: string, company: string) {
  await addDoc(collection(db, 'applications'), {
    userId: uid, jobId, jobTitle, company,
    status: 'sent', appliedAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'users', uid), {
    appliedJobs: arrayUnion(jobId)
  })
}
