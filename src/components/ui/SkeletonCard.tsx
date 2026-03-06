export function SkeletonCard() {
    return (
        <div className="glass-card p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="w-2/3 h-6 bg-slate-200 dark:bg-slate-700/50 rounded-lg"></div>
                <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
            </div>
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-700/50 rounded-lg mb-6"></div>

            <div className="space-y-3 mb-6">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700/50 rounded-lg"></div>
                <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-700/50 rounded-lg"></div>
                <div className="w-4/6 h-4 bg-slate-200 dark:bg-slate-700/50 rounded-lg"></div>
            </div>

            <div className="w-full h-12 bg-slate-200 dark:bg-slate-700/50 rounded-xl mt-auto"></div>
        </div>
    );
}

export function SkeletonLine({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-slate-200 dark:bg-slate-700/50 rounded ${className}`}></div>
    );
}
