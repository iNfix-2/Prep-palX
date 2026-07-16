import { LoadingState } from "@/components/states/data-states";

export default function AskPalLoading() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <LoadingState label="Loading Ask Pal..." />
    </div>
  );
}
