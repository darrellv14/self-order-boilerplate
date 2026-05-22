import { ReactNode } from "react";

export function MobileShell({ children }: { children: ReactNode }) {
  return <div className="app-shell">{children}</div>;
}
