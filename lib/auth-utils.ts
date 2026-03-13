
import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export type UserRole = "user" | "trainer" | "admin";

export async function getUserRole(uid: string): Promise<UserRole> {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().role as UserRole;
    }
    return "user"; // Default role
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "user";
  }
}

export async function createUserProfile(uid: string, data: {
  email: string | null;
  displayName: string | null;
  role: UserRole;
  location?: string;
}) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    
    // Only create if doesn't exist (important for Google Sign In)
    if (!snap.exists()) {
      await setDoc(userRef, {
        name: data.displayName || "Pengguna",
        email: data.email,
        role: data.role,
        location: data.location || "Indonesia",
        skillScores: null,
        matchScore: null,
        recommendedJob: null,
        bootcampProgress: {},
        interviewScore: null,
        certificates: [],
        appliedJobs: [],
        trainerId: null,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
}

// Utility to set cookies for middleware (Simple implementation for demo)
export function setAuthCookies(role: UserRole) {
  document.cookie = `user-role=${role}; path=/; max-age=360000`;
  document.cookie = `is-logged-in=true; path=/; max-age=360000`;
}

export function clearAuthCookies() {
  document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "is-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}
