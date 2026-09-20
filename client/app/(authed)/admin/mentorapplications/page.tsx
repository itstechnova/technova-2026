import { PageLayout } from '@/components/admin/PageLayout'
import { getMentorApplications } from '@/lib/data/mentors'
import { MentorApplicationsTable } from "@/components/MentorApplicationsTable";


export default async function MentorApplicationsPage() {
  const applications = await getMentorApplications()
  return (
    <PageLayout section="applications" title="Mentor Applications">
      <MentorApplicationsTable applications={applications} />
    </PageLayout>
  )
}