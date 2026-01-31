export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-pulse">
        <div className="h-8 w-40 bg-zinc-200 rounded-md mb-6" />
        <div className="h-[360px] w-full bg-zinc-200 rounded-3xl shadow-sm" />
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-12 w-12 rounded-full bg-zinc-200" />
          <div className="h-12 w-12 rounded-full bg-zinc-200" />
          <div className="h-12 w-12 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}
