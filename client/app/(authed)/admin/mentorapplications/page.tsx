import { PageLayout } from '@/components/admin/PageLayout'
import { MentorApplicationsTable } from "@/components/MentorApplicationsTable";


export default async function MentorApplicationsPage() {
  return (
    <PageLayout section="applications" title="Mentor Applications">
      <MentorApplicationsTable />
    </PageLayout>
  )
}