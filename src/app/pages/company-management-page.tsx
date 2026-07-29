import { PageHeader } from "@/app/components/page-header";
import { CompanyManagement } from "@/app/components/company/company-management";
import { useLanguage } from "@/app/contexts/language-context";

export function CompanyManagementPage({ onBack }: { onBack?: () => void }) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('masterDashboard.companyManagement')}
        description={t('masterDashboard.manageCompanyDetails')}
        onBack={onBack}
        backLabel={t('common.backToDashboard')}
      />
      
      <CompanyManagement />
    </div>
  );
}