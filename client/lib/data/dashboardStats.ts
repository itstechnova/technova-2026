import { createClient } from '@/lib/supabase/client'

type Role = 'hacker' | 'mentor' | 'volunteer'

export type DashboardStats = {
  totalApplications: number
  totalHackers: number
  totalMentors: number
  totalVolunteers: number
  acceptedHackers: number
  acceptedMentors: number
  acceptedVolunteers: number
  totalAccepted: number
  hackerPoolPercentage: number
  mentorPoolPercentage: number
  volunteerPoolPercentage: number
  acceptedHackersPercentage: number
  acceptedMentorsPercentage: number
  acceptedVolunteersPercentage: number
  overallAcceptancePercentage: number
}

const EMPTY_STATS: DashboardStats = {
  totalApplications: 0,
  totalHackers: 0,
  totalMentors: 0,
  totalVolunteers: 0,
  acceptedHackers: 0,
  acceptedMentors: 0,
  acceptedVolunteers: 0,
  totalAccepted: 0,
  hackerPoolPercentage: 0,
  mentorPoolPercentage: 0,
  volunteerPoolPercentage: 0,
  acceptedHackersPercentage: 0,
  acceptedMentorsPercentage: 0,
  acceptedVolunteersPercentage: 0,
  overallAcceptancePercentage: 0,
}

function safePercent(numerator: number, denominator: number): number {
  if (!denominator) return 0
  return (numerator / denominator) * 100
}

async function countByRole(role: Role) {
  const supabase = createClient()
  return supabase
    .from('user')
    .select('user_id', { count: 'exact', head: true })
    .eq('role', role)
}

async function countAcceptedByRole(role: Role) {
  const supabase = createClient()
  return supabase
    .from('user')
    .select('user_id', { count: 'exact', head: true })
    .eq('role', role)
    .eq('accepted', true)
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      hackerRes,
      mentorRes,
      volunteerRes,
      acceptedHackerRes,
      acceptedMentorRes,
      acceptedVolunteerRes,
    ] = await Promise.all([
      countByRole('hacker'),
      countByRole('mentor'),
      countByRole('volunteer'),
      countAcceptedByRole('hacker'),
      countAcceptedByRole('mentor'),
      countAcceptedByRole('volunteer'),
    ])

    if (
      hackerRes.error ||
      mentorRes.error ||
      volunteerRes.error ||
      acceptedHackerRes.error ||
      acceptedMentorRes.error ||
      acceptedVolunteerRes.error
    ) {
      return EMPTY_STATS
    }

    const totalHackers = hackerRes.count ?? 0
    const totalMentors = mentorRes.count ?? 0
    const totalVolunteers = volunteerRes.count ?? 0
    const acceptedHackers = acceptedHackerRes.count ?? 0
    const acceptedMentors = acceptedMentorRes.count ?? 0
    const acceptedVolunteers = acceptedVolunteerRes.count ?? 0

    const totalApplications = totalHackers + totalMentors + totalVolunteers
    const totalAccepted = acceptedHackers + acceptedMentors + acceptedVolunteers

    return {
      totalApplications,
      totalHackers,
      totalMentors,
      totalVolunteers,
      acceptedHackers,
      acceptedMentors,
      acceptedVolunteers,
      totalAccepted,
      hackerPoolPercentage: safePercent(totalHackers, totalApplications),
      mentorPoolPercentage: safePercent(totalMentors, totalApplications),
      volunteerPoolPercentage: safePercent(totalVolunteers, totalApplications),
      acceptedHackersPercentage: safePercent(acceptedHackers, totalHackers),
      acceptedMentorsPercentage: safePercent(acceptedMentors, totalMentors),
      acceptedVolunteersPercentage: safePercent(acceptedVolunteers, totalVolunteers),
      overallAcceptancePercentage: safePercent(totalAccepted, totalApplications),
    }
  } catch {
    return EMPTY_STATS
  }
}

export function getEmptyDashboardStats(): DashboardStats {
  return EMPTY_STATS
}