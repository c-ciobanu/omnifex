import { Circle } from "lucide-react";

export function Logo() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600">
      <Circle className="h-4 w-4 stroke-[4px] text-white" />
    </div>
  );
}
