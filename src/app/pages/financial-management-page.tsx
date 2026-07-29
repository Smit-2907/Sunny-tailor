import { PageHeader } from "@/app/components/page-header";
import { FinancialDataManagement } from "@/app/components/finance/financial-data-management";
import { useLanguage } from "@/app/contexts/language-context";

export function FinancialManagementPage({ onBack }: { onBack?: () => void }) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('masterDashboard.financialDataManagement')}
        description={t('masterDashboard.manageFinancialData')}
        onBack={onBack}
        backLabel={t('common.backToDashboard')}
      />
      
      <FinancialDataManagement />
    </div>
  );
}