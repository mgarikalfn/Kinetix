import Link from "next/link";
import { KinetixLogo } from "./kinetix-logo";
import { Navigation } from "./Navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Projects from "./Projects";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-[#121216] p-4 w-full flex flex-col gap-y-4 border-r border-white/[0.06]">
      <Link href="/" className="px-2 py-1">
        <KinetixLogo size={32} />
      </Link>
      <div className="h-px bg-white/[0.08] w-full" />
      <WorkspaceSwitcher />
      <div className="h-px bg-white/[0.08] w-full" />
      <Navigation />
      <div className="h-px bg-white/[0.08] w-full" />
      <Projects />
    </aside>
  );
};