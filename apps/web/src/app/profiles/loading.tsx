export default function ProfilesLoading() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="h-10 w-full bg-gray-200 rounded animate-pulse mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
} 