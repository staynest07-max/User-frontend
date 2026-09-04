import type { EnquiryStatus } from '@/contracts/enquiry';
import type { PublicPgDetail } from '@/contracts/pg';
import type { VisitStatus } from '@/contracts/visit';
import type { PropertyCardModel } from '@/design-system/components/PropertyCard';

export function savedPgToCard(pg: PublicPgDetail): PropertyCardModel {
  const images = pg.media.filter((item) => item.type === 'image').sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return { id: pg.id, name: pg.name, area: pg.location.locality, city: pg.location.city, coverImage: images.find((x) => x.isCover)?.url ?? images[0]?.url ?? null, startingRent: pg.pricing.monthlyRent, roomTypeLabels: [...new Set(pg.rooms.map((r) => r.roomType))], amenities: pg.amenities };
}
export const statusLabel = (status: EnquiryStatus | VisitStatus) => status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());
export const statusTone = (status: EnquiryStatus | VisitStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' => ['COMPLETED', 'CONFIRMED', 'VISIT_SCHEDULED', 'CONTACTED'].includes(status) ? 'success' : ['REJECTED', 'CANCELLED', 'NO_SHOW'].includes(status) ? 'error' : ['NEW', 'REQUESTED', 'RESCHEDULE_REQUESTED'].includes(status) ? 'warning' : 'neutral';
