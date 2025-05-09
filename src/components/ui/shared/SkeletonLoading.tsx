import { Skeleton } from "../skeleton";

export function SkeletonLoading() {
  return (
    <div className="flex flex-col space-y-3 text-center">
      <Skeleton className="h-[125px] w-[250px] bg-gray-300 rounded-xl " />
      <div className="space-y-2 text-center">
        <Skeleton className="h-4 w-[250px] bg-gray-200" />
        <Skeleton className="h-4 w-[200px] bg-gray-300" />
      </div>
    </div>
  );
}
