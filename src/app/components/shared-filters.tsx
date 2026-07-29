import { Search, Filter, Calendar, X } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface FilterOption {
  label: string;
  value: string;
}

interface SharedFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  dateFilter?: string;
  onDateFilterChange?: (value: string) => void;
  dateOptions?: FilterOption[];
  categoryFilter?: string;
  onCategoryFilterChange?: (value: string) => void;
  categoryOptions?: FilterOption[];
  showClearAll?: boolean;
  onClearAll?: () => void;
  activeFilterCount?: number;
}

export function SharedFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  dateFilter,
  onDateFilterChange,
  dateOptions,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
  showClearAll = true,
  onClearAll,
  activeFilterCount = 0,
}: SharedFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Status Filter */}
        {statusOptions && onStatusFilterChange && (
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Category Filter */}
        {categoryOptions && onCategoryFilterChange && (
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date Filter */}
        {dateOptions && onDateFilterChange && (
          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="w-[160px] h-9">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Active Filters Badge */}
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="h-9 px-3">
            <Filter className="h-3 w-3 mr-1" />
            {activeFilterCount} Active
          </Badge>
        )}

        {/* Clear All Button */}
        {showClearAll && activeFilterCount > 0 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function CompactFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  statusFilter,
  onStatusFilterChange,
  statusOptions,
}: Pick<
  SharedFiltersProps,
  | "searchValue"
  | "onSearchChange"
  | "searchPlaceholder"
  | "statusFilter"
  | "onStatusFilterChange"
  | "statusOptions"
>) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-7 h-8 text-sm"
          />
        </div>
      </div>

      {statusOptions && onStatusFilterChange && (
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[120px] h-8 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
