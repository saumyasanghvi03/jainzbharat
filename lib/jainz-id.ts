const WIDTH = 6;
const JAINZ_ID_PATTERN = /^JZB-(\d{4})-(\d{6})$/;

export function formatJainZId(sequence: number, year = new Date().getUTCFullYear()) {
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error('sequence must be a positive integer');
  }

  return `JZB-${year}-${String(sequence).padStart(WIDTH, '0')}`;
}

export function parseJainZId(id: string) {
  const match = JAINZ_ID_PATTERN.exec(id);
  if (!match) return null;
  return { year: Number(match[1]), sequence: Number(match[2]) };
}
