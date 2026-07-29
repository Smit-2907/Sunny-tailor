import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  mobileHidden?: boolean; // Hide on mobile
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowAction?: (action: string, row: T) => void;
  actions?: { label: string; value: string }[];
}

export function DataTable<T extends { id: string | number }>({ 
  columns, 
  data, 
  onRowAction,
  actions = [
    { label: "View Details", value: "view" },
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete" },
  ]
}: DataTableProps<T>) {
  return (
    <>
      {/* Desktop Table View */}
      <Card className="overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((column, index) => (
                  <TableHead key={index} className="font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="w-[50px]"></TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30">
                    {columns.map((column, index) => (
                      <TableCell key={index} className="whitespace-nowrap">
                        {column.render 
                          ? column.render(row)
                          : String(row[column.key as keyof T] ?? '-')}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action) => (
                              <DropdownMenuItem
                                key={action.value}
                                onClick={() => onRowAction?.(action.value, row)}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {data.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No data available
          </Card>
        ) : (
          data.map((row) => (
            <Card key={row.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                {columns.filter(col => !col.mobileHidden).map((column, index) => (
                  <div key={index} className="flex justify-between items-start gap-3">
                    <span className="text-sm font-medium text-muted-foreground flex-shrink-0">
                      {column.header}:
                    </span>
                    <span className="text-sm text-foreground text-right">
                      {column.render 
                        ? column.render(row)
                        : String(row[column.key as keyof T] ?? '-')}
                    </span>
                  </div>
                ))}
                
                {actions.length > 0 && (
                  <div className="pt-3 border-t flex gap-2">
                    {actions.map((action) => (
                      <Button
                        key={action.value}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onRowAction?.(action.value, row)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
