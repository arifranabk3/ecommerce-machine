export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
    </div>
  );
}
