export function nowIso() {
  return new Date().toISOString();
}

export function formatDateTime(iso?: string) {
  if (!iso) return "Unknown";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(iso?: string) {
  if (!iso) return "Unknown";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function isOlderThanDays(iso: string | undefined, days: number) {
  if (!iso) return true;

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return true;
  }

  const ageMs = Date.now() - date.getTime();
  return ageMs > days * 24 * 60 * 60 * 1000;
}

export function relativeLastUpdatedToIso(lastUpdated?: string) {
  if (!lastUpdated) return nowIso();

  const lower = lastUpdated.toLowerCase();
  const amount = Number.parseInt(lower, 10);

  if (Number.isFinite(amount)) {
    if (lower.includes("h")) {
      return new Date(Date.now() - amount * 60 * 60 * 1000).toISOString();
    }

    if (lower.includes("d")) {
      return new Date(Date.now() - amount * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  return nowIso();
}
