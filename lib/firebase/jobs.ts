import { db } from "../firebase";
import { collection, doc, getDoc, getDocs, query, where, addDoc } from "firebase/firestore";
import { getUserProfile } from "./users";

export async function getAllJobs() {
  const snapshot = await getDocs(collection(db, "jobs"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getJobById(id: string) {
  const docSnap = await getDoc(doc(db, "jobs", id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getMatchingJobs(uid: string) {
  const profile = await getUserProfile(uid);
  const scores = profile?.skillScores ?? { excel: 0, canva: 0, english: 0, photoshop: 0 };

  const q = query(collection(db, "jobs"), where("isActive", "==", true));
  const snapshot = await getDocs(q);

  const jobs = snapshot.docs.map(doc => {
    const job = { id: doc.id, ...doc.data() } as any;

    const required = job.requiredSkills || {};
    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(required).forEach(([skill, requiredLevel]) => {
      const req = requiredLevel as number;
      const userLevel = (scores as any)[skill] ?? 0;
      const weight = req; // bobot = tingkat kebutuhan
      const skillMatch = req > 0 ? Math.min(100, (userLevel / req) * 100) : 100;
      totalScore += skillMatch * weight;
      totalWeight += weight;
    });

    job.matchScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

    // Identifikasi skill gap spesifik
    job.skillGaps = Object.entries(required)
      .filter(([skill, req]) => ((scores as any)[skill] ?? 0) < (req as number))
      .map(([skill, req]) => ({
        skill,
        userScore: (scores as any)[skill] ?? 0,
        required: req,
        gap: (req as number) - ((scores as any)[skill] ?? 0)
      }));

    return job;
  });

  return jobs
    .filter(j => j.matchScore > 30) // filter job yang terlalu jauh
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);
}

export async function applyToJob(uid: string, jobId: string, cvUrl: string, certUrls: string[]) {
  await addDoc(collection(db, "applications"), {
    userId: uid,
    jobId,
    cvUrl,
    certUrls,
    status: "pending",
    appliedAt: new Date().toISOString()
  });
}

export async function getUserApplications(uid: string) {
  const q = query(collection(db, "applications"), where("userId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
