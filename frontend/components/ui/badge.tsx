import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-amber-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900",
        className
      )}
      {...props}
    />
  );
}
