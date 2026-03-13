import { db } from "../firebase";
import { collection, doc, getDocs, updateDoc, deleteDoc, setDoc, query, where, addDoc } from "firebase/firestore";

export async function getAllUsers(filters?: any) {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getPendingTrainers() {
  const q = query(collection(db, "trainer_applications"), where("status", "==", "pending"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function verifyTrainer(uid: string, adminUid: string) {
  await updateDoc(doc(db, "trainer_applications", uid), {
    status: "approved",
    verifiedBy: adminUid,
    verifiedAt: new Date().toISOString()
  });
  
  await updateDoc(doc(db, "users", uid), { role: "trainer" });
  await setDoc(doc(db, "trainers", uid), { status: "verified", joinedAt: new Date().toISOString() }, { merge: true });
}

export async function rejectTrainer(uid: string, adminUid: string, reason: string) {
  await updateDoc(doc(db, "trainer_applications", uid), {
    status: "rejected",
    rejectReason: reason,
    rejectedBy: adminUid,
    rejectedAt: new Date().toISOString()
  });
}

export async function getAllApplications() {
  const snapshot = await getDocs(collection(db, "applications"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getAnalyticsSummary() {
  const analyticsDoc = await getDocs(collection(db, "analytics"));
  if (!analyticsDoc.empty) {
    return { id: analyticsDoc.docs[0].id, ...analyticsDoc.docs[0].data() };
  }
  return null;
}

export async function createJob(jobData: any) {
  await addDoc(collection(db, "jobs"), { ...jobData, createdAt: new Date().toISOString() });
}

export async function updateJob(jobId: string, data: any) {
  await updateDoc(doc(db, "jobs", jobId), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteJob(jobId: string) {
  await deleteDoc(doc(db, "jobs", jobId));
}
