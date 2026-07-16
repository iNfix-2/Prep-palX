export interface ConversationItem {
  title: string;
  icon: string;
  active?: boolean;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  tone: "ai" | "primary" | "neutral";
}

export interface ContextCard {
  label: string;
  value: string;
  icon: string;
}

export interface ActiveSource {
  title: string;
  type: string;
  icon: string;
  tone: "error" | "primary" | "ai";
}

export const askPalMock = {
  teacherName: "Mrs. Adeyemi",
  conversations: [
    { title: "Prepare Primary 4 Fractions", icon: "smart_toy", active: true },
    { title: "Analyse Primary 3 English", icon: "description" },
    { title: "Term 2 Science Curriculum", icon: "auto_stories" },
    { title: "Gradebook Upload: Math", icon: "grade" },
  ] satisfies ConversationItem[],
  quickActions: [
    {
      title: "Prepare my next lesson",
      description: "Generate a full lesson plan with slides and activities based on the curriculum.",
      icon: "auto_stories",
      tone: "ai",
    },
    {
      title: "Plan my teaching week",
      description: "Optimize your schedule and topics across all active class subjects.",
      icon: "calendar_today",
      tone: "primary",
    },
    {
      title: "Analyze Results",
      description: "Upload test scores to identify learning gaps and personalize feedback.",
      icon: "monitoring",
      tone: "neutral",
    },
    {
      title: "Idea Generator",
      description: "Get creative classroom activities and icebreakers for your students.",
      icon: "psychology",
      tone: "ai",
    },
  ] satisfies QuickAction[],
  context: [
    { label: "Workspace", value: "Truth Academy", icon: "school" },
    { label: "Role", value: "Grade 4 Lead Teacher", icon: "person_check" },
  ] satisfies ContextCard[],
  activeSources: [
    {
      title: "Mathematics Curriculum 2024",
      type: "PDF Document",
      icon: "picture_as_pdf",
      tone: "error",
    },
    {
      title: "Term 1 School Calendar",
      type: "Shared Event",
      icon: "calendar_month",
      tone: "primary",
    },
    {
      title: "Teaching Guide: Pedagogy",
      type: "Web Source",
      icon: "link",
      tone: "ai",
    },
  ] satisfies ActiveSource[],
  activeTags: ["Primary 4", "Mathematics"],
  assistantMessage:
    "I've analyzed your upcoming schedule. You have a Mathematics session for Primary 4 tomorrow at 9:00 AM. Would you like me to generate a lesson plan on Equivalent Fractions based on the National Curriculum?",
  usagePercent: 82,
  resetLabel: "Next reset in 4 days",
};
