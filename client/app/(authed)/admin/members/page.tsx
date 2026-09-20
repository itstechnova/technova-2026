import { PageLayout } from '@/components/admin/PageLayout'
import { getMembers } from '@/lib/data/members'
import { MembersTable } from "@/components/MembersTable";


export default async function MembersPage() {
  const members = await getMembers()
  return (
    <PageLayout section="manage" title="Members">
      <MembersTable members={members}/>
    </PageLayout>
  )
}