import * as React from "react";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className = "" }: ProgressProps) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-full bg-indigo-600 transition-all duration-300 ease-in-out rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
