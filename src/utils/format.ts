import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function formatMoveInTotal(pricing: {
  rent: number;
  deposit: number;
  maintenance: number;
  food: number;
  electricity: number;
  parking: number;
  other: number;
}) {
  return (
    pricing.deposit +
    pricing.rent +
    pricing.maintenance +
    pricing.food +
    pricing.electricity +
    pricing.parking +
    pricing.other
  );
}

export function relativeTime(iso: string) {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

export function formatDate(iso: string) {
  try {
    return format(parseISO(iso), 'd MMM yyyy');
  } catch {
    return iso;
  }
}

export function pgTypeLabel(t: string) {
  const map: Record<string, string> = {
    men: 'Men',
    women: 'Women',
    coliving: 'Co-living',
    hostel: 'Hostel',
    family: 'Family',
    any: 'Any',
  };
  return map[t] ?? t;
}

export function visitStatusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function bookingStatusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
