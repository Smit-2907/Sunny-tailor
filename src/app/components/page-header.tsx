import { Button } from "@/app/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";

interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  variant?: "default" | "outline" | "secondary";
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: PageHeaderAction;
  actions?: PageHeaderAction[];
  onBack?: () => void;
  backLabel?: string;
}

export function PageHeader({ title, description, action, actions, onBack, backLabel }: PageHeaderProps) {
  // If single action prop is provided, use it. Otherwise use actions array
  const allActions = action ? [action] : (actions || []);
  
  return (
    <div className="mb-6">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backLabel || "Back to Dashboard"}
        </Button>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground truncate">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {allActions.length > 0 && (
          <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
            {allActions.map((actionItem, index) => {
              const ActionIcon = actionItem.icon || Plus;
              return (
                <Button 
                  key={index}
                  onClick={actionItem.onClick} 
                  variant={actionItem.variant || "default"}
                  className={`${actionItem.variant !== "outline" && actionItem.variant !== "secondary" ? 'bg-indigo-600 hover:bg-indigo-700' : ''} flex-1 sm:flex-initial`}
                  size="default"
                >
                  <ActionIcon className="h-4 w-4 mr-2" />
                  <span className="truncate">{actionItem.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}