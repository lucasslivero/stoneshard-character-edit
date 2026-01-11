import { Link } from "react-router-dom";

import { ThemeSwitcher } from "./ThemeSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 flex items-center justify-between border-b-2 bg-default px-10 py-2">
      <div className="flex items-baseline gap-4">
        <h1 className="cursor-pointer font-bold text-3xl -tracking-wider">
          <Link to="/">StoneShard Editor</Link>
        </h1>
        <small className="text-muted-foreground">Choose your own path</small>
      </div>

      <ThemeSwitcher />
    </header>
  );
}
