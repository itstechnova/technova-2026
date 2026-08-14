import { getHackerApplications } from '@/lib/data/hackers'
import { HackerApplicationsTable } from '../HackerApplicationsTable'

export async function HackerApplicationsTableWrapper() {
  const applications = await getHackerApplications()
  return <HackerApplicationsTable applications={applications} />
}