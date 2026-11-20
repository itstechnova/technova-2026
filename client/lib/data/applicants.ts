export type AcceptanceStatus = "Pending" | "Accepted" | "Rejected" | "Waitlisted";

export interface Applicant {
  id: string;
  name: string;
  email: string;
  applicationDate: string;
  acceptanceStatus: AcceptanceStatus;
  initials: string;
  avatarColor: string;
}

export const APPLICANTS: Applicant[] = [
  { id: "1",  name: "Alice Chen",    email: "alice@technova.io",    applicationDate: "Jan 15, 2026", acceptanceStatus: "Accepted",   initials: "AC", avatarColor: "#6366f1" },
  { id: "2",  name: "Bryan Kim",     email: "bkim@gmail.com",       applicationDate: "Jan 17, 2026", acceptanceStatus: "Pending",    initials: "BK", avatarColor: "#8b5cf6" },
  { id: "3",  name: "Carlos Rivera", email: "crivera@edu.ca",       applicationDate: "Jan 18, 2026", acceptanceStatus: "Rejected",   initials: "CR", avatarColor: "#ec4899" },
  { id: "4",  name: "Diana Park",    email: "dpark@outlook.com",    applicationDate: "Jan 19, 2026", acceptanceStatus: "Waitlisted", initials: "DP", avatarColor: "#f59e0b" },
  { id: "5",  name: "Ethan Nguyen",  email: "ethan.n@icloud.com",   applicationDate: "Jan 20, 2026", acceptanceStatus: "Accepted",   initials: "EN", avatarColor: "#10b981" },
  { id: "6",  name: "Fatima Hassan", email: "fhassan@uw.edu",       applicationDate: "Jan 21, 2026", acceptanceStatus: "Pending",    initials: "FH", avatarColor: "#3b82f6" },
  { id: "7",  name: "Grace Liu",     email: "graceliu@hotmail.com", applicationDate: "Jan 22, 2026", acceptanceStatus: "Accepted",   initials: "GL", avatarColor: "#06b6d4" },
  { id: "8",  name: "Henry Osei",    email: "hosei@gmail.com",      applicationDate: "Jan 23, 2026", acceptanceStatus: "Waitlisted", initials: "HO", avatarColor: "#f97316" },
  { id: "9",  name: "Ivy Sharma",    email: "isharma@yorku.ca",     applicationDate: "Jan 24, 2026", acceptanceStatus: "Accepted",   initials: "IS", avatarColor: "#14b8a6" },
  { id: "10", name: "James Okafor",  email: "jokafor@gmail.com",    applicationDate: "Jan 25, 2026", acceptanceStatus: "Pending",    initials: "JO", avatarColor: "#a855f7" },
  { id: "11", name: "Kira Tanaka",   email: "ktanaka@proton.me",    applicationDate: "Jan 26, 2026", acceptanceStatus: "Rejected",   initials: "KT", avatarColor: "#ef4444" },
  { id: "12", name: "Leo Martínez",  email: "lmartinez@ubc.ca",     applicationDate: "Jan 27, 2026", acceptanceStatus: "Waitlisted", initials: "LM", avatarColor: "#eab308" },
];
