import { db } from "../firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export async function getAllCourses() {
  const snapshot = await getDocs(collection(db, "bootcamp_courses"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getCourseById(id: string) {
  const docSnap = await getDoc(doc(db, "bootcamp_courses", id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getDayContent(courseId: string, dayNumber: number) {
  const docSnap = await getDoc(doc(db, "bootcamp_courses", courseId, "days", dayNumber.toString()));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function markDayComplete(uid: string, courseId: string, dayNumber: number) {
  const ref = doc(db, 'bootcamp_progress', uid, 'courses', courseId);
  await setDoc(ref, {
    completedDays: arrayUnion(dayNumber),
    currentDay: dayNumber + 1,
    lastUpdated: new Date()
  }, { merge: true });
}

export async function getUserBootcampProgress(uid: string, courseId: string) {
  const ref = doc(db, 'bootcamp_progress', uid, 'courses', courseId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // Empty progress if none exists
    return { completedDays: [], currentDay: 1 };
  }
  return snap.data();
}
