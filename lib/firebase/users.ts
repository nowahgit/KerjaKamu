import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

export async function createUserProfile(uid: string, data: any) {
  await setDoc(doc(db, "users", uid), { ...data, createdAt: new Date().toISOString() }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<any> {
  const docSnap = await getDoc(doc(db, "users", uid));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function updateSkillScores(uid: string, scores: any) {
  await updateDoc(doc(db, "users", uid), {
    skillScores: scores,
    updatedAt: new Date().toISOString()
  });
}

export async function updateBootcampProgress(uid: string, courseId: string, day: number) {
  const docRef = doc(db, "users", uid, "bootcamp", courseId);
  await setDoc(docRef, { lastCompletedDay: day, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function getUserCertificates(uid: string) {
  const certCol = collection(db, "users", uid, "certificates");
  const snap = await getDocs(certCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
