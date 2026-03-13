import {
  collection, doc, getDoc, getDocs,
  query, where, serverTimestamp, addDoc, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

export async function getTrainerWithStudents(trainerUid: string) {
  const trainerSnap = await getDoc(doc(db, 'trainers', trainerUid))
  if (!trainerSnap.exists()) return null
  const trainer = { id: trainerSnap.id, ...trainerSnap.data() } as any

  // Ambil data tiap student dari collection users
  const q = query(collection(db, 'users'), where('trainerId', '==', trainerUid))
  const snap = await getDocs(q)
  
  trainer.studentsData = snap.docs.map(d => ({ userId: d.id, ...d.data() }))
  return trainer
}

export async function getTrainerStudents(trainerUid: string) {
  const q = query(collection(db, 'users'), where('trainerId', '==', trainerUid))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ userId: d.id, ...d.data() }))
}

export async function getTrainerSessions(trainerUid: string) {
  const snap = await getDocs(
    query(collection(db, 'sessions'),
      where('trainerId', '==', trainerUid),
      orderBy('scheduledAt', 'desc')
    )
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createSession(sessionData: any) {
  return await addDoc(collection(db, 'sessions'), {
    ...sessionData, createdAt: serverTimestamp()
  })
}

export async function getAllVerifiedTrainers() {
  const snap = await getDocs(
    query(collection(db, 'trainers'), where('status', '==', 'verified'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
