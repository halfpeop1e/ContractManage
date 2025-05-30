export function getCurrentTime(format = 'YYYY-MM-DD'): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());

  return format
    .replace('YYYY', `${year}`)
    .replace('MM', `${month}`)
    .replace('DD', `${day}`)
}
