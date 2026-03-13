import { Timestamp } from "firebase/firestore";

export type UserRole = "user" | "trainer" | "admin";

export interface UserProfile {
  id?: string;
  name: string;
  displayName?: string;
  email: string;
  role: UserRole;
  location: string;
  skillScores: Record<string, number> | null;
  matchScore: number | null;
  recommendedJob: string | null;
  status?: string;
  bootcampProgress?: Record<string, any>;
  interviewScore: number | null;
  certificates: Certificate[];
  appliedJobs: string[];
  trainerId: string | null;
  createdAt: Timestamp | string;
}

export interface Certificate {
  id: string;
  title: string;
  pdfUrl: string;
  issuedAt: Timestamp | string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  matchScore?: number;
  isActive: boolean;
  requiredSkills: Record<string, number>;
}

export interface BootcampDay {
  id: string;
  dayNumber: number;
  title: string;
  duration: string;
  content: string;
  status: "locked" | "current" | "done";
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}
