import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type QueryPrimitive = string | number | boolean | Date;
type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toQueryString(
  record: Record<string, QueryValue>
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(record)) {
    if (value == null) continue;

    const values = Array.isArray(value) ? value : [value];

    for (const item of values) {
      if (item == null) continue;

      const parsedValue =
        item instanceof Date ? item.toISOString() : String(item);
      params.append(key, parsedValue);
    }
  }

  return params;
}
