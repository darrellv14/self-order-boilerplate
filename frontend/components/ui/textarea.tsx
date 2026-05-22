import { cn } from "@/lib/utils";

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={cn(
        "flex min-h-24 w-full rounded-3xl border bg-white px-4 py-3 text-sm outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-red-700/15",
        props.className
      )}
    />
  );
}
