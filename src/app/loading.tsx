export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative w-12 h-12">
        {/* Core animating ring */}
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-zinc-500 text-sm font-medium tracking-wide animate-pulse">
        加载中...
      </p>
    </div>
  );
}
