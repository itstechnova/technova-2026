import { PageLayout } from '@/components/admin/PageLayout'
import { MembersTable } from "@/components/MembersTable";


export default async function MembersPage() {
  return (
    <PageLayout section="manage" title="Members">
      <MembersTable />
    </PageLayout>
  )
}