import type { Metadata } from 'next';
import { Suspense } from 'react';
import ReportIssueClient from './report-issue-client';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ReportIssuePage() {
  return (
    <Suspense fallback={null}>
      <ReportIssueClient />
    </Suspense>
  );
}
