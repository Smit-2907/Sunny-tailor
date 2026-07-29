import * as React from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange, className = "" }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
        checked
          ? "bg-indigo-600 border-indigo-600"
          : "bg-white border-gray-300 hover:border-indigo-400"
      } ${className}`}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </button>
  );
}
