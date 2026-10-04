import { LayoutDashboard, Code2, GraduationCap, HeartHandshake, Users } from 'lucide-react'

export const SidebarData = [
  {
    groupTitle: "MAIN",
    items: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard />,
        link: "/admin/dashboard"
      },
    ]
  },
  {
    groupTitle: "APPLICATIONS",
    items: [
      {
        title: "Hacker Applications",
        icon: <Code2 />,
        link: "/admin/hackerapplications"
      },
      {
        title: "Mentor Applications",
        icon: <GraduationCap />,
        link: "/admin/mentorapplications"
      },
      {
        title: "Volunteer Applications",
        icon: <HeartHandshake />,
        link: "/admin/volunteerapplications"
      },
    ]
  },
  {
    groupTitle: "MANAGE",
    items: [
      {
        title: "Members",
        icon: <Users />,
        link: "/admin/members"
      },
    ]
  },
]