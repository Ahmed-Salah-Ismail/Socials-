export default function DeletingPost() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-slate-50 p-4 my-4 rounded-2xl border border-red-100 animate-pulse"
    >
      {/* هيدر وهمي */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-1/5 rounded bg-slate-200" />
        </div>
      </div>

      {/* محتوى وهمي */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-5/6 rounded bg-slate-200" />
        <div className="h-32 w-full rounded-xl bg-slate-200" />
      </div>

      {/* الرسالة */}
      <div className="flex items-center justify-center gap-2 text-red-500 font-medium">
        <span className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
        Deleting post...
      </div>
    </div>
  );
}
