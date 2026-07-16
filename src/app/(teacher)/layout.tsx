import { TeacherSidebar } from "@/components/layout/teacher-sidebar";
import { TopBar } from "@/components/layout/top-bar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />
      <div className="ml-[280px] flex min-h-screen flex-col">
        <TopBar userName="Mrs. Adeyemi" userRole="Lead Teacher" />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
