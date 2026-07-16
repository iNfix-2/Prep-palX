import { AttendanceRegister } from "@/components/attendance/attendance-register";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toAttendanceRegisterView } from "@/lib/features/attendance/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getAttendanceRegister } from "@/lib/server/attendance-service";
import { saveAttendanceAction } from "@/app/(teacher)/attendance/[classId]/actions";

export default async function AttendanceRegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { classId } = await params;
  const { saved, error } = await searchParams;
  const result = getAttendanceRegister(await getPageAuthContext(), classId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Register not found"
        message={result.message}
        action={{ label: "Back to attendance", href: "/attendance", icon: "how_to_reg" }}
      />
    );
  }

  return (
    <>
      {error && (
        <div className="mx-auto mb-4 w-full max-w-(--container-max) rounded-lg border border-error/20 bg-error/10 p-4 text-body-md font-semibold text-error">
          Attendance could not be saved. Please check the register and try again.
        </div>
      )}
      <AttendanceRegister
        view={toAttendanceRegisterView(result.data)}
        action={saveAttendanceAction.bind(null, classId)}
        saved={saved === "1"}
      />
    </>
  );
}
