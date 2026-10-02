export function formatDateRange(start: Date | string | null, end: Date | string | null): string {
  if (!start) return "";
  const s = new Date(start);
  const e = end ? new Date(end) : s;

  const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
  const monthFmt = new Intl.DateTimeFormat("en-GB", { month: "long" });
  const yearFmt = new Intl.DateTimeFormat("en-GB", { year: "numeric" });
  const fullFmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (s.getTime() === e.getTime()) {
    return fullFmt.format(s);
  }

  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${dayFmt.format(s)}–${dayFmt.format(e)} ${monthFmt.format(e)} ${yearFmt.format(e)}`;
  }

  return `${fullFmt.format(s)} – ${fullFmt.format(e)}`;
}
