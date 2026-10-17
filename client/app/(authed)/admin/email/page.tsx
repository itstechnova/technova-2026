import { PageLayout } from '@/components/admin/PageLayout'
import { EmailLogsTable } from "@/components/EmailLogsTable";

export default async function EmailLogsPage() {
  return (
    <PageLayout section="activity" title="Email Logs">
      <EmailLogsTable />
    </PageLayout>
  )
}