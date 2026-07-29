import { PageHeader } from "@/app/components/page-header";
import { UserManagement } from "@/app/components/user-management/user-management";
import { useLanguage } from "@/app/contexts/language-context";

export function UserManagementPage({ onBack }: { onBack?: () => void }) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('masterDashboard.userManagement')}
        description={t('masterDashboard.manageUserDetails')}
        onBack={onBack}
        backLabel={t('common.backToDashboard')}
      />
      
      <UserManagement />
    </div>
  );
}