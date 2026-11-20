import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth/dal'

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

function safePercent(numerator: number, denominator: number): number {
  if (!denominator) return 0
  return (numerator / denominator) * 100
}

async function countByRole(role: Role) {
  const supabase = await createClient()
  return supabase
    .from('user')
    .select('user_id', { count: 'exact', head: true })
    .eq('role', role)
}

async function countAcceptedByRole(role: Role) {
  const supabase = await createClient()
  return supabase
    .from('user')
    .select('user_id', { count: 'exact', head: true })
    .eq('role', role)
    .eq('accepted', true)
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireRole(['admin'])
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
    throw new Error("Unable to load dashboard statistics. Please try again.")
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
}
