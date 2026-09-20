import { PageLayout } from '@/components/admin/PageLayout'
import { getVolunteerApplications } from '@/lib/data/volunteers'
import { VolunteerApplicationsTable } from "@/components/VolunteerApplicationsTable";


export default async function VolunteerApplicationsPage() {
  const applications = await getVolunteerApplications()
  return (
    <PageLayout section="applications" title="Volunteer Applications">
      <VolunteerApplicationsTable applications={applications} />
    </PageLayout>
  )
}