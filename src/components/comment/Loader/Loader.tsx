import { Skeleton } from "@heroui/react";

export function Loader() {
  return (
    <div className="shadow-panel w-[250px]  space-y-5 rounded-lg bg-transparent p-4">
      <Skeleton className="h-32 w-80 rounded-lg bg-slate-300" />
      <div className="space-y-6">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-2/5 rounded-lg" />
      </div>
    </div>
  );
}
