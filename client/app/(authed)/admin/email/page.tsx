import { PageLayout } from '@/components/admin/PageLayout'
import { EmailLogsTable } from "@/components/EmailLogsTable";
import { getEmailLogs } from '@/lib/data/emails';

export default async function EmailLogsPage() {
  const logs = await getEmailLogs()
  return (
    <PageLayout section="activity" title="Email Logs">
      <EmailLogsTable logs={logs}/>
    </PageLayout>
  )
}