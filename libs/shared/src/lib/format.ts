const euro = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const datum = new Intl.DateTimeFormat('de-DE');

export function formatEuro(betrag: number): string {
  return euro.format(betrag);
}

/** Formatiert ein ISO-Datum (`2026-09-23`) als `23.9.2026`. */
export function formatDatum(isoDatum: string): string {
  return datum.format(new Date(isoDatum));
}
