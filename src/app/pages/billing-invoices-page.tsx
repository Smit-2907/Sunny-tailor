import { PageHeader } from "@/app/components/page-header";
import { BillingManagement } from "@/app/components/billing/billing-management";
import { useLanguage } from "@/app/contexts/language-context";

export function BillingInvoicesPage({ onBack }: { onBack?: () => void }) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('masterDashboard.billingManagement')}
        description={t('masterDashboard.manageBilling')}
        onBack={onBack}
        backLabel={t('common.backToDashboard')}
      />
      
      <BillingManagement />
    </div>
  );
}