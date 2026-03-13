import {
  collection, getDocs, doc, updateDoc,
  query, where, serverTimestamp, getDoc
} from 'firebase/firestore'
import { db } from '../firebase'

export async function getPendingTrainers() {
  const snap = await getDocs(
    query(collection(db, 'trainer_applications'), where('status', '==', 'pending'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function verifyTrainer(trainerUid: string, adminUid: string) {
  // Update trainer_applications
  await updateDoc(doc(db, 'trainer_applications', trainerUid), {
    status: 'verified', reviewedBy: adminUid,
    reviewedAt: serverTimestamp(),
  })
  // Update users
  await updateDoc(doc(db, 'users', trainerUid), {
    status: 'verified'
  })
  // Update atau buat trainers doc
  const trainerRef = doc(db, 'trainers', trainerUid)
  const trainerSnap = await getDoc(trainerRef)
  if (trainerSnap.exists()) {
    await updateDoc(trainerRef, {
      status: 'verified', verifiedBy: adminUid,
      verifiedAt: serverTimestamp(),
    })
  }
}

export async function rejectTrainer(trainerUid: string, adminUid: string, reason: string) {
  await updateDoc(doc(db, 'trainer_applications', trainerUid), {
    status: 'rejected', reviewedBy: adminUid,
    reviewedAt: serverTimestamp(), rejectionReason: reason,
  })
  await updateDoc(doc(db, 'users', trainerUid), {
    status: 'rejected'
  })
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getAnalyticsSummary() {
  const [usersSnap, jobsSnap, appsSnap, trainersSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(query(collection(db, 'jobs'), where('isActive', '==', true))),
    getDocs(collection(db, 'applications')),
    getDocs(query(collection(db, 'trainers'), where('status', '==', 'verified'))),
  ])
  const users = usersSnap.docs.map(d => d.data() as any)
  const withScore = users.filter(u => u.matchScore)
  return {
    totalUsers: users.filter(u => u.role === 'user').length,
    totalTrainers: trainersSnap.size,
    totalJobs: jobsSnap.size,
    totalApplications: appsSnap.size,
    avgMatchScore: withScore.length
      ? Math.round(withScore.reduce((s, u) => s + u.matchScore, 0) / withScore.length)
      : 0,
  }
}
