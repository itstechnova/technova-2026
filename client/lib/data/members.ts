export type MemberRole = "Hacker" | "Mentor" | "Volunteer";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  shirtSize: string;
  dietaryRestrictions: string;
  initials: string;
  avatarColor: string;
}

export const MEMBERS: Member[] = [
  { id: "1",  name: "Aisha Khan",       email: "aisha.khan@mit.edu",         role: "Hacker",     shirtSize: "S",  dietaryRestrictions: "Halal",                 initials: "AK", avatarColor: "#1e3a5f" },
  { id: "2",  name: "Arjun Patel",      email: "arjun.patel@iitd.ac.in",     role: "Hacker",     shirtSize: "L",  dietaryRestrictions: "Vegetarian, No eggs",   initials: "AP", avatarColor: "#166534" },
  { id: "3",  name: "Chloe Martin",     email: "c.martin@polytechnique.fr",  role: "Mentor",      shirtSize: "XS", dietaryRestrictions: "Vegan",                 initials: "CM", avatarColor: "#7c3aed" },
  { id: "4",  name: "James Whitfield",  email: "j.whitfield@cmu.edu",        role: "Hacker",     shirtSize: "XL", dietaryRestrictions: "None",                  initials: "JW", avatarColor: "#0f766e" },
  { id: "5",  name: "Lena Fischer",     email: "l.fischer@tum.de",           role: "Volunteer",   shirtSize: "M",  dietaryRestrictions: "Lactose intolerant",    initials: "LF", avatarColor: "#be185d" },
  { id: "6",  name: "Nadia Osei",       email: "n.osei@waterloo.ca",         role: "Volunteer",   shirtSize: "S",  dietaryRestrictions: "None",                  initials: "NO", avatarColor: "#c2410c" },
  { id: "7",  name: "Ravi Patel",       email: "rpatel@gatech.edu",          role: "Hacker",     shirtSize: "M",  dietaryRestrictions: "None",                  initials: "RP", avatarColor: "#3b82f6" },
  { id: "8",  name: "Sophie Laurent",   email: "slaurent@mcgill.ca",         role: "Hacker",     shirtSize: "S",  dietaryRestrictions: "Gluten-free",           initials: "SL", avatarColor: "#06b6d4" },
  { id: "9",  name: "Marcus Webb",      email: "m.webb@databricks.com",      role: "Mentor",      shirtSize: "L",  dietaryRestrictions: "None",                  initials: "MW", avatarColor: "#4338ca" },
  { id: "10", name: "Priya Iyer",       email: "priya.iyer@notion.so",       role: "Mentor",      shirtSize: "M",  dietaryRestrictions: "Vegetarian",            initials: "PI", avatarColor: "#9333ea" },
  { id: "11", name: "Diego Alvarez",    email: "d.alvarez@sfsu.edu",         role: "Volunteer",   shirtSize: "L",  dietaryRestrictions: "None",                  initials: "DA", avatarColor: "#b45309" },
  { id: "12", name: "Xander Brooks",    email: "xbrooks@hotmail.com",        role: "Hacker",     shirtSize: "XL", dietaryRestrictions: "Nut allergy",           initials: "XB", avatarColor: "#eab308" },
];
