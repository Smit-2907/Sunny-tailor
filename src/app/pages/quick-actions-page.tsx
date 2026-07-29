import { PageHeader } from "@/app/components/page-header";
import { QuickActionsPanel } from "@/app/components/quick-actions/quick-actions-panel";
import { useLanguage } from "@/app/contexts/language-context";

export function QuickActionsPage({ onBack, onNavigate }: { onBack?: () => void; onNavigate?: (key: string) => void }) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('masterDashboard.quickActionsPanel')}
        description={t('masterDashboard.performQuickActions')}
        onBack={onBack}
        backLabel={t('common.backToDashboard')}
      />
      
      <QuickActionsPanel onNavigate={onNavigate} />
    </div>
  );
}