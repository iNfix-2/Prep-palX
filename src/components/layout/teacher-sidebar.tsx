"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";
import { teacherNavItems } from "@/components/layout/nav-items";

export function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col bg-navy">
      <div className="p-6">
        <h1 className="font-display text-headline-md font-extrabold tracking-tight text-on-navy">
          Prep Pal
        </h1>
        <p className="text-body-md text-on-navy-muted">Teacher Workspace</p>
      </div>

      <nav className="custom-scrollbar mt-2 flex-1 space-y-1 overflow-y-auto">
        {teacherNavItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 border-l-4 px-6 py-3 text-body-md transition-colors duration-150",
                active
                  ? "border-primary bg-navy-hover font-semibold text-on-navy"
                  : "border-transparent text-on-navy-muted hover:bg-navy-hover hover:text-on-navy",
              )}
            >
              <Icon name={item.icon} className="text-[20px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-6">
        <Link
          href="/lesson-planner/new"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-body-md font-bold text-on-primary transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          <Icon name="add" className="text-[20px]" />
          Create Lesson Plan
        </Link>
      </div>
    </aside>
  );
}
