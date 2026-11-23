// The TechNova 6 organizing team, in the order the landing page's crew strip shows them (Figma
// "Team / continuous crew strip"): leads first, then one person from each department in turn.
// Names, roles and artwork are the marketing team's "Meet the Team" characters (Design System file,
// Social Media page). Each character is public/images/crew/<slug>.webp; `width` and `height` are
// that file's pixel size.

export const DEPARTMENTS = [
  "Leadership",
  "Design",
  "Engineering",
  "Sponsorship",
  "Finance",
  "Marketing",
  "Logistics",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export type CrewMember = {
  slug: string;
  name: string;
  role: string;
  department: Department;
  width: number;
  height: number;
};

export const CREW: CrewMember[] = [
  { slug: "mairah-leadership", name: "Mairah", role: "Co-Director", department: "Leadership", width: 174, height: 395 },
  { slug: "carissa-design", name: "Carissa", role: "Design Lead", department: "Design", width: 178, height: 387 },
  { slug: "angela-engineering", name: "Angela", role: "Engineering Lead", department: "Engineering", width: 191, height: 395 },
  { slug: "zoe-sponsorship", name: "Zoe", role: "Sponsorship Lead", department: "Sponsorship", width: 231, height: 394 },
  { slug: "sharon-finance", name: "Sharon", role: "Finance Lead", department: "Finance", width: 195, height: 395 },
  { slug: "cindy-marketing", name: "Cindy", role: "Marketing Lead", department: "Marketing", width: 193, height: 396 },
  { slug: "madison-logistics", name: "Madison", role: "Logistics Lead", department: "Logistics", width: 188, height: 395 },
  { slug: "lindsay-leadership", name: "Lindsay", role: "Co-Director", department: "Leadership", width: 198, height: 394 },
  { slug: "fei-engineering", name: "Fei", role: "Hardware Lead", department: "Engineering", width: 165, height: 393 },
  { slug: "eva-sponsorship", name: "Eva", role: "Sponsorship Coordinator", department: "Sponsorship", width: 241, height: 355 },
  { slug: "laeticia-finance", name: "Laeticia", role: "Finance Coordinator", department: "Finance", width: 200, height: 395 },
  { slug: "aylin-marketing", name: "Aylin", role: "Marketing Coordinator", department: "Marketing", width: 174, height: 395 },
  { slug: "arya-logistics", name: "Arya", role: "Logistics Lead", department: "Logistics", width: 224, height: 395 },
  { slug: "nur-design", name: "Nur", role: "Design Coordinator", department: "Design", width: 160, height: 395 },
  { slug: "alice-engineering", name: "Alice", role: "Engineering Coordinator", department: "Engineering", width: 191, height: 395 },
  { slug: "likhitha-sponsorship", name: "Likhitha", role: "Sponsorship Lead", department: "Sponsorship", width: 239, height: 332 },
  { slug: "nicole-finance", name: "Nicole", role: "Finance Coordinator", department: "Finance", width: 203, height: 395 },
  { slug: "dayaniya-marketing", name: "Dayaniya", role: "Marketing Coordinator", department: "Marketing", width: 203, height: 396 },
  { slug: "pritika-logistics", name: "Pritika", role: "Internal Operations Lead", department: "Logistics", width: 172, height: 394 },
  { slug: "kaley-design", name: "Kaley", role: "Design Coordinator", department: "Design", width: 191, height: 396 },
  { slug: "julie-engineering", name: "Julie", role: "Engineering Coordinator", department: "Engineering", width: 190, height: 395 },
  { slug: "sophie-sponsorship", name: "Sophie", role: "Sponsorship Coordinator", department: "Sponsorship", width: 167, height: 394 },
  { slug: "elaine-finance", name: "Elaine", role: "Finance Coordinator", department: "Finance", width: 183, height: 394 },
  { slug: "kiana-marketing", name: "Kiana", role: "Marketing Coordinator", department: "Marketing", width: 178, height: 396 },
  { slug: "catherine-logistics", name: "Catherine", role: "Logistics Coordinator", department: "Logistics", width: 188, height: 394 },
  { slug: "angela-design", name: "Angela", role: "Design Coordinator", department: "Design", width: 193, height: 395 },
  { slug: "victoria-engineering", name: "Victoria", role: "Engineering Coordinator", department: "Engineering", width: 191, height: 395 },
  { slug: "julia-sponsorship", name: "Julia", role: "Sponsorship Coordinator", department: "Sponsorship", width: 222, height: 394 },
  { slug: "jasleen-logistics", name: "Jasleen", role: "Logistics Coordinator", department: "Logistics", width: 197, height: 393 },
  { slug: "celine-engineering", name: "Celine", role: "Engineering Coordinator", department: "Engineering", width: 177, height: 418 },
  { slug: "olivia-sponsorship", name: "Olivia", role: "Sponsorship Coordinator", department: "Sponsorship", width: 175, height: 395 },
  { slug: "melissa-logistics", name: "Melissa", role: "Logistics Coordinator", department: "Logistics", width: 197, height: 394 },
  { slug: "rachel-logistics", name: "Rachel", role: "Logistics Coordinator", department: "Logistics", width: 186, height: 396 },
];
