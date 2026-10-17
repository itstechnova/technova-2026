export type AcceptanceStatus = "Pending" | "Accepted" | "Rejected" | "Waitlisted";

export interface HackerApplication {
  id: string;
  name: string;
  email: string;
  applicationDate: string;
  acceptanceStatus: AcceptanceStatus;
  initials: string;
  avatarColor: string;
  score: number;
  school: string;
  gradYear: string;
  major: string;
  location: string;
  resumeFileName: string;
  essayWhyAttend: string;
  essayProudProject: string;
  essayHopeToLearn: string;
}

export const HACKER_APPLICATIONS: HackerApplication[] = [
  {
    id: "1", name: "Maya Torres", email: "mtorres@stanford.edu", applicationDate: "Jan 14, 2026", acceptanceStatus: "Accepted", initials: "MT", avatarColor: "#6366f1", score: 2,
    school: "Stanford University", gradYear: "2027", major: "Computer Science", location: "Palo Alto, CA", resumeFileName: "maya_torres_resume.pdf",
    essayWhyAttend: "I want to work on something end-to-end with a real deadline instead of another isolated assignment.",
    essayProudProject: "Built a small compiler for a toy language as part of a systems course project group.",
    essayHopeToLearn: "How to scope a project for 36 hours and still ship something people can use.",
  },
  {
    id: "2", name: "Noah Becker", email: "nbecker@gmail.com", applicationDate: "Jan 16, 2026", acceptanceStatus: "Pending", initials: "NB", avatarColor: "#8b5cf6", score: 8,
    school: "University of Waterloo", gradYear: "2026", major: "Software Engineering", location: "Waterloo, ON", resumeFileName: "noah_becker_resume.pdf",
    essayWhyAttend: "Technova's mentor list is the strongest I've seen at a student event this year.",
    essayProudProject: "Shipped a Chrome extension with a few thousand active users that scrapes and summarizes lecture slides.",
    essayHopeToLearn: "How to pitch a technical project to a non-technical audience.",
  },
  {
    id: "3", name: "Olivia Adeyemi", email: "oadeyemi@mit.edu", applicationDate: "Jan 17, 2026", acceptanceStatus: "Accepted", initials: "OA", avatarColor: "#ec4899", score: 7,
    school: "MIT", gradYear: "2028", major: "Electrical Engineering & Computer Science", location: "Cambridge, MA", resumeFileName: "olivia_adeyemi_resume.pdf",
    essayWhyAttend: "I've mostly worked solo on hardware projects and want the pressure of a real team.",
    essayProudProject: "Designed a low-power sensor board for a campus air-quality monitoring project.",
    essayHopeToLearn: "Firmware-to-cloud integration and fast prototyping under time pressure.",
  },
  {
    id: "4", name: "Priya Nair", email: "pnair@uwaterloo.ca", applicationDate: "Jan 19, 2026", acceptanceStatus: "Waitlisted", initials: "PN", avatarColor: "#f59e0b", score: 4,
    school: "University of Waterloo", gradYear: "2027", major: "Mathematics", location: "Waterloo, ON", resumeFileName: "priya_nair_resume.pdf",
    essayWhyAttend: "I want to see what my math background is actually useful for outside a classroom.",
    essayProudProject: "Wrote a small library implementing common numerical optimization methods from scratch.",
    essayHopeToLearn: "How to translate theory into something that runs and is useful in a weekend.",
  },
  {
    id: "5", name: "Quinn Walsh", email: "qwalsh@outlook.com", applicationDate: "Jan 20, 2026", acceptanceStatus: "Rejected", initials: "QW", avatarColor: "#10b981", score: 1,
    school: "University of Toronto", gradYear: "2026", major: "Computer Science", location: "Toronto, ON", resumeFileName: "quinn_walsh_resume.pdf",
    essayWhyAttend: "Friends went last year and said the workshops alone were worth the trip.",
    essayProudProject: "Group project building a class scheduling tool for a student club.",
    essayHopeToLearn: "Basics of working with a design system instead of writing CSS from scratch.",
  },
  {
    id: "6", name: "Ravi Patel", email: "rpatel@gatech.edu", applicationDate: "Jan 21, 2026", acceptanceStatus: "Accepted", initials: "RP", avatarColor: "#3b82f6", score: 9,
    school: "Georgia Institute of Technology", gradYear: "2026", major: "Computer Science", location: "Atlanta, GA", resumeFileName: "ravi_patel_resume.pdf",
    essayWhyAttend: "I want to build something with real users in mind, not just another class demo.",
    essayProudProject: "Led a 4-person team building a real-time collaborative whiteboard, now used by two campus clubs.",
    essayHopeToLearn: "How to make fast, defensible technical decisions when the clock is running.",
  },
  {
    id: "7", name: "Sophie Laurent", email: "slaurent@mcgill.ca", applicationDate: "Jan 22, 2026", acceptanceStatus: "Pending", initials: "SL", avatarColor: "#06b6d4", score: 3,
    school: "McGill University", gradYear: "2028", major: "Cognitive Science", location: "Montreal, QC", resumeFileName: "sophie_laurent_resume.pdf",
    essayWhyAttend: "I'm curious how hackathon teams actually make product decisions in real time.",
    essayProudProject: "Ran a small user study on a course project and rewrote the onboarding flow based on the results.",
    essayHopeToLearn: "Enough front-end skill to prototype my own ideas instead of relying on teammates.",
  },
  {
    id: "8", name: "Tariq Hassan", email: "thassan@umich.edu", applicationDate: "Jan 23, 2026", acceptanceStatus: "Accepted", initials: "TH", avatarColor: "#f97316", score: 5,
    school: "University of Michigan", gradYear: "2027", major: "Computer Science", location: "Ann Arbor, MI", resumeFileName: "tariq_hassan_resume.pdf",
    essayWhyAttend: "I want to test whether an idea I've been sketching for months actually holds up when built.",
    essayProudProject: "Built a small ML model to flag mislabeled data in a research lab's dataset, now used by the lab.",
    essayHopeToLearn: "How to move from a notebook prototype to something deployable in a day.",
  },
  {
    id: "9", name: "Uma Krishnan", email: "ukrishnan@ucla.edu", applicationDate: "Jan 24, 2026", acceptanceStatus: "Waitlisted", initials: "UK", avatarColor: "#14b8a6", score: 1,
    school: "UCLA", gradYear: "2026", major: "Statistics", location: "Los Angeles, CA", resumeFileName: "uma_krishnan_resume.pdf",
    essayWhyAttend: "I want exposure to a full product build, not just the analysis piece I usually do.",
    essayProudProject: "Built a dashboard for a nonprofit tracking volunteer hours across chapters.",
    essayHopeToLearn: "Basic backend skills so I can own more of a project end-to-end.",
  },
  {
    id: "10", name: "Victor Costa", email: "vcosta@gmail.com", applicationDate: "Jan 25, 2026", acceptanceStatus: "Pending", initials: "VC", avatarColor: "#a855f7", score: 8,
    school: "University of British Columbia", gradYear: "2027", major: "Computer Science", location: "Vancouver, BC", resumeFileName: "victor_costa_resume.pdf",
    essayWhyAttend: "I want to work with people outside my usual project group and see how they approach problems.",
    essayProudProject: "Built a mobile app that matches students for study groups by course and schedule.",
    essayHopeToLearn: "How to structure a codebase so a team of strangers can contribute to it quickly.",
  },
  {
    id: "11", name: "Willow Chen", email: "wchen@utoronto.ca", applicationDate: "Jan 26, 2026", acceptanceStatus: "Rejected", initials: "WC", avatarColor: "#ef4444", score: 4,
    school: "University of Toronto", gradYear: "2028", major: "Computer Engineering", location: "Toronto, ON", resumeFileName: "willow_chen_resume.pdf",
    essayWhyAttend: "I've only built hardware projects for class credit and want to try one that's actually my idea.",
    essayProudProject: "Built a gesture-controlled robot arm for a first-year design course, top 3 in the class.",
    essayHopeToLearn: "How to pair hardware with a usable software interface under time pressure.",
  },
  {
    id: "12", name: "Xander Brooks", email: "xbrooks@hotmail.com", applicationDate: "Jan 27, 2026", acceptanceStatus: "Accepted", initials: "XB", avatarColor: "#eab308", score: 9,
    school: "University of Waterloo", gradYear: "2026", major: "Computer Science", location: "Waterloo, ON", resumeFileName: "xander_brooks_resume.pdf",
    essayWhyAttend: "I want the constraint of a hard deadline to force me to finish something instead of shelving it.",
    essayProudProject: "Co-founded a small campus startup building a textbook exchange marketplace, now with 500+ users.",
    essayHopeToLearn: "How to validate an idea quickly before sinking weeks into building it.",
  },
];
