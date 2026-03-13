import {
  collection, doc, getDoc, getDocs, setDoc,
  updateDoc, arrayUnion, serverTimestamp, orderBy, query
} from 'firebase/firestore'
import { db } from '../firebase'

export async function getAllCourses() {
  const snap = await getDocs(collection(db, 'bootcamp_courses'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getCourseWithDays(courseId: string) {
  const courseSnap = await getDoc(doc(db, 'bootcamp_courses', courseId))
  if (!courseSnap.exists()) throw new Error('Course tidak ditemukan')

  const daysSnap = await getDocs(
    query(collection(db, 'bootcamp_courses', courseId, 'days'), orderBy('dayNumber'))
  )
  const days = daysSnap.docs.map(d => ({ id: d.id, ...d.data() }))

  return { id: courseSnap.id, ...courseSnap.data(), days }
}

export async function getUserBootcampProgress(uid: string, courseId: string) {
  try {
    const ref = doc(db, 'bootcamp_progress', uid, 'courses', courseId)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        completedDays: [], currentDay: 1,
        startedAt: serverTimestamp()
      })
      return { completedDays: [], currentDay: 1 }
    }
    return snap.data()
  } catch (e: any) {
    if (e.code === 'permission-denied') return { completedDays: [], currentDay: 1 }
    throw e
  }
}

export async function markDayComplete(uid: string, courseId: string, dayNumber: number, totalDays: number) {
  const ref = doc(db, 'bootcamp_progress', uid, 'courses', courseId)
  const nextDay = dayNumber + 1
  await updateDoc(ref, {
    completedDays: arrayUnion(dayNumber),
    currentDay: nextDay <= totalDays ? nextDay : dayNumber,
    lastUpdated: serverTimestamp(),
  })
  return nextDay > totalDays // returns true jika semua hari selesai
}
