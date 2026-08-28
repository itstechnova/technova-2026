import { PageLayout } from '@/components/admin/PageLayout'
import { HackerApplicationsTable } from '@/components/HackerApplicationsTable'

export default async function HackerApplicationsPage() {
  return (
    <PageLayout section="applications" title="Hacker Applications">
      <HackerApplicationsTable />
    </PageLayout>
  )
}