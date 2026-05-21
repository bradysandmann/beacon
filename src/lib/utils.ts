import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function intentLabel(signal: string | null | undefined) {
  switch (signal) {
    case "active":
      return { label: "Active", dot: "#67E8F9" };
    case "dormant":
      return { label: "Dormant", dot: "#A1A1AA" };
    case "closed":
      return { label: "Closed", dot: "#F472B6" };
    default:
      return { label: signal ?? "Unknown", dot: "#A78BFA" };
  }
}

export function fitColor(score: number | null | undefined) {
  if (score == null) return "#A1A1AA";
  if (score >= 80) return "#67E8F9";
  if (score >= 60) return "#A78BFA";
  if (score >= 40) return "#F472B6";
  return "#52525B";
}
