export const EVENT_TYPES = ["durga_puja", "saraswati_puja", "other"] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  durga_puja: "Durga Puja",
  saraswati_puja: "Saraswati Puja",
  other: "Other Celebration",
};

export function isEventType(value: string): value is EventType {
  return (EVENT_TYPES as readonly string[]).includes(value);
}
