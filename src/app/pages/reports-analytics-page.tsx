import { PageHeader } from "@/app/components/page-header";
import { ReportsAnalytics } from "@/app/components/reports/reports-analytics";
import { useLanguage } from "@/app/contexts/language-context";

export function ReportsAnalyticsPage({ onBack }: { onBack?: () => void }) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('masterDashboard.reportsAnalytics')}
        description={t('masterDashboard.generateDetailedReports')}
        onBack={onBack}
        backLabel={t('common.backToDashboard')}
      />
      
      <ReportsAnalytics />
    </div>
  );
}