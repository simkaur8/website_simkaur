interface SkeletonGridProps {
  count?: number
}

export function SkeletonGrid({ count = 6 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="aspect-[3/4] bg-[var(--bg-surface)] rounded-md animate-pulse" />
      ))}
    </div>
  )
}
