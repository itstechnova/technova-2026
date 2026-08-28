import { PageLayout } from '@/components/admin/PageLayout'
import { getHackerApplications } from '@/lib/data/hackers'
import { HackerApplicationsTable } from '@/components/HackerApplicationsTable'

export default async function HackerApplicationsPage() {
  const applications = await getHackerApplications()
  return (
    <PageLayout section="applications" title="Hacker Applications">
      <HackerApplicationsTable applications={applications} />
    </PageLayout>
  )
}