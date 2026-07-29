import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterPanelProps {
  onSearch?: (value: string) => void;
  onStatusFilter?: (value: string) => void;
  onReset?: () => void;
}

export function FilterPanel({ onSearch, onStatusFilter, onReset }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
      {/* Mobile: Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full sm:hidden mb-3"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Desktop: Always visible header */}
      <div className="hidden sm:flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      {/* Filter Content - Collapsible on Mobile */}
      <div className={`space-y-4 ${isExpanded || window.innerWidth >= 640 ? "block" : "hidden sm:block"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="search" className="mb-2 block text-sm">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search orders, products..."
                className="pl-10"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="mb-2 block text-sm">
              Status
            </Label>
            <Select onValueChange={onStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date" className="mb-2 block text-sm">
              Date Range
            </Label>
            <Select>
              <SelectTrigger id="date">
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}