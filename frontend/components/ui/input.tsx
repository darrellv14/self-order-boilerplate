import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "flex h-11 w-full rounded-2xl border bg-white px-4 text-sm outline-none ring-offset-0 placeholder:text-stone-400 focus:ring-2 focus:ring-red-700/15",
        props.className
      )}
    />
  );
}
