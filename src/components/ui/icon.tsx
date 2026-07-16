import { type SVGProps } from "react";
import { cn } from "@/lib/cn";

type IconName =
  | "academic_calendar"
  | "add"
  | "analytics"
  | "assignment"
  | "assignment_add"
  | "attach_file"
  | "auto_awesome"
  | "auto_fix_high"
  | "auto_stories"
  | "bolt"
  | "calendar_month"
  | "calendar_today"
  | "calendar_view_day"
  | "calculate"
  | "chat_spark"
  | "chevron_right"
  | "close"
  | "database"
  | "description"
  | "error"
  | "expand_more"
  | "folder_open"
  | "grade"
  | "grading"
  | "groups"
  | "help"
  | "history"
  | "home"
  | "how_to_reg"
  | "launch"
  | "link"
  | "location_on"
  | "logout"
  | "mic"
  | "monitoring"
  | "notifications"
  | "person_check"
  | "picture_as_pdf"
  | "priority_high"
  | "psychology"
  | "quiz"
  | "schedule"
  | "school"
  | "search"
  | "send"
  | "settings"
  | "smart_toy"
  | "task_alt"
  | "topic"
  | "verified_user";

interface IconProps {
  name: IconName | (string & {});
  className?: string;
  filled?: boolean;
}

type SvgIconProps = SVGProps<SVGSVGElement>;
type IconRenderer = (props: SvgIconProps) => React.ReactElement;

const iconRenderers: Record<IconName, IconRenderer> = {
  academic_calendar: CalendarIcon,
  add: PlusIcon,
  analytics: AnalyticsIcon,
  assignment: ClipboardIcon,
  assignment_add: AssignmentAddIcon,
  attach_file: PaperclipIcon,
  auto_awesome: SparklesIcon,
  auto_fix_high: WandIcon,
  auto_stories: BookOpenIcon,
  bolt: BoltIcon,
  calendar_month: CalendarIcon,
  calendar_today: CalendarIcon,
  calendar_view_day: CalendarViewIcon,
  calculate: CalculatorIcon,
  chat_spark: SparklesIcon,
  chevron_right: ChevronRightIcon,
  close: XIcon,
  database: DatabaseIcon,
  description: FileTextIcon,
  error: AlertCircleIcon,
  expand_more: ChevronDownIcon,
  folder_open: FolderOpenIcon,
  grade: GradingIcon,
  grading: GradingIcon,
  groups: UsersIcon,
  help: HelpIcon,
  history: HistoryIcon,
  home: HomeIcon,
  how_to_reg: UserCheckIcon,
  launch: ExternalLinkIcon,
  link: LinkIcon,
  location_on: MapPinIcon,
  logout: LogOutIcon,
  mic: MicIcon,
  monitoring: AnalyticsIcon,
  notifications: BellIcon,
  person_check: UserCheckIcon,
  picture_as_pdf: PdfIcon,
  priority_high: AlertTriangleIcon,
  psychology: LightbulbIcon,
  quiz: QuizIcon,
  schedule: ClockIcon,
  school: SchoolIcon,
  search: SearchIcon,
  send: SendIcon,
  settings: SettingsIcon,
  smart_toy: BotIcon,
  task_alt: CheckCircleIcon,
  topic: TagIcon,
  verified_user: ShieldCheckIcon,
};

export function Icon({ name, className, filled = false }: IconProps) {
  const Renderer = iconRenderers[name as IconName] ?? CircleIcon;

  return (
    <Renderer
      aria-hidden="true"
      className={cn("inline-block shrink-0 text-[20px]", className)}
      data-filled={filled || undefined}
    />
  );
}

function Svg({ children, className, ...props }: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      width="1em"
      height="1em"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

function AlertCircleIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

function AlertTriangleIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

function AnalyticsIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <rect x="7" y="11" width="3" height="5" rx="1" />
      <rect x="12" y="7" width="3" height="9" rx="1" />
      <rect x="17" y="4" width="3" height="12" rx="1" />
    </Svg>
  );
}

function AssignmentAddIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M9 5h6" />
      <path d="M9 3h6v4H9z" />
      <path d="M6 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="M18 13v8" />
      <path d="M14 17h8" />
    </Svg>
  );
}

function BellIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </Svg>
  );
}

function BookOpenIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M12 7v14" />
      <path d="M4 5.5A3 3 0 0 1 7 4h5v15H7a3 3 0 0 0-3 1.5v-15Z" />
      <path d="M20 5.5A3 3 0 0 0 17 4h-5v15h5a3 3 0 0 1 3 1.5v-15Z" />
    </Svg>
  );
}

function BoltIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
    </Svg>
  );
}

function BotIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M12 4v4" />
      <path d="M9 13h.01" />
      <path d="M15 13h.01" />
      <path d="M9 17h6" />
      <path d="M3 13h2" />
      <path d="M19 13h2" />
    </Svg>
  );
}

function CalculatorIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h.01" />
      <path d="M12 11h.01" />
      <path d="M16 11h.01" />
      <path d="M8 15h.01" />
      <path d="M12 15h.01" />
      <path d="M16 15h.01" />
    </Svg>
  );
}

function CalendarIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </Svg>
  );
}

function CalendarViewIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
      <path d="M8 14h8" />
    </Svg>
  );
}

function CheckCircleIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </Svg>
  );
}

function ChevronDownIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

function ChevronRightIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

function CircleIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
    </Svg>
  );
}

function ClipboardIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M9 5h6" />
      <path d="M9 3h6v4H9z" />
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <path d="M8 11h8" />
      <path d="M8 15h6" />
    </Svg>
  );
}

function ClockIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

function DatabaseIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </Svg>
  );
}

function ExternalLinkIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M14 3h7v7" />
      <path d="m10 14 11-11" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </Svg>
  );
}

function FileTextIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </Svg>
  );
}

function FolderOpenIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v2" />
      <path d="M3 11h18l-2 8H5l-2-8Z" />
    </Svg>
  );
}

function GradingIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="m8 12 2 2 5-6" />
      <path d="M8 17h8" />
    </Svg>
  );
}

function HelpIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.8 2.8 0 1 1 4.2 2.4c-1 .6-1.7 1.2-1.7 2.6" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

function HomeIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </Svg>
  );
}

function HistoryIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

function LightbulbIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.5 14.5a6 6 0 1 1 7 0c-.9.8-1.5 1.8-1.5 3.5h-4c0-1.7-.6-2.7-1.5-3.5Z" />
    </Svg>
  );
}

function LinkIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
    </Svg>
  );
}

function LogOutIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M10 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
      <path d="M15 17l5-5-5-5" />
      <path d="M20 12H8" />
    </Svg>
  );
}

function MapPinIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

function MicIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </Svg>
  );
}

function PaperclipIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="m21 12.5-8.5 8.5a6 6 0 0 1-8.5-8.5L13 3.5a4 4 0 1 1 5.7 5.7l-9 9a2 2 0 1 1-2.8-2.8l8.5-8.5" />
    </Svg>
  );
}

function PdfIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M7 15h2.2a1.8 1.8 0 0 0 0-3.6H7V18" />
      <path d="M13 18v-6h1.5a3 3 0 0 1 0 6H13Z" />
    </Svg>
  );
}

function PlusIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Svg>
  );
}

function QuizIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 12h3" />
      <path d="M15 12h1" />
      <path d="M8 16h1" />
      <path d="M13 16h3" />
    </Svg>
  );
}

function SearchIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  );
}

function SchoolIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="m3 8 9-5 9 5-9 5-9-5Z" />
      <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
      <path d="M21 8v6" />
    </Svg>
  );
}

function SendIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </Svg>
  );
}

function SettingsIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="m19.4 15 .6 2.4-2.2 2.2-2.4-.6a8 8 0 0 1-1.4.8L13.2 22h-3.1l-.8-2.2a8 8 0 0 1-1.4-.8l-2.4.6-2.2-2.2.6-2.4a8 8 0 0 1-.8-1.4L1 12.8V9.7l2.2-.8c.2-.5.5-1 .8-1.4l-.6-2.4 2.2-2.2 2.4.6c.4-.3.9-.6 1.4-.8L10.2 1h3.1l.8 2.2c.5.2 1 .5 1.4.8l2.4-.6 2.2 2.2-.6 2.4c.3.4.6.9.8 1.4l2.2.8v3.1l-2.2.8c-.2.5-.5 1-.9 1.4Z" />
    </Svg>
  );
}

function ShieldCheckIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-5" />
    </Svg>
  );
}

function SparklesIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m5 16 .8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z" />
      <path d="m19 2 .7 1.8L21.5 4.5l-1.8.7L19 7l-.7-1.8-1.8-.7 1.8-.7L19 2Z" />
    </Svg>
  );
}

function TagIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M20 13 12 21 3 12V4h8l9 9Z" />
      <path d="M7.5 7.5h.01" />
    </Svg>
  );
}

function UserCheckIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21a7 7 0 0 1 11-5.7" />
      <path d="m15 19 2 2 4-5" />
    </Svg>
  );
}

function UsersIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <path d="M17 11a4 4 0 0 0 0-6" />
      <path d="M22 21a7 7 0 0 0-5-6.7" />
    </Svg>
  );
}

function WandIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="m15 4 5 5" />
      <path d="m14 10 3-3" />
      <path d="M4 20 14 10" />
      <path d="m5 5 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />
      <path d="m19 14 .7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" />
    </Svg>
  );
}

function XIcon(props: SvgIconProps) {
  return (
    <Svg {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  );
}
