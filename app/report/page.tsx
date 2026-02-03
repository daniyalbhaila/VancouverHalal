import { Suspense } from 'react';
import ReportIssueClient from './report-issue-client';

export default function ReportIssuePage() {
  return (
    <Suspense fallback={null}>
      <ReportIssueClient />
    </Suspense>
  );
}
