import { PageLayout } from '@/components/admin/PageLayout'
import { VolunteerApplicationsTable } from "@/components/VolunteerApplicationsTable";


export default async function VolunteerApplicationsPage() {
  return (
    <PageLayout section="applications" title="Volunteer Applications">
      <VolunteerApplicationsTable />
    </PageLayout>
  )
}