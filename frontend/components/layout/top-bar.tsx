import { Bell, Search, Table2 } from "lucide-react";

export function TopBar({
  title,
  tableLabel = "Table 12",
}: {
  title: string;
  tableLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white/90 px-4 py-3 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
          Premium Self Order
        </p>
        <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-full bg-stone-100 p-2 text-stone-600">
          <Search className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-medium text-red-900">
          <Table2 className="h-4 w-4" />
          {tableLabel}
        </div>
        <button className="rounded-full bg-stone-100 p-2 text-stone-600">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
