import { db } from "../firebase";
import { collection, doc, getDoc, getDocs, setDoc, query, where, updateDoc, addDoc } from "firebase/firestore";

export async function getAllVerifiedTrainers() {
  const q = query(collection(db, "trainers"), where("status", "==", "verified"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getTrainerById(uid: string) {
  const docSnap = await getDoc(doc(db, "trainers", uid));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getTrainerStudents(trainerUid: string): Promise<any[]> {
  const q = query(collection(db, "sessions"), where("trainerId", "==", trainerUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function submitTrainerApplication(uid: string, data: any, skckFileMetadata?: any) {
  await setDoc(doc(db, "trainer_applications", uid), {
    ...data,
    skckData: skckFileMetadata,
    status: "pending",
    submittedAt: new Date().toISOString()
  });
}

export async function getTrainerSessions(trainerUid: string) {
  const q = query(collection(db, "sessions"), where("trainerId", "==", trainerUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createSession(sessionData: any) {
  await addDoc(collection(db, "sessions"), {
    ...sessionData,
    status: "pending",
    createdAt: new Date().toISOString()
  });
}

export async function updateSessionStatus(sessionId: string, status: string) {
  await updateDoc(doc(db, "sessions", sessionId), { status, updatedAt: new Date().toISOString() });
}
