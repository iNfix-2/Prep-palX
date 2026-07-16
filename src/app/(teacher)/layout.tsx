import { MobileTeacherNav, TeacherSidebar } from "@/components/layout/teacher-sidebar";
import { TopBar } from "@/components/layout/top-bar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />
      <MobileTeacherNav />
      <div className="flex min-h-screen flex-col lg:ml-[280px]">
        <TopBar userName="Mrs. Adeyemi" userRole="Lead Teacher" />
        <main className="flex-1 p-4 pb-28 md:p-6 lg:p-8 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
