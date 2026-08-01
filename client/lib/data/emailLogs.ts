export type EmailStatus = "Sent" | "Opened" | "Bounced";
export type AccountStatus = "Verified" | "Not Verified";

export interface EmailLog {
  id: string;
  name: string;
  email: string;
  emailSentDate: string;
  emailStatus: EmailStatus;
  accountStatus: AccountStatus;
  initials: string;
  avatarColor: string;
}

export const EMAIL_LOGS: EmailLog[] = [
  { id: "1",  name: "Aisha Khan",     email: "aisha.khan@mit.edu",        emailSentDate: "Jun 3, 2026, 9:14 AM", emailStatus: "Opened",  accountStatus: "Verified",     initials: "AK", avatarColor: "#1e3a5f" },
  { id: "2",  name: "Ryo Tanaka",     email: "ryo.tanaka@stanford.edu",   emailSentDate: "Jun 4, 2026, 9:14 AM", emailStatus: "Sent",    accountStatus: "Verified",     initials: "RT", avatarColor: "#2563eb" },
  { id: "3",  name: "Sofia Mendez",   email: "sofia.mendez@berkeley.edu", emailSentDate: "Jun 4, 2026, 9:15 AM", emailStatus: "Opened",  accountStatus: "Verified",     initials: "SM", avatarColor: "#166534" },
  { id: "4",  name: "Liam O'Brien",   email: "liam.obrien@imperial.ac.uk",emailSentDate: "Jun 5, 2026, 9:14 AM", emailStatus: "Bounced", accountStatus: "Not Verified", initials: "LO", avatarColor: "#7c3aed" },
  { id: "5",  name: "Priya Sharma",   email: "priya.sharma@iitb.ac.in",   emailSentDate: "Jun 5, 2026, 9:15 AM", emailStatus: "Opened",  accountStatus: "Verified",     initials: "PS", avatarColor: "#c2410c" },
  { id: "6",  name: "Noah Becker",    email: "nbecker@gmail.com",         emailSentDate: "Jun 5, 2026, 10:02 AM",emailStatus: "Sent",    accountStatus: "Not Verified", initials: "NB", avatarColor: "#8b5cf6" },
  { id: "7",  name: "Olivia Adeyemi", email: "oadeyemi@mit.edu",          emailSentDate: "Jun 6, 2026, 8:41 AM", emailStatus: "Opened",  accountStatus: "Verified",     initials: "OA", avatarColor: "#ec4899" },
  { id: "8",  name: "Tariq Hassan",   email: "thassan@umich.edu",         emailSentDate: "Jun 6, 2026, 9:30 AM", emailStatus: "Bounced", accountStatus: "Not Verified", initials: "TH", avatarColor: "#f97316" },
  { id: "9",  name: "Uma Krishnan",   email: "ukrishnan@ucla.edu",        emailSentDate: "Jun 6, 2026, 11:12 AM",emailStatus: "Sent",    accountStatus: "Verified",     initials: "UK", avatarColor: "#14b8a6" },
  { id: "10", name: "Victor Costa",   email: "vcosta@gmail.com",          emailSentDate: "Jun 7, 2026, 8:05 AM", emailStatus: "Opened",  accountStatus: "Verified",     initials: "VC", avatarColor: "#a855f7" },
  { id: "11", name: "Willow Chen",    email: "wchen@utoronto.ca",         emailSentDate: "Jun 7, 2026, 9:47 AM", emailStatus: "Sent",    accountStatus: "Not Verified", initials: "WC", avatarColor: "#ef4444" },
  { id: "12", name: "Xander Brooks",  email: "xbrooks@hotmail.com",       emailSentDate: "Jun 7, 2026, 1:20 PM", emailStatus: "Opened",  accountStatus: "Verified",     initials: "XB", avatarColor: "#eab308" },
];
