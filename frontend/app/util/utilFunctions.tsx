export function capitalize(str: string | undefined): string {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDateToLocal(
  utcDateString: string | undefined,
  includeTme: boolean,
): string {
  if (!utcDateString) {
    return "";
  }
  const date = new Date(utcDateString);

  let options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  if (includeTme) {
    options = {
      ...options,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
  }

  return new Intl.DateTimeFormat("en-GB", options)
    .format(date)
    .replace(",", " at"); // Formatting tweak
}
