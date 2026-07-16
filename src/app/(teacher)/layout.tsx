import { MobileTeacherNav, TeacherSidebar } from "@/components/layout/teacher-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { getPageAuthContext } from "@/lib/server/auth-context";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const context = await getPageAuthContext();
  const userName = context.status === "authenticated" ? context.user.displayName : "Guest";
  const userRole =
    context.status === "authenticated" ? context.activeMembership.jobTitle : "Signed out";
  const workspaceName =
    context.status === "authenticated" ? context.activeWorkspace.name : undefined;

  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />
      <MobileTeacherNav />
      <div className="flex min-h-screen flex-col lg:ml-[280px]">
        <TopBar userName={userName} userRole={userRole} workspaceName={workspaceName} />
        <main className="flex-1 p-4 pb-28 md:p-6 lg:p-8 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
