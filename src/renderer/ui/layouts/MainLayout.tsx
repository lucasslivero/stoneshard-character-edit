import { Header } from "@ui/components/Header";
import type { ReactNode } from "react";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col">
      <Header />

      <main className="h-full w-full overflow-hidden">
        <div className="h-full w-full overflow-auto p-5">{children}</div>
      </main>
    </div>
  );
}
