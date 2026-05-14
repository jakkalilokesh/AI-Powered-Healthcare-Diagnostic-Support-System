const Skeleton = ({ className = '', height = 'h-4', width = 'w-full' }) => {
  return (
    <div className={`skeleton ${height} ${width} ${className}`} />
  )
}

export const CardSkeleton = () => (
  <div className="glass-card p-6">
    <Skeleton className="h-6 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <Skeleton className="h-10 w-full" />
  </div>
)

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="glass-card p-4 flex gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
)

export default Skeleton
